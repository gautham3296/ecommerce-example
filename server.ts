import express from "express";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import crypto from "crypto";
import mysql from "mysql2/promise";
import { products as initialProducts } from "./src/data/products";

dotenv.config();

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^['"]|['"]$/g, "");
}

let pool: any = null;
let dbConnectionStatus: "idle" | "connected" | "error" | "not_configured" = "idle";
let dbLastError: string | null = null;

async function getDbPool() {
  if (pool) return pool;

  const host = cleanEnv(process.env.HOSTINGER_DB_HOST);
  const user = cleanEnv(process.env.HOSTINGER_DB_USER);
  const password = cleanEnv(process.env.HOSTINGER_DB_PASSWORD);
  const database = cleanEnv(process.env.HOSTINGER_DB_NAME);
  const portStr = cleanEnv(process.env.HOSTINGER_DB_PORT);
  const port = portStr ? parseInt(portStr) : 3306;

  if (!host || !user || !database) {
    console.log("⚠️ Hostinger MySQL credentials not fully configured in env variables. Operating in Offline Sandbox LocalStorage storage.");
    dbConnectionStatus = "not_configured";
    return null;
  }

  try {
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
    });

    // Test connectivity and bootstrap
    const connection = await pool.getConnection();
    console.log("✅ Successfully reached and verified connection to Hostinger MySQL Database!");
    dbConnectionStatus = "connected";
    dbLastError = null;

    await connection.query(`
      CREATE TABLE IF NOT EXISTS nalam_orders (
        id VARCHAR(100) PRIMARY KEY,
        payment_id VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        consignee_name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(50) NOT NULL,
        shipping_address TEXT NOT NULL,
        shipping_state VARCHAR(100) NOT NULL,
        shipping_pincode VARCHAR(20) NOT NULL
      )
    `);

    // Add status and tracking_id columns if they don't already exist
    try {
      await connection.query("ALTER TABLE nalam_orders ADD COLUMN status VARCHAR(50) DEFAULT 'Processing'");
    } catch (err: any) {
      // Column likely already exists, ignore
    }
    try {
      await connection.query("ALTER TABLE nalam_orders ADD COLUMN tracking_id VARCHAR(100) DEFAULT NULL");
    } catch (err: any) {
      // Column likely already exists, ignore
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS nalam_order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(100) NOT NULL,
        item_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        scientific_name VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        hero_image TEXT,
        FOREIGN KEY (order_id) REFERENCES nalam_orders(id) ON DELETE CASCADE
      )
    `);

    // Bootstrap nalam_products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS nalam_products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        scientific_name VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2) DEFAULT NULL,
        description TEXT NOT NULL,
        short_description TEXT NOT NULL,
        flavor_profile TEXT NOT NULL,
        tags VARCHAR(512) NOT NULL,
        category VARCHAR(100) NOT NULL,
        hero_image TEXT NOT NULL,
        secondary_image TEXT,
        benefits TEXT NOT NULL,
        contraindications TEXT NOT NULL,
        brewing_ritual TEXT NOT NULL
      )
    `);

    // Check if table has any rows. If 0, seed first
    const [prodRows] = await connection.query("SELECT COUNT(*) as count FROM nalam_products");
    if ((prodRows as any)[0].count === 0) {
      console.log("🌱 Database connected. Seeding nalam_products table with initial botanical portfolio...");
      for (const p of initialProducts) {
        await connection.query(
          `INSERT INTO nalam_products (id, name, scientific_name, price, original_price, description, short_description, flavor_profile, tags, category, hero_image, secondary_image, benefits, contraindications, brewing_ritual)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id,
            p.name,
            p.scientificName || "",
            p.price,
            p.originalPrice || null,
            p.description,
            p.shortDescription || "",
            p.flavorProfile || "",
            p.tags ? p.tags.join(",") : "",
            p.category,
            p.heroImage,
            p.secondaryImage || null,
            JSON.stringify(p.benefits || []),
            JSON.stringify(p.contraindications || []),
            JSON.stringify(p.brewingRitual || [])
          ]
        );
      }
      console.log("🌱 Seeding finished successfully.");
    }

    connection.release();
    return pool;
  } catch (err: any) {
    console.error("❌ Hostinger DB Connection Error in bootstrap:", err.message);
    dbConnectionStatus = "error";
    dbLastError = err.message || String(err);
    pool = null;
    return null;
  }
}

export const app = express();
const PORT = 3000;

app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // DB Status API for Diagnostics Dashboard
  app.get("/api/db-status", (req, res) => {
    res.json({
      status: dbConnectionStatus,
      lastError: dbLastError,
      config: {
        host: cleanEnv(process.env.HOSTINGER_DB_HOST),
        database: cleanEnv(process.env.HOSTINGER_DB_NAME),
        user: cleanEnv(process.env.HOSTINGER_DB_USER),
        port: cleanEnv(process.env.HOSTINGER_DB_PORT) || "3306"
      }
    });
  });

  // Force DB connection retry (for debugging)
  app.post("/api/db-retry", async (req, res) => {
    pool = null; // Clear existing pool
    const testPool = await getDbPool();
    if (testPool) {
      res.json({ success: true, status: "connected", message: "Successfully established DB connection." });
    } else {
      res.json({ success: false, status: dbConnectionStatus, lastError: dbLastError });
    }
  });

  // Razorpay Order creation endpoint
  app.post("/api/payment/order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt } = req.body;
      
      const keyId = cleanEnv(req.headers["x-razorpay-key-id"] as string || process.env.RAZORPAY_KEY_ID) || "rzp_test_StVjnhHWb9zVjk";
      const keySecret = cleanEnv(req.headers["x-razorpay-key-secret"] as string || process.env.RAZORPAY_KEY_SECRET) || "kBIl1wBtr7twSUZ0yr5d1Wdi";

      if (!keyId || !keySecret) {
        return res.status(500).json({ error: "Razorpay credentials are not configured" });
      }

      // Create Razorpay Order via their REST API using built-in fetch
      const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert standard amount (INR) to paise
          currency: currency,
          receipt: receipt || `rec_${Date.now()}`
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Razorpay API Error:", errText);
        return res.status(response.status).json({ error: "Razorpay API error", details: errText });
      }

      const orderData = await response.json();
      res.json({
        ...orderData,
        keyId // Pass keyId dynamically to frontend so it is never hardcoded
      });
    } catch (e: any) {
      console.error("Razorpay Order Exception:", e);
      res.status(500).json({ error: "Internal payment processing error", message: e.message });
    }
  });

  // Razorpay Signature verification endpoint
  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, items, shipping } = req.body;
      
      const keySecret = cleanEnv(process.env.RAZORPAY_KEY_SECRET) || "kBIl1wBtr7twSUZ0yr5d1Wdi";

      if (!keySecret) {
        return res.status(500).json({ error: "Razorpay secret key not found" });
      }

      // Validate authenticity of response
      const hmac = crypto.createHmac("sha256", keySecret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature === razorpay_signature) {
        let savedToMySql = false;
        try {
          const dbPool = await getDbPool();
          if (dbPool && shipping && items) {
            // Check if order already exists to support idempotency/retries safely
            const [existing] = await dbPool.query("SELECT id FROM nalam_orders WHERE id = ?", [razorpay_order_id]);
            if ((existing as any[]).length === 0) {
              await dbPool.query(
                `INSERT INTO nalam_orders (id, payment_id, date, amount, consignee_name, contact_number, shipping_address, shipping_state, shipping_pincode)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  razorpay_order_id,
                  razorpay_payment_id,
                  new Date().toISOString(),
                  amount || 0,
                  shipping.name,
                  shipping.contact,
                  shipping.address,
                  shipping.state,
                  shipping.pincode
                ]
              );

              for (const item of items) {
                await dbPool.query(
                  `INSERT INTO nalam_order_items (order_id, item_id, name, scientific_name, price, quantity, hero_image)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`,
                  [
                    razorpay_order_id,
                    String(item.id),
                    item.name,
                    item.scientificName || "",
                    item.price,
                    item.quantity,
                    item.heroImage || ""
                  ]
                );
              }
              savedToMySql = true;
              console.log(`✅ Saved Razorpay verified order ${razorpay_order_id} to MySQL successfully.`);
            } else {
              savedToMySql = true;
              console.log(`ℹ️ Order ${razorpay_order_id} already exists in database, skipping insert.`);
            }
          }
        } catch (dbErr: any) {
          console.error("⚠️ Failed to write verified order to Hostinger MySQL Database:", dbErr.message);
        }

        res.json({ success: true, message: "Payment validated and verified successfully.", savedToMySql });
      } else {
        console.error("Signature verification failed:", { generatedSignature, razorpay_signature });
        res.status(400).json({ success: false, error: "Payment verification failed: invalid signature" });
      }
    } catch (e: any) {
      console.error("Razorpay Verification Exception:", e);
      res.status(500).json({ error: "Internal verification processing error", message: e.message });
    }
  });

  // Simulated Checkout Endpoint
  app.post("/api/checkout", async (req, res) => {
    try {
      const { items, total, shipping } = req.body;
      const orderId = `NLM-${Math.floor(Math.random() * 1000000)}`;
      console.log("Processing simulated order:", { items, total, shipping });

      let savedToMySql = false;
      try {
        const dbPool = await getDbPool();
        if (dbPool && shipping && items) {
          const parsedAmount = total || items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
          await dbPool.query(
            `INSERT INTO nalam_orders (id, payment_id, date, amount, consignee_name, contact_number, shipping_address, shipping_state, shipping_pincode)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              "simulated_checkout_validated",
              new Date().toISOString(),
              parsedAmount,
              shipping.name || "Guest User",
              shipping.contact || "0000000000",
              shipping.address || "Simulated Delivery Address",
              shipping.state || "Tamil Nadu",
              shipping.pincode || "600001"
            ]
          );

          for (const item of items) {
            await dbPool.query(
              `INSERT INTO nalam_order_items (order_id, item_id, name, scientific_name, price, quantity, hero_image)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                orderId,
                String(item.id),
                item.name,
                item.scientificName || "",
                item.price,
                item.quantity,
                item.heroImage || ""
              ]
            );
          }
          savedToMySql = true;
          console.log(`✅ Saved simulated order ${orderId} to MySQL database successfully.`);
        }
      } catch (dbErr: any) {
        console.error("⚠️ Failed to save simulated order to MySQL:", dbErr.message);
      }

      res.json({ 
        success: true, 
        orderId,
        savedToMySql,
        message: "Order confirmed. Your premium organic blends are being prepared." 
      });
    } catch (e: any) {
      console.error("Checkout Exception:", e);
      res.status(500).json({ error: "Internal checkout error", message: e.message });
    }
  });

  // Lookup endpoint matching name & contact
  app.get("/api/orders/lookup", async (req, res) => {
    try {
      const { name, contact } = req.query;
      if (!name || !contact) {
        return res.status(400).json({ error: "Name and contact query parameters are required" });
      }

      const dbPool = await getDbPool();
      if (!dbPool) {
        return res.json({ source: "fallback", orders: [] });
      }

      const normalizedInputName = String(name).trim().toLowerCase();
      const normalizedInputContact = String(contact).trim().replace(/\s+/g, '');

      const [rows] = await dbPool.query(`SELECT * FROM nalam_orders`);

      const matchedOrders: any[] = [];
      for (const order of (rows as any[])) {
        const dbName = (order.consignee_name || '').trim().toLowerCase();
        const dbContact = (order.contact_number || '').trim().replace(/\s+/g, '');

        if (dbName === normalizedInputName && dbContact === normalizedInputContact) {
          const [itemRows] = await dbPool.query("SELECT * FROM nalam_order_items WHERE order_id = ?", [order.id]);

          matchedOrders.push({
            id: order.id,
            paymentId: order.payment_id,
            date: order.date,
            amount: Number(order.amount),
            status: order.status || 'Processing',
            trackingId: order.tracking_id || null,
            shipping: {
              name: order.consignee_name,
              contact: order.contact_number,
              address: order.shipping_address,
              state: order.shipping_state,
              pincode: order.shipping_pincode
            },
            items: (itemRows as any[]).map(i => ({
              id: i.item_id,
              name: i.name,
              scientificName: i.scientific_name,
              price: Number(i.price),
              quantity: i.quantity,
              heroImage: i.hero_image
            }))
          });
        }
      }

      res.json({ source: "mysql", orders: matchedOrders });
    } catch (e: any) {
      console.error("Error performing lookup via MySQL:", e);
      res.status(500).json({ error: "Internal lookup query failed", message: e.message });
    }
  });

  // Admin orders fetch
  app.get("/api/orders/all", async (req, res) => {
    try {
      const dbPool = await getDbPool();
      if (!dbPool) {
        return res.json({ source: "fallback", orders: [] });
      }

      const [orderRows] = await dbPool.query("SELECT * FROM nalam_orders ORDER BY date DESC");
      
      const formattedOrders = [];
      for (const order of (orderRows as any[])) {
        const [itemRows] = await dbPool.query("SELECT * FROM nalam_order_items WHERE order_id = ?", [order.id]);
        
        formattedOrders.push({
          id: order.id,
          paymentId: order.payment_id,
          date: order.date,
          amount: Number(order.amount),
          status: order.status || 'Processing',
          trackingId: order.tracking_id || null,
          shipping: {
            name: order.consignee_name,
            contact: order.contact_number,
            address: order.shipping_address,
            state: order.shipping_state,
            pincode: order.shipping_pincode
          },
          items: (itemRows as any[]).map(i => ({
            id: i.item_id,
            name: i.name,
            scientificName: i.scientific_name,
            price: Number(i.price),
            quantity: i.quantity,
            heroImage: i.hero_image
          }))
        });
      }

      res.json({ source: "mysql", orders: formattedOrders });
    } catch (e: any) {
      console.error("MySQL Admin order list fetch failed:", e);
      res.status(500).json({ error: "Database retrieval error", message: e.message });
    }
  });

  // Update order status/tracking info remotely (Hostinger DB)
  app.post("/api/orders/update-status", async (req, res) => {
    try {
      const { orderId, status, trackingId } = req.body;
      if (!orderId || !status) {
        return res.status(400).json({ error: "orderId and status are required fields" });
      }

      const dbPool = await getDbPool();
      if (dbPool) {
        await dbPool.query(
          "UPDATE nalam_orders SET status = ?, tracking_id = ? WHERE id = ?",
          [status, trackingId || null, orderId]
        );
        return res.json({ success: true, message: `Successfully updated order ${orderId} status to ${status}.` });
      }

      // Return success false if offline so frontend knows to update local storage only
      res.json({ success: false, error: "Database not connected for remote update" });
    } catch (e: any) {
      console.error("Failed to update status in Hostinger MySQL:", e);
      res.status(500).json({ error: "Failed to update order status", message: e.message });
    }
  });

  // Wipe database tables
  app.post("/api/orders/wipe", async (req, res) => {
    try {
      const dbPool = await getDbPool();
      if (dbPool) {
        await dbPool.query("DELETE FROM nalam_order_items");
        await dbPool.query("DELETE FROM nalam_orders");
        return res.json({ success: true, message: "Hostinger MySQL database tables successfully cleared." });
      }
      res.status(400).json({ success: false, error: "Database not connected" });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to clear database logs", message: e.message });
    }
  });

  // Get dynamic product catalog from Hostinger MySQL
  app.get("/api/products", async (req, res) => {
    try {
      const dbPool = await getDbPool();
      if (!dbPool) {
        return res.json({ source: "fallback", products: [] });
      }
      const [rows] = await dbPool.query("SELECT * FROM nalam_products");
      const formattedProducts = (rows as any[]).map(r => ({
        id: r.id,
        name: r.name,
        scientificName: r.scientific_name,
        price: Number(r.price),
        originalPrice: r.original_price ? Number(r.original_price) : undefined,
        description: r.description,
        shortDescription: r.short_description || "",
        flavorProfile: r.flavor_profile || "",
        tags: r.tags ? r.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        category: r.category,
        heroImage: r.hero_image,
        secondaryImage: r.secondary_image || undefined,
        benefits: r.benefits ? JSON.parse(r.benefits) : [],
        contraindications: r.contraindications ? JSON.parse(r.contraindications) : [],
        brewingRitual: r.brewing_ritual ? JSON.parse(r.brewing_ritual) : []
      }));
      res.json({ source: "mysql", products: formattedProducts });
    } catch (e: any) {
      console.error("Failed to fetch products from Hostinger DB:", e);
      res.status(500).json({ error: "Failed to fetch products", message: e.message });
    }
  });

  // Create or Update a product in Hostinger MySQL
  app.post("/api/products/upsert", async (req, res) => {
    try {
      const {
        id,
        name,
        scientificName,
        price,
        originalPrice,
        description,
        shortDescription,
        flavorProfile,
        tags,
        category,
        heroImage,
        secondaryImage,
        benefits,
        contraindications,
        brewingRitual
      } = req.body;

      if (!id || !name || price === undefined) {
        return res.status(400).json({ error: "id, name, and price are required fields." });
      }

      const dbPool = await getDbPool();
      if (!dbPool) {
        return res.json({ success: false, error: "Database not connected for product updation." });
      }

      const benefitsStr = Array.isArray(benefits) ? JSON.stringify(benefits) : JSON.stringify([]);
      const contraindicationsStr = Array.isArray(contraindications) ? JSON.stringify(contraindications) : JSON.stringify([]);
      const brewingRitualStr = Array.isArray(brewingRitual) ? JSON.stringify(brewingRitual) : JSON.stringify([]);
      const tagsStr = Array.isArray(tags) ? tags.join(",") : (tags || "");

      const [existing] = await dbPool.query("SELECT id FROM nalam_products WHERE id = ?", [id]);
      if ((existing as any[]).length > 0) {
        await dbPool.query(
          `UPDATE nalam_products SET 
            name = ?, 
            scientific_name = ?, 
            price = ?, 
            original_price = ?, 
            description = ?, 
            short_description = ?, 
            flavor_profile = ?, 
            tags = ?, 
            category = ?, 
            hero_image = ?, 
            secondary_image = ?, 
            benefits = ?, 
            contraindications = ?, 
            brewing_ritual = ? 
           WHERE id = ?`,
          [
            name,
            scientificName || "",
            price,
            originalPrice ? Number(originalPrice) : null,
            description || "",
            shortDescription || "",
            flavorProfile || "",
            tagsStr,
            category,
            heroImage,
            secondaryImage || null,
            benefitsStr,
            contraindicationsStr,
            brewingRitualStr,
            id
          ]
        );
      } else {
        await dbPool.query(
          `INSERT INTO nalam_products (id, name, scientific_name, price, original_price, description, short_description, flavor_profile, tags, category, hero_image, secondary_image, benefits, contraindications, brewing_ritual)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            name,
            scientificName || "",
            price,
            originalPrice ? Number(originalPrice) : null,
            description || "",
            shortDescription || "",
            flavorProfile || "",
            tagsStr,
            category,
            heroImage,
            secondaryImage || null,
            benefitsStr,
            contraindicationsStr,
            brewingRitualStr
          ]
        );
      }

      res.json({ success: true, message: `Successfully saved product ${name} (${id})` });
    } catch (e: any) {
      console.error("Failed to upsert product in Hostinger DB:", e);
      res.status(500).json({ error: "Failed to save product", message: e.message });
    }
  });

  // Delete a product from Hostinger MySQL
  app.post("/api/products/delete", async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Product id is required for deletion." });
      }

      const dbPool = await getDbPool();
      if (!dbPool) {
        return res.json({ success: false, error: "Database not connected for deletion." });
      }

      // Check if product exists first
      await dbPool.query("DELETE FROM nalam_products WHERE id = ?", [id]);
      res.json({ success: true, message: `Successfully deleted product with ID: ${id}` });
    } catch (e: any) {
      console.error("Failed to delete product in Hostinger DB:", e);
      res.status(500).json({ error: "Failed to delete product", message: e.message });
    }
  });

  // Gemini Herbal Recommender
  app.post("/api/recommend", async (req, res) => {
    try {
      const { concern } = req.body;
      const apiKey = cleanEnv(process.env.GEMINI_API_KEY);
      if (!apiKey) {
        return res.status(500).json({ error: "API Key missing" });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an expert botanical wellness guide for "Organic Ecommerce". 
      A customer is asking for a recommendation for: "${concern}".
      Based on our product range (Betel Leaves, Moringa, Tulasi, Avarampoo, Jamun, Curry, Horse Gram), 
      recommend the ONE best blend of our herbal infusions. Explain why in 2 concise sentences. 
      Format: "Recommendation: [Name] | [Explanation]"`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      res.json({ recommendation: responseText });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to fetch recommendation" });
    }
  });

  // Vite integration and server listener (only if process.env.NETLIFY !== "true")
  async function configureAndListen() {
    if (process.env.NETLIFY === "true") {
      console.log("⚡ Netlify Serverless environment detected. Skipping standalone local port listener.");
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  configureAndListen();
