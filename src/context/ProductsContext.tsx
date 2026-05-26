/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { products as staticProducts } from '../data/products';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  isDbConnected: boolean;
  refreshProducts: () => Promise<void>;
  upsertProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (data.source === "mysql" && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          localStorage.setItem("nalam_cached_products", JSON.stringify(data.products));
          setIsDbConnected(true);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not reach backend /api/products, falling back to local cache or static products:", err);
    }

    // Fallback: LocalStorage Cache or Static Array
    const cached = localStorage.getItem("nalam_cached_products");
    if (cached) {
      try {
        setProducts(JSON.parse(cached));
      } catch (e) {
        setProducts(staticProducts);
      }
    } else {
      setProducts(staticProducts);
    }
    setIsDbConnected(false);
  };

  useEffect(() => {
    loadProducts().finally(() => setLoading(false));
  }, []);

  const upsertProduct = async (product: Product): Promise<boolean> => {
    let remoteSuccess = false;
    try {
      const res = await fetch("/api/products/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          remoteSuccess = true;
        }
      }
    } catch (err) {
      console.error("Failed to save product remotely:", err);
    }

    // Always update local storage cache immediately for zero lag & offline support
    setProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      let updatedProducts: Product[];
      if (exists) {
        updatedProducts = prev.map(p => p.id === product.id ? product : p);
      } else {
        updatedProducts = [...prev, product];
      }
      localStorage.setItem("nalam_cached_products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    return remoteSuccess;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    let remoteSuccess = false;
    try {
      const res = await fetch("/api/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          remoteSuccess = true;
        }
      }
    } catch (err) {
      console.error("Failed to delete product remotely:", err);
    }

    // Always update local storage cache immediately for zero lag & offline support
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== id);
      localStorage.setItem("nalam_cached_products", JSON.stringify(filtered));
      return filtered;
    });

    return remoteSuccess;
  };

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      isDbConnected,
      refreshProducts: loadProducts,
      upsertProduct,
      deleteProduct
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
