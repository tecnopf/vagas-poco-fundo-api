import dotenv from "dotenv";
import path from "path";


if (process.env.NODE_ENV !== "production") {
  if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: ".env.development" });
    dotenv.config({ path: ".env.local-ip" });
  } else if (process.env.NODE_ENV === "dev-prod") {
    dotenv.config({ path: ".env.dev-prod" });
    dotenv.config({ path: ".env.local-ip" });
  }
  else if (process.env.NODE_ENV === "demo-prod") {
    dotenv.config({ path: ".env.demo-prod" });
    dotenv.config({ path: ".env.local-ip" });
  }
}

export const IS_PRODUCTION = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "dev-prod" || process.env.NODE_ENV === "demo-prod"

export const ADMIN_PASSWORD = process.env.ADMIN_KEY;
export const JWT_SECRET = process.env.JWT_SECRET
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASS = process.env.MAIL_PASS
export const FRONTEND_URL = process.env.FRONTEND_URL
export const LOCAL_IP = process.env.LOCAL_IP
export const FTP_HOST = process.env.FTP_HOST
export const FTP_USER = process.env.FTP_USER
export const FTP_PASSWORD = process.env.FTP_PASSWORD
export const FTP_SECURE = process.env.FTP_SECURE
export const BASE_URL = process.env.BASE_URL


if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_KEY not defined in environment variables");
}

if(!JWT_SECRET){
  throw new Error('JWT_SECRET not defined in environment variables')
}

if(!MAIL_USER){
  throw new Error('MAIL_USER not defined in environment variables')
}

if(!MAIL_PASS){
  throw new Error('MAIL_PASS not defined in environment variables')
}

if(!FRONTEND_URL){
  throw new Error('FRONTEND_URL not defined in environment variables')
}

if(!FTP_HOST){
  throw new Error('FTP_HOST not defined in environment variables')
}
if(!FTP_USER){
  throw new Error('FTP_USER not defined in environment variables')
}
if(!FTP_PASSWORD){
  throw new Error('FTP_PASSWORD not defined in environment variables')
}
if(!FTP_SECURE){
  throw new Error('FTP_SECURE not defined in environment variables')
}
if(!BASE_URL){
  throw new Error('BASE_URL not defined in environment variables')
}

if(IS_PRODUCTION && !process.env.DATABASE_URL){
  throw new Error("DATABASE_URL not defined in environment variables");
}

