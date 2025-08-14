import { test, expect } from "@playwright/test";

test.describe("admin/products interactions", () => {
  test("table renders rows and search + filters are interactive", async ({ page }) => {
    // Capture errors to fail with signal
    const errors = [];
    page.on("pageerror", err => errors.push(`pageerror: ${err.message}`));
    page.on("console", msg => {
      if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
    });

    await page.goto("/admin/products", { waitUntil: "networkidle" });

    // Fail fast if Next error overlay appears
    const errorOverlay = page.getByRole("heading", { name: /Application error/i });
    await expect(errorOverlay).toHaveCount(0, { timeout: 5000 });

    // Page heading visible
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible({ timeout: 10000 });

    // Table header visible
    await expect(page.locator("thead th", { hasText: "Item #" })).toBeVisible();

    // Rows render
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible();

    // Interact with filters
    const departmentsBtn = page.getByRole("button", { name: /^Departments/ });
    await departmentsBtn.click();
    const deptSearch = page.getByPlaceholder(/Search departments/i);
    await expect(deptSearch).toBeVisible();
    await deptSearch.fill("App");
    await expect(page.getByRole("checkbox").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(deptSearch).toBeHidden();

    // Open Classes dropdown
    const classesBtn = page.getByRole("button", { name: /^Classes/ });
    await classesBtn.click();
    const classSearch = page.getByPlaceholder(/Search classes/i);
    await expect(classSearch).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(classSearch).toBeHidden();

    // Use the main search input
    const mainSearch = page.getByPlaceholder("Search products…");
    await mainSearch.fill("belt");

    // Wait for search to complete and rows still visible
    await expect(rows.first()).toBeVisible();

    // Assert no captured errors
    expect(errors, errors.join("\n")).toEqual([]);
  });
});
