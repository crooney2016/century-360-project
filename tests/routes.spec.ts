import { test, expect } from "@playwright/test";

const routes = ["/", "/admin", "/admin/products", "/admin/variants", "/dev/seed-status", "/ui"];

test.describe("route smoke", () => {
  for (const path of routes) {
    test(`GET ${path} renders without console errors`, async ({ page }) => {
      const logs = [];
      page.on("console", msg => {
        const type = msg.type();
        if (type === "error") logs.push(msg.text());
      });
      const res = await page.goto(`http://localhost:3005${path}`, { waitUntil: "networkidle" });
      expect(res?.ok()).toBeTruthy();
      expect(logs).toEqual([]); // fail if any console.error was emitted
    });
  }
});
