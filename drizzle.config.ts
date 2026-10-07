import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./packages/database/schema.ts",
  out: "./packages/database/migrations",
});
