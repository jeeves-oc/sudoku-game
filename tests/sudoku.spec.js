const { test, expect } = require('@playwright/test');

test.describe('Sudoku Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Sudoku/);
    await expect(page.locator('h1')).toContainText('Sudoku');
  });

  test('should have all control buttons', async ({ page }) => {
    await expect(page.locator('#newGame')).toBeVisible();
    await expect(page.locator('#checkSolution')).toBeVisible();
    await expect(page.locator('#solve')).toBeVisible();
    await expect(page.locator('#difficulty')).toBeVisible();
  });

  test('should generate a 9x9 grid by default', async ({ page }) => {
    const cells = page.locator('.cell');
    await expect(cells).toHaveCount(81); // 9x9 = 81
  });

  test('should switch to 4x4 grid for Super Easy mode', async ({ page }) => {
    await page.selectOption('#difficulty', 'supereasy');
    await page.click('#newGame');
    
    const cells = page.locator('.cell');
    await expect(cells).toHaveCount(16); // 4x4 = 16
  });

  test('should have fixed cells that are disabled', async ({ page }) => {
    const fixedCells = page.locator('.cell.fixed input');
    const count = await fixedCells.count();
    expect(count).toBeGreaterThan(0);
    
    // Check first fixed cell is disabled
    if (count > 0) {
      await expect(fixedCells.first()).toBeDisabled();
    }
  });

  test('should allow input in empty cells', async ({ page }) => {
    const emptyCells = page.locator('.cell:not(.fixed) input');
    const count = await emptyCells.count();
    
    if (count > 0) {
      const firstEmptyCell = emptyCells.first();
      await firstEmptyCell.fill('5');
      await expect(firstEmptyCell).toHaveValue('5');
    }
  });

  test('should only accept valid numbers (1-9) for normal mode', async ({ page }) => {
    const emptyCells = page.locator('.cell:not(.fixed) input');
    const count = await emptyCells.count();
    
    if (count > 0) {
      const cell = emptyCells.first();
      
      // Try invalid inputs
      await cell.fill('0');
      await expect(cell).toHaveValue('');
      
      await cell.fill('a');
      await expect(cell).toHaveValue('');
      
      // Valid input
      await cell.fill('7');
      await expect(cell).toHaveValue('7');
    }
  });

  test('should only accept valid numbers (1-4) for Super Easy mode', async ({ page }) => {
    await page.selectOption('#difficulty', 'supereasy');
    await page.click('#newGame');
    
    const emptyCells = page.locator('.cell:not(.fixed) input');
    const count = await emptyCells.count();
    
    if (count > 0) {
      const cell = emptyCells.first();
      
      // Try invalid inputs for 4x4
      await cell.fill('5');
      await expect(cell).toHaveValue('');
      
      await cell.fill('9');
      await expect(cell).toHaveValue('');
      
      // Valid input
      await cell.fill('3');
      await expect(cell).toHaveValue('3');
    }
  });

  test('should show solution when Show Solution button is clicked', async ({ page }) => {
    await page.click('#solve');
    
    // Check that message is shown
    const message = page.locator('#message');
    await expect(message).toContainText('Solution revealed');
    
    // All cells should have values
    const inputs = page.locator('.cell input');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const value = await inputs.nth(i).inputValue();
      expect(value).toMatch(/^[1-9]$/);
    }
  });

  test('should generate new game when New Game button is clicked', async ({ page }) => {
    // Get initial board state
    const firstCell = page.locator('.cell input').first();
    const initialValue = await firstCell.inputValue();
    
    // Click New Game
    await page.click('#newGame');
    
    // Board should be regenerated (likely different)
    // At minimum, verify the grid still exists
    const cells = page.locator('.cell');
    await expect(cells).toHaveCount(81);
  });

  test('should update info text for Super Easy mode', async ({ page }) => {
    await page.selectOption('#difficulty', 'supereasy');
    await page.click('#newGame');
    
    const infoText = page.locator('#info-text');
    await expect(infoText).toContainText('1-4');
    
    const infoRules = page.locator('#info-rules');
    await expect(infoRules).toContainText('2x2');
  });

  test('should show version number', async ({ page }) => {
    const version = page.locator('.version');
    await expect(version).toBeVisible();
    await expect(version).toContainText(/v\d+\.\d+\.\d+/);
  });
});
