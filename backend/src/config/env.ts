import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default("postgresql://luxury:luxury@localhost:5432/luxury_ops?schema=public"),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(8).default("change-me"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000")
});

export const env = envSchema.parse(process.env);
