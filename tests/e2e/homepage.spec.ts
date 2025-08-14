import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto("/");
  });

  test("should load homepage successfully", async ({ page }) => {
    // Check that page loads without errors
    await expect(page).toHaveTitle(/Century 360/);

    // Check for main content
    await expect(page.locator("text=Century Enterprise 360° Portal")).toBeVisible();
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });

  test("should display navigation elements", async ({ page }) => {
    // Check top navigation
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("text=Century 360°")).toBeVisible();

    // Check navigation links
    await expect(page.locator('a[href="/catalog"]')).toBeVisible();
    await expect(page.locator('a[href="/orders"]')).toBeVisible();
    await expect(page.locator('a[href="/reports"]')).toBeVisible();
    await expect(page.locator('a[href="/admin"]')).toBeVisible();
  });

  test("should display sidebar navigation", async ({ page }) => {
    // Check sidebar elements
    await expect(page.locator("text=MAIN NAVIGATION")).toBeVisible();
    await expect(page.locator("text=Product Catalog")).toBeVisible();
    await expect(page.locator("text=Orders")).toBeVisible();
    await expect(page.locator("text=Analytics")).toBeVisible();
    await expect(page.locator("text=Admin Panel")).toBeVisible();

    // Check quick actions
    await expect(page.locator("text=QUICK ACTIONS")).toBeVisible();
    await expect(page.locator("text=Add Product")).toBeVisible();
    await expect(page.locator("text=New Order")).toBeVisible();
  });

  test("should display welcome section with action cards", async ({ page }) => {
    // Check welcome section
    await expect(page.locator("text=Welcome to Century 360°")).toBeVisible();

    // Check action cards
    await expect(page.locator("text=Weekly Briefing")).toBeVisible();
    await expect(page.locator("text=Set Reminder")).toBeVisible();
    await expect(page.locator("text=Follow-Up")).toBeVisible();
    await expect(page.locator("text=Open Ticket")).toBeVisible();
  });

  test("should display AI sales analysis", async ({ page }) => {
    // Check AI analysis section
    await expect(page.locator("text=AI Sales Performance Analysis")).toBeVisible();

    // Check analysis content
    await expect(page.locator("text=Sales performance shows mixed results")).toBeVisible();
    await expect(page.locator("text=Big Box channel showing strongest momentum")).toBeVisible();
  });

  test("should display system overview stats", async ({ page }) => {
    // Check system overview section
    await expect(page.locator("text=System Overview")).toBeVisible();

    // Check stat cards
    await expect(page.locator("text=Products")).toBeVisible();
    await expect(page.locator("text=Variants")).toBeVisible();
    await expect(page.locator("text=Colors")).toBeVisible();
    await expect(page.locator("text=Sizes")).toBeVisible();
  });

  test("should display call-to-action section", async ({ page }) => {
    // Check CTA section
    await expect(page.locator("text=Ready to get started?")).toBeVisible();

    // Check CTA buttons
    await expect(page.locator('a[href="/catalog"] >> text=Get Started')).toBeVisible();
    await expect(page.locator('a[href="/admin"] >> text=Learn More')).toBeVisible();
  });

  test("should handle navigation interactions", async ({ page }) => {
    // Test catalog navigation
    await page.click('a[href="/catalog"]');
    await expect(page).toHaveURL(/.*catalog/);

    // Go back to homepage
    await page.goto("/");

    // Test admin navigation
    await page.click('a[href="/admin"]');
    await expect(page).toHaveURL(/.*admin/);
  });

  test("should handle responsive design", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that sidebar is hidden on mobile
    await expect(page.locator("text=MAIN NAVIGATION")).not.toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check that navigation links are visible
    await expect(page.locator('a[href="/catalog"]')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Check that sidebar is visible
    await expect(page.locator("text=MAIN NAVIGATION")).toBeVisible();
  });

  test("should handle user interactions", async ({ page }) => {
    // Test search functionality
    const searchButton = page.locator('button[aria-label="Search"]');
    await expect(searchButton).toBeVisible();

    // Test notifications
    const notificationsButton = page.locator('button[aria-label="Notifications"]');
    await expect(notificationsButton).toBeVisible();

    // Test user menu
    const userMenuButton = page.locator('button[aria-haspopup="menu"]');
    await expect(userMenuButton).toBeVisible();

    // Open user menu
    await userMenuButton.click();

    // Check menu items
    await expect(page.locator("text=Profile")).toBeVisible();
    await expect(page.locator("text=Settings")).toBeVisible();
    await expect(page.locator("text=Security")).toBeVisible();
    await expect(page.locator("text=Sign out")).toBeVisible();
  });

  test("should handle accessibility features", async ({ page }) => {
    // Check for proper heading hierarchy
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper button roles
    const buttons = await page.locator("button").all();
    buttons.forEach(async button => {
      const role = await button.getAttribute("role");
      const ariaLabel = await button.getAttribute("aria-label");
      expect(role === "button" || ariaLabel).toBeTruthy();
    });

    // Check for proper navigation structure
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("should handle loading states gracefully", async ({ page }) => {
    // Check that page loads without loading spinners
    const loadingSpinners = page.locator('[role="progressbar"], .chakra-spinner');
    await expect(loadingSpinners).toHaveCount(0);

    // Check that content is immediately visible
    await expect(page.locator("text=Century Enterprise 360° Portal")).toBeVisible();
  });

  test("should handle error states gracefully", async ({ page }) => {
    // Mock network error by going offline
    await page.context().setOffline(true);

    // Reload page
    await page.reload();

    // Should still show basic content
    await expect(page.locator("text=Century 360°")).toBeVisible();

    // Go back online
    await page.context().setOffline(false);
  });

  test("should maintain performance standards", async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Check for no console errors
    const consoleErrors: string[] = [];
    page.on("console", msg => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();

    // Should have no console errors
    expect(consoleErrors).toHaveLength(0);
  });
});
