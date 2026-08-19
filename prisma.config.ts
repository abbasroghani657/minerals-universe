import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node ./prisma/seed.js",
  },
  datasource: {
    url: process.env.DATABASE_URL || "mysql://root:maaz@localhost:3306/abbasshoping",
  },
});

