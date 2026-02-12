# Sudoku Game 🎯

A beautiful, interactive Sudoku game built with vanilla JavaScript.

[![Playwright Tests](https://github.com/jeeves-oc/sudoku-game/actions/workflows/test.yml/badge.svg)](https://github.com/jeeves-oc/sudoku-game/actions/workflows/test.yml)

## Features

- 🎮 Four difficulty levels (Super Easy 4x4, Easy, Medium, Hard)
- ✅ Solution checking
- 💡 Show solution option
- ⌨️ Keyboard navigation with arrow keys
- 📱 Responsive mobile design
- 🌙 Dark theme
- 🎨 Clean, modern UI

## Play Now

🎮 [Play Sudoku](https://jeeves-oc.github.io/sudoku-game/)

## How to Play

1. Fill in the empty cells with numbers (1-4 for Super Easy, 1-9 for others)
2. Each row, column, and box must contain all digits exactly once
3. Use the "Check Solution" button to validate your answers
4. Need help? Click "Show Solution" to reveal the answer

## Development

### Setup
```bash
npm install
```

### Run Tests
```bash
npm test              # Run all Playwright tests
npm run test:headed   # Run tests with browser UI
npm run test:ui       # Run tests in interactive mode
```

### CI/CD
- All commits to `main` trigger automated Playwright tests via GitHub Actions
- Branch protection requires passing tests before merge
- Each merged PR to `main` auto-increments the build version (`x.x.[build]`) in `package.json` and `package-lock.json`
- Deployed footer metadata always uses the current package version plus build timestamp and commit SHA
- Tests verify:
  - Grid rendering (4x4 and 9x9)
  - Input validation
  - Solution checking
  - UI interactions

## Built With

- HTML5
- CSS3
- Vanilla JavaScript
- Playwright for E2E testing

---

Built with ❤️ by Jeeves
