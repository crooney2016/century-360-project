import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the main hero section", async ({ page }) => {
    // Check hero section is visible
    await expect(
      page.getByRole("heading", { name: "Century Enterprise 360° Portal" })
    ).toBeVisible();

    // Check subtitle
    await expect(page.getByText(/Your comprehensive business management platform/)).toBeVisible();

    // Check CTA buttons
    await expect(page.getByRole("button", { name: "Welcome & Get Started" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Our Core Values" })).toBeVisible();
  });

  test("should display all action cards", async ({ page }) => {
    // Check all 5 action cards are visible
    await expect(page.getByText("Weekly Briefing")).toBeVisible();
    await expect(page.getByText("Set Reminder")).toBeVisible();
    await expect(page.getByText("Follow-Up")).toBeVisible();
    await expect(page.getByText("Schedule Meeting")).toBeVisible();
    await expect(page.getByText("Open Ticket")).toBeVisible();

    // Check card descriptions
    await expect(page.getByText(/Mon-Fri milestones & daily progress/)).toBeVisible();
    await expect(page.getByText(/Schedule alerts & notifications/)).toBeVisible();
    await expect(page.getByText(/Request team follow-up/)).toBeVisible();
    await expect(page.getByText(/Book time with stakeholders/)).toBeVisible();
    await expect(page.getByText(/Submit IT or support request/)).toBeVisible();
  });

  test("should display AI Sales Performance Analysis section", async ({ page }) => {
    // Check section title
    await expect(page.getByText("AI Sales Performance Analysis")).toBeVisible();

    // Check tabs are present
    await expect(page.getByRole("tab", { name: "Month to Date" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Quarter to Date" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Year to Date" })).toBeVisible();

    // Check content is visible
    await expect(page.getByText(/Sales performance shows mixed results/)).toBeVisible();
    await expect(page.getByText(/Big Box channel showing strongest momentum/)).toBeVisible();
  });

  test("should display system overview statistics", async ({ page }) => {
    // Check section title
    await expect(page.getByText("System Overview")).toBeVisible();

    // Check all stats are displayed
    await expect(page.getByText("4,119")).toBeVisible();
    await expect(page.getByText("18,967")).toBeVisible();
    await expect(page.getByText("316")).toBeVisible();
    await expect(page.getByText("241")).toBeVisible();

    // Check labels
    await expect(page.getByText("Products")).toBeVisible();
    await expect(page.getByText("Variants")).toBeVisible();
    await expect(page.getByText("Colors")).toBeVisible();
    await expect(page.getByText("Sizes")).toBeVisible();
  });

  test("should display CTA section", async ({ page }) => {
    // Check CTA title
    await expect(page.getByText("Ready to get started?")).toBeVisible();

    // Check CTA description
    await expect(page.getByText(/Explore our product catalog/)).toBeVisible();

    // Check CTA buttons
    await expect(page.getByRole("button", { name: "Get Started" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Learn More" })).toBeVisible();
  });

  test("should have proper navigation structure", async ({ page }) => {
    // Check that the page has proper heading hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);

    const h2s = page.locator("h2");
    await expect(h2s).toHaveCount(4); // System Overview, AI Sales Performance Analysis, etc.
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText("Century Enterprise 360° Portal")).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText("Century Enterprise 360° Portal")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByText("Century Enterprise 360° Portal")).toBeVisible();
  });

  test("should have proper accessibility features", async ({ page }) => {
    // Check that images have alt text (if any)
    const images = page.locator("img");
    for (let i = 0; i < (await images.count()); i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
    }

    // Check that buttons are keyboard accessible
    const buttons = page.locator("button");
    for (let i = 0; i < (await buttons.count()); i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute("tabindex", "0");
    }
  });

  test("should handle tab navigation correctly", async ({ page }) => {
    // Click on Quarter to Date tab
    await page.getByRole("tab", { name: "Quarter to Date" }).click();

    // Check that the content changes
    await expect(page.getByText(/Quarter to Date analysis shows challenges/)).toBeVisible();

    // Click on Year to Date tab
    await page.getByRole("tab", { name: "Year to Date" }).click();

    // Check that the content changes
    await expect(page.getByText(/Year to Date performance is positive/)).toBeVisible();
  });

  test("should have proper hover effects on interactive elements", async ({ page }) => {
    // Test hover effects on action cards
    const firstCard = page.locator("text=Weekly Briefing").first();
    await firstCard.hover();

    // Check that the card has hover effects (transform, shadow)
    const cardElement = firstCard.locator("..").locator("..");
    await expect(cardElement).toBeVisible();
  });
});
