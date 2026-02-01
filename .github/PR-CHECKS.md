# Automated PR Checks

## Enabled Free Checks

### 1. **Super-Linter** 
Multi-language linter that checks:
- JavaScript/ES6
- JSON
- Markdown
- YAML

### 2. **CodeQL Security Scan**
GitHub's free security scanner that:
- Detects security vulnerabilities
- Finds code quality issues
- Runs on every PR and weekly
- Creates security alerts in the Security tab

### 3. **Dependency Review**
Checks for:
- Vulnerable dependencies
- License compliance issues
- Fails on moderate+ severity vulnerabilities

### 4. **PR Size Labeler**
Auto-labels PRs by size:
- `size/xs` (0-10 lines)
- `size/s` (11-100 lines)
- `size/m` (101-500 lines)
- `size/l` (501-1000 lines)
- `size/xl` (1000+ lines)

### 5. **PR Description Enforcer**
Requires meaningful PR descriptions (min 20 chars)

### 6. **Code Owners Review**
Automatically requests review from @theadmin

## GitHub Settings Required

To fully enable PR protection, configure these in GitHub:
1. **Settings → Branches → Branch protection rules** for `main`:
   - ✅ Require pull request reviews (1 approval)
   - ✅ Require status checks to pass:
     - `Lint Code Base`
     - `Dependency Review`
     - `Check PR Description`
     - `Analyze Code` (CodeQL)
   - ✅ Require conversation resolution
   - ✅ Include administrators

## Additional Free Tools to Consider

- **Codecov** - Free for open source (test coverage)
- **Snyk** - Free tier for vulnerability scanning
- **Renovate** - Automated dependency updates
- **CodeRabbit** - AI code reviewer (free tier available)
- **Deepsource** - Code quality analysis (free for open source)

## Local Pre-Push Hook

A pre-push hook is configured to prevent direct pushes to `main`.
