const { test, expect } = require('@playwright/test');

test.describe('Sudoku Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Sudoku/);
    await expect(page.locator('h1')).toContainText('Sudoku');
  });

  test('should have core control buttons', async ({ page }) => {
    await expect(page.locator('#newGame')).toBeVisible();
    await expect(page.locator('#solve')).toBeVisible();
    await expect(page.locator('#difficulty')).toBeVisible();
    await expect(page.locator('#checkSolution')).toHaveCount(0);
  });

  test('should generate a 9x9 grid by default', async ({ page }) => {
    await expect(page.locator('.cell')).toHaveCount(81);
  });

  test('should switch to 4x4 grid for Super Easy mode', async ({ page }) => {
    await page.selectOption('#difficulty', 'supereasy');
    await page.click('#newGame');
    await expect(page.locator('.cell')).toHaveCount(16);
  });

  test('should have fixed cells that are disabled', async ({ page }) => {
    const fixedCells = page.locator('.cell.fixed input');
    const count = await fixedCells.count();
    expect(count).toBeGreaterThan(0);
    if (count > 0) {
      await expect(fixedCells.first()).toBeDisabled();
    }
  });

  test('should only accept valid numbers (1-9) for normal mode', async ({ page }) => {
    const cell = page.locator('.cell:not(.fixed) input').first();
    await cell.fill('0');
    await expect(cell).toHaveValue('');
    await cell.fill('a');
    await expect(cell).toHaveValue('');
    await cell.fill('7');
    await expect(cell).toHaveValue('7');
  });

  test('should only accept valid numbers (1-4) for Super Easy mode', async ({ page }) => {
    await page.selectOption('#difficulty', 'supereasy');
    await page.click('#newGame');
    const cell = page.locator('.cell:not(.fixed) input').first();
    await cell.fill('5');
    await expect(cell).toHaveValue('');
    await cell.fill('3');
    await expect(cell).toHaveValue('3');
  });

  test('should reveal wrong values as red during live validation', async ({ page }) => {
    const target = page.locator('.cell:not(.fixed)').first();
    const input = target.locator('input');
    await input.fill('1');
    await expect(target).toHaveClass(/error/);
  });

  test('should show solution when Show Solution button is clicked', async ({ page }) => {
    await page.click('#solve');
    await expect(page.locator('#message')).toContainText('Solution revealed');

    const inputs = page.locator('.cell input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const value = await inputs.nth(i).inputValue();
      expect(value).toMatch(/^[1-9]$/);
    }
  });

  test('should update info text for Super Easy mode', async ({ page }) => {
    await page.selectOption('#difficulty', 'supereasy');
    await page.click('#newGame');
    await expect(page.locator('#info-text')).toContainText('1-4');
    await expect(page.locator('#info-rules')).toContainText('2x2');
  });

  test('should show version number', async ({ page }) => {
    await expect(page.locator('.version')).toBeVisible();
    await expect(page.locator('.version')).toContainText(/(__BUILD_METADATA__|v\d+\.\d+\.\d+)/);
  });
});
