import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: "http://localhost:3005",
  },
  webServer: {
    command: "pnpm build && pnpm start -p 3005",
    port: 3005,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
