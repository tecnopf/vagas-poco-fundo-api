import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: ".env.development" });
  } else if (process.env.NODE_ENV === "dev-prod") {
    dotenv.config({ path: ".env.dev-prod" });
  }
  else if (process.env.NODE_ENV === "demo-prod") {
    dotenv.config({ path: ".env.demo-prod" });
  }
}

export const IS_PRODUCTION = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "dev-prod" || process.env.NODE_ENV === "demo-prod"

export const ADMIN_PASSWORD = process.env.ADMIN_KEY;
if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_KEY not defined in environment variables");
}

if(IS_PRODUCTION && !process.env.DATABASE_URL){
  throw new Error("DATABASE_URL not defined in environment variables");
}
