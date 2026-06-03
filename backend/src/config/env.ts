import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default("postgresql://postgres:admin%20123@localhost:54320/ferremas_db?schema=public"),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(8).default("change-me"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_USERNAME: z.string().min(3).default("admin"),
  ADMIN_PASSWORD: z.string().min(6).default("admin123"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(14).default(10)
});

export const env = envSchema.parse(process.env);
