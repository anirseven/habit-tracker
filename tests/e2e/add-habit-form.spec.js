const { test, expect } = require("@playwright/test");

// Helper: get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0];

// Helper: clear localStorage and reload
const clearAndReload = async (page) => {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
};

test.describe("Add Habit Form Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Clear localStorage so each test starts fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // ─── 3.1 Form Display Tests ────────────────────────────────────────────────

  test(
    'TC-FORM-001: Verify "Add New Habit" heading is displayed',
    { tag: "@smoke" },
    async ({ page }) => {
      const heading = page.getByRole("heading", { name: /➕ Add New Habit/i });
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText("➕ Add New Habit");
    },
  );

  test(
    "TC-FORM-002: Verify habit textbox is present with correct placeholder",
    { tag: "@smoke" },
    async ({ page }) => {
      const habitInput = page.getByPlaceholder(
        "Enter habit (e.g., Morning workout, Read 30 mins)",
      );
      await page.locator(".habit-submit-BROKEN").click();
      await expect(habitInput).toBeVisible();
      await expect(habitInput).toHaveAttribute(
        "placeholder",
        "Enter habit (e.g., Morning workout, Read 30 mins)",
      );
    },
  );

  test(
    "TC-FORM-003: Verify date selector defaults to today's date",
    { tag: "@regression" },
    async ({ page }) => {
      // The date input is a textbox (type="date") with value = today's date
      const today = getTodayDate();
      const dateInput = page.locator('input[type="date"]');
      await expect(dateInput).toBeVisible();
      await expect(dateInput).toHaveValue(today);
    },
  );

  test(
    'TC-FORM-004: Verify category dropdown defaults to "Other"',
    { tag: "@regression" },
    async ({ page }) => {
      const categorySelect = page.locator("select.category-select");
      await expect(categorySelect).toBeVisible();
      // The "Other" option has value "other"
      await expect(categorySelect).toHaveValue("other");
    },
  );

  test(
    'TC-FORM-005: Verify status dropdown defaults to "To Do"',
    { tag: "@regression" },
    async ({ page }) => {
      const statusSelect = page.locator("select.status-select");
      await expect(statusSelect).toBeVisible();
      await expect(statusSelect).toHaveValue("To Do");
    },
  );

  test(
    'TC-FORM-006: Verify "Add Habit" button is present',
    { tag: "@regression" },
    async ({ page }) => {
      const addButton = page.getByRole("button", { name: /➕ Add Habit/ });
      await expect(addButton).toBeVisible();
    },
  );

  // ─── 3.2 Category Dropdown Tests ──────────────────────────────────────────

  test(
    "TC-FORM-007: Verify all 8 categories are available in dropdown",
    { tag: "@regression" },
    async ({ page }) => {
      const categorySelect = page.locator("select.category-select");
      const options = await categorySelect.locator("option").allTextContents();

      expect(options).toHaveLength(8);
      expect(options).toContain("💪 Health & Fitness");
      expect(options).toContain("💼 Work & Productivity");
      expect(options).toContain("📚 Learning & Growth");
      expect(options).toContain("🧘 Personal Care");
      expect(options).toContain("👥 Social & Family");
      expect(options).toContain("💰 Finance & Money");
      expect(options).toContain("🎨 Hobbies & Fun");
      expect(options).toContain("📌 Other");
    },
  );

  test(
    "TC-FORM-008: Verify each category can be selected",
    { tag: "@regression" },
    async ({ page }) => {
      const categorySelect = page.locator("select.category-select");
      const categoryValues = [
        "health",
        "work",
        "learning",
        "personal",
        "social",
        "finance",
        "hobbies",
        "other",
      ];

      for (const value of categoryValues) {
        await categorySelect.selectOption(value);
        await expect(categorySelect).toHaveValue(value);
      }
    },
  );

  // ─── 3.3 Status Dropdown Tests ────────────────────────────────────────────

  test(
    "TC-FORM-009: Verify all 4 statuses are available in dropdown",
    { tag: "@regression" },
    async ({ page }) => {
      const statusSelect = page.locator("select.status-select");
      const options = await statusSelect.locator("option").allTextContents();

      expect(options).toHaveLength(4);
      expect(options).toContain("✓ Completed");
      expect(options).toContain("○ To Do");
      expect(options).toContain("✗ Not Completed");
      expect(options).toContain("⊘ Skipped");
    },
  );

  // ─── 3.4 Form Validation Tests ────────────────────────────────────────────

  test(
    "TC-FORM-010: Verify form cannot submit with empty habit name",
    { tag: "@regression" },
    async ({ page }) => {
      // Ensure habit input is empty
      const habitInput = page.getByPlaceholder(
        "Enter habit (e.g., Morning workout, Read 30 mins)",
      );
      await expect(habitInput).toHaveValue("");

      // Click submit
      const addButton = page.getByRole("button", { name: /➕ Add Habit/ });
      await addButton.click();

      // No habit card should appear — empty state should still be shown
      await expect(page.getByText("No habits tracked yet")).toBeVisible();
    },
  );

  test(
    "TC-FORM-011: Verify date can be changed to past dates",
    { tag: "@regression" },
    async ({ page }) => {
      const dateInput = page.locator('input[type="date"]');
      // Set a date 7 days in the past
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const pastDateStr = pastDate.toISOString().split("T")[0];

      await dateInput.fill(pastDateStr);
      await expect(dateInput).toHaveValue(pastDateStr);
    },
  );

  test(
    "TC-FORM-012: Verify date can be changed to future dates",
    { tag: "@regression" },
    async ({ page }) => {
      const dateInput = page.locator('input[type="date"]');
      // Set a date 7 days in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const futureDateStr = futureDate.toISOString().split("T")[0];

      await dateInput.fill(futureDateStr);
      await expect(dateInput).toHaveValue(futureDateStr);
    },
  );

  // ─── 3.5 Form Submission Tests ────────────────────────────────────────────

  test(
    "TC-FORM-013: Verify habit is added when form is submitted with valid data",
    { tag: "@regression" },
    async ({ page }) => {
      // Fill in the form
      await page
        .getByPlaceholder("Enter habit (e.g., Morning workout, Read 30 mins)")
        .fill("Morning workout");
      await page.locator("select.category-select").selectOption("health");
      await page.locator("select.status-select").selectOption("Completed");

      // Submit
      await page.getByRole("button", { name: /➕ Add Habit/ }).click();

      // Habit card should appear with the correct heading
      await expect(
        page.getByRole("heading", { name: "Morning workout" }),
      ).toBeVisible();
    },
  );

  test(
    "TC-FORM-014: Verify habit appears in list after submission",
    { tag: "@regression" },
    async ({ page }) => {
      await page
        .getByPlaceholder("Enter habit (e.g., Morning workout, Read 30 mins)")
        .fill("Read 30 minutes");
      await page.getByRole("button", { name: /➕ Add Habit/ }).click();

      // "Your Habits" section should be visible
      await expect(
        page.getByRole("heading", { name: "Your Habits" }),
      ).toBeVisible();

      // The newly added habit card appears
      await expect(
        page.getByRole("heading", { name: "Read 30 minutes" }),
      ).toBeVisible();
    },
  );

  test(
    "TC-FORM-015: Verify habit name field is cleared after successful submission",
    { tag: "@regression" },
    async ({ page }) => {
      const habitInput = page.getByPlaceholder(
        "Enter habit (e.g., Morning workout, Read 30 mins)",
      );

      await habitInput.fill("Meditation");
      await page.getByRole("button", { name: /➕ Add Habit/ }).click();

      // Input should be empty after submission
      await expect(habitInput).toHaveValue("");
    },
  );

  test(
    "TC-FORM-016: Verify form resets to default values after submission",
    { tag: "@regression" },
    async ({ page }) => {
      // Change category and status from defaults
      await page
        .getByPlaceholder("Enter habit (e.g., Morning workout, Read 30 mins)")
        .fill("Exercise");
      await page.locator("select.category-select").selectOption("health");
      await page.locator("select.status-select").selectOption("Completed");

      await page.getByRole("button", { name: /➕ Add Habit/ }).click();

      // After submission:
      // - Date remains today
      const dateInput = page.locator('input[type="date"]');
      await expect(dateInput).toHaveValue(getTodayDate());

      // - Category resets to "other" (Other)
      await expect(page.locator("select.category-select")).toHaveValue("other");

      // - Status resets to "To Do"
      await expect(page.locator("select.status-select")).toHaveValue("To Do");
    },
  );

  test(
    "TC-FORM-017: Verify multiple habits can be added sequentially",
    { tag: "@regression" },
    async ({ page }) => {
      const habits = ["Morning workout", "Read 30 minutes", "Meditation"];

      for (const habitName of habits) {
        await page
          .getByPlaceholder("Enter habit (e.g., Morning workout, Read 30 mins)")
          .fill(habitName);
        await page.getByRole("button", { name: /➕ Add Habit/ }).click();
      }

      // All three habits should be visible in the list
      for (const habitName of habits) {
        await expect(
          page.getByRole("heading", { name: habitName }),
        ).toBeVisible();
      }
    },
  );

  // ─── Additional Tests (to round out to 20) ────────────────────────────────

  test(
    "TC-FORM-018: Verify form contains all required fields (habit, date, category, status)",
    { tag: "@regression" },
    async ({ page }) => {
      await expect(
        page.getByPlaceholder(
          "Enter habit (e.g., Morning workout, Read 30 mins)",
        ),
      ).toBeVisible();
      await expect(page.locator('input[type="date"]')).toBeVisible();
      await expect(page.locator("select.category-select")).toBeVisible();
      await expect(page.locator("select.status-select")).toBeVisible();
    },
  );

  test(
    "TC-FORM-019: Verify whitespace-only habit name is rejected on submission",
    { tag: "@regression" },
    async ({ page }) => {
      // Fill with only spaces — trim() check should prevent submission
      await page
        .getByPlaceholder("Enter habit (e.g., Morning workout, Read 30 mins)")
        .fill("   ");
      await page.getByRole("button", { name: /➕ Add Habit/ }).click();

      // Empty state should remain — no habit created
      await expect(page.getByText("No habits tracked yet")).toBeVisible();
    },
  );

  test(
    "TC-FORM-020: Verify form heading and button change when in edit mode",
    { tag: "@regression" },
    async ({ page }) => {
      // First add a habit so we can edit it
      await page
        .getByPlaceholder("Enter habit (e.g., Morning workout, Read 30 mins)")
        .fill("Yoga");
      await page.getByRole("button", { name: /➕ Add Habit/ }).click();

      // Click the Edit button on the habit card
      await page.getByRole("button", { name: /✏️ Edit/ }).click();

      // Form heading should change to edit mode
      await expect(
        page.getByRole("heading", { name: /✏️ Edit Habit/i }),
      ).toBeVisible();

      // Submit button should say "Save Changes"
      await expect(
        page.getByRole("button", { name: /💾 Save Changes/ }),
      ).toBeVisible();

      // Cancel button should appear
      await expect(
        page.getByRole("button", { name: /✖ Cancel/ }),
      ).toBeVisible();
    },
  );
});
