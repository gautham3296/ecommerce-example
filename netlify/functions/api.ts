import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();

// Enforce NETLIFY-specific environment markers
process.env.NETLIFY = "true";

import { app } from "../../server";

// Export the serverless-packaged Express app as the handler
export const handler = serverless(app);
