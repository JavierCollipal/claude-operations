# RULE 58: Prettier Formatting for Frontend Infrastructure 🎨✨

**Category**: DevOps
**Priority**: HIGH
**Dependencies**: None

---

### 58. Prettier Formatting for Frontend Infrastructure 🎨✨
**Core Principle**: ALL frontend infrastructure changes (GitHub Actions workflows, config files, CI/CD pipelines) MUST be formatted with Prettier BEFORE committing to prevent CI/CD pipeline failures.

**Mandatory Commands Before Commit**:
```bash
npm run format        # Fix all formatting issues
npm run format:check  # Verify formatting is correct
```

**Why This is CRITICAL**:
- ✅ **CI/CD Pipeline**: Prettier checks are enforced in GitHub Actions (lint stage)
- ✅ **Pre-commit Hook**: Husky + lint-staged automatically format staged files
- ✅ **Code Quality**: Consistent formatting across all team members
- ✅ **Prevent Failures**: Unformatted code will fail CI/CD and block deployments

**Workflow Integration**:
```yaml
# .github/workflows/ci-cd-pipeline.yml
lint:
  name: 🔍 Lint & Code Quality
  steps:
    - name: 🔍 Run ESLint
      run: npm run lint

    - name: 🎨 Check Prettier formatting
      run: npm run format:check  # ❌ FAILS if not formatted!
```

**Husky Pre-commit Hook** (Automatic):
```json
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged  # Automatically formats staged files
```

**lint-staged Configuration**:
```json
// .lintstagedrc.json
{
  "*.{js,jsx,ts,tsx,json,css,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

**Files Requiring Prettier Formatting**:
- ✅ GitHub Actions workflows (`.github/workflows/*.yml`)
- ✅ Configuration files (`package.json`, `tsconfig.json`, `.prettierrc`)
- ✅ React/Next.js components (`*.js`, `*.jsx`, `*.tsx`)
- ✅ TypeScript files (`*.ts`)
- ✅ Markdown docs (`*.md`)
- ✅ CSS/SCSS files (`*.css`, `*.scss`)

**Prettier Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

**Best Practices for the Team** (Claude):
1. **ALWAYS** run `npm run format` after modifying workflow files
2. **ALWAYS** run `npm run format:check` before committing
3. **NEVER** bypass pre-commit hooks (no `--no-verify`)
4. **NEVER** commit unformatted code
5. **ALWAYS** verify CI/CD pipeline shows "All matched files use Prettier code style!"

**Common Scenarios Requiring Formatting**:

**Scenario 1: Modifying GitHub Actions workflows**
```bash
# After editing .github/workflows/ci-cd-optimized.yml
npm run format               # Fix formatting
npm run format:check         # Verify
git add .github/workflows/
git commit -m "chore: update workflow"  # Husky auto-formats
```

**Scenario 2: Creating new React components**
```bash
# After creating new components
npm run format               # Fix formatting
npm run lint                 # Check ESLint
npm run format:check         # Verify Prettier
git add src/components/
git commit -m "feat: new component"
```

**Scenario 3: Updating package.json**
```bash
# After adding dependencies
npm run format               # Format package.json
git add package.json package-lock.json
git commit -m "chore: add dependency"
```

**Error Prevention**:
```bash
# ❌ WRONG: Committing without formatting
git commit -m "update workflow"
# Result: CI/CD fails at lint stage!

# ✅ CORRECT: Format before committing
npm run format
npm run format:check
git commit -m "update workflow"
# Result: CI/CD passes! ✅
```

**Recovery from Formatting Failures**:
If CI/CD pipeline fails due to Prettier:
1. Pull latest changes: `git pull origin main`
2. Run formatter: `npm run format`
3. Verify: `npm run format:check`
4. Commit fix: `git add . && git commit -m "style: fix prettier formatting"`
5. Push: `git push origin main`

**Personality Responsibilities**:
- 🐾 **Neko-Arc**: Execute `npm run format` before committing infrastructure changes
- 🎭 **Mario**: Orchestrate formatting checks in CI/CD workflows
- 🗡️ **Noel**: Validate formatting passes before deployment
- 🎸 **Glam**: Document formatting requirements in Spanish docs
- 🧠 **Hannibal**: Analyze formatting failures in CI/CD logs
- 🧠 **Tetora**: Multi-perspective check: format + lint + tests

**Related Projects Requiring This Rule**:
- ✅ `neko-defense-dashboard` (HIGH priority - 200+ files)
- ✅ `neko-criminal-investigation` (HIGH priority - frontend + backend)
- ✅ `neko-worker-case-tracker` (MEDIUM priority)
- ✅ All Next.js/React projects (CRITICAL)
- ✅ All projects with GitHub Actions workflows (CRITICAL)

**Testing Integration**:
```bash
# Run full quality check before pushing
npm run lint          # ESLint
npm run format:check  # Prettier
npm test              # Jest/Cypress
npm run build         # Next.js build
```

**Related**: RULE 26 (Auto Git Push), RULE 41 (Feature Branch Workflow), RULE 42 (Pull From Origin)

---

**File**: rule-058-prettier-formatting-frontend-infrastructure.md
**Loaded via**: `/rule 58` or automatic (HIGH priority - always active)
