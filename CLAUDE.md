# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Structure

This is a React-based habit tracking application built with Create React App.

```
habit-tracker/
├── CLAUDE.md                        # This file
├── public/                          # Static assets
├── src/
│   ├── components/                  # Reusable React components
│   │   ├── HabitForm.js             # Main form component for adding habits
│   │   ├── HabitList.js             # Grid display of habit cards
│   │   ├── Navigation.js            # Header navigation with NavLink
│   │   ├── ThemeToggle.js           # Light/dark mode toggle button
│   │   ├── TextInput.js             # Reusable text input field
│   │   ├── DateSelector.js          # Date picker component
│   │   └── StatusSelector.js        # Status dropdown with icons
│   ├── hooks/
│   │   └── useTheme.js              # Theme state with localStorage
│   ├── pages/
│   │   ├── Home.js                  # Main habit tracker page (/)
│   │   ├── Trends.js                # Analytics/trends page (/trends)
│   │   └── About.js                 # About page (/about)
│   ├── styles/
│   │   ├── habit.css                # Form, card, and list styles
│   │   └── trends.css               # Trends page and analytics styles
│   ├── utils/
│   │   └── habitAnalytics.js        # Habit statistics and trend calculations
│   ├── App.js                       # Root component with router setup
│   ├── App.css                      # Layout, header, nav, theme styles
│   ├── index.js                     # App entry point
│   ├── index.css                    # CSS variables and global styles
│   └── setupTests.js                # Test configuration
├── tests/
│   └── add-habit-form.spec.js       # Playwright test suite (@smoke + @regression)
├── ai/
│   ├── prompts/                     # Reusable agent task prompts
│   │   ├── smoke-run.md
│   │   ├── regression-run.md
│   │   ├── triage-failure.md
│   │   └── explore-and-generate.md
│   └── results/                     # Agent run outputs (gitignored)
├── package.json
├── playwright.config.js
├── vercel.json
└── README.md
```

---

## Development Commands

```bash
npm start         # Start development server at http://localhost:3000
npm test          # Run Jest tests in interactive watch mode
npm run build     # Create production build in build/ folder
```

---

## Architecture

### Routing

- Uses `react-router-dom` for client-side routing
- Routes defined in `App.js`:
  - `/` — Home page with habit tracker functionality
  - `/trends` — Analytics and trends dashboard
  - `/about` — About page with app information

### State Management

- Habit state managed in `App.js` via `useState`, passed down as props
- Theme state managed via `useTheme` hook
- No external state management library
- **localStorage Persistence**:
  - Habits persisted under key `habit-tracker-habits`
  - Theme persisted under key `habit-tracker-theme`
  - Both load on app init, auto-save on change

### Component Structure

**Pages** (`src/pages/`):

- **Home.js**: Renders HabitForm + HabitList, receives `habits` and `onAddHabit` as props
- **Trends.js**: Analytics page — streaks, completion rates, trend comparisons
- **About.js**: Static informational page

**Components** (`src/components/`):

- **Navigation.js**: Nav with NavLink for active route highlighting
- **HabitForm.js**: Composes TextInput, DateSelector, StatusSelector
- **HabitList.js**: Habits grouped by date (Today / Yesterday / full date), responsive grid
- **ThemeToggle.js**: Sun/moon emoji toggle button
- **TextInput.js**: Reusable labeled input
- **DateSelector.js**: Labeled date picker
- **StatusSelector.js**: Status dropdown with icons

**Important Convention**: When adding new page components, always add a NavLink in `Navigation.js`.

### Data Model

```js
{
  habit:  string,   // Habit name/description
  date:   string,   // ISO format: YYYY-MM-DD
  status: string    // "Completed" | "To Do" | "Not Completed" | "Skipped"
}
```

### Analytics & Trends (`/trends`)

- Total unique habits, total tracking days, overall completion %, active streaks
- Per habit: days tracked, completion rate, current streak, longest streak, trend (last 7d vs prev 7d)
- Top Performers: top 3 habits by completion rate (min 3 days tracked)
- Needs Attention: habits with <50% completion rate

### Custom Hooks

- **useTheme**: Returns `{ theme, toggleTheme, setLightTheme, setDarkTheme, isLight, isDark }`
  - Syncs to `data-theme` on `:root`

### Styling

- Responsive design, max-width 1200px, breakpoints at 768px and 480px
- CSS custom properties in `index.css`: `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--border-color`, `--shadow`, `--button-bg`, `--button-hover`, `--button-text`
- Habit cards in CSS Grid (auto-fill, min 320px), card hover with transform + shadow

---

## Testing

### Stack

- **Unit tests**: React Testing Library + Jest (via react-scripts), configured in `src/setupTests.js`
- **E2E / UI Automation**: Playwright (`tests/add-habit-form.spec.js`)
- **Agent browser control**: `playwright-cli` (`@playwright/cli`) — used by Claude Code for live app exploration and triage

### App Under Test

- **Live URL**: https://habit-tracker-one-dun-53.vercel.app/
- **Local URL**: http://localhost:3000 (run `npm start` first)
- **Key user flows**: add habit, mark habit complete, delete habit, view streaks, toggle theme

### Test File

```
tests/
└── add-habit-form.spec.js    # All Playwright tests
                               # Tags: @smoke, @regression
```

### Test Tags

- `@smoke` — Core happy path tests. Always run first. Fast, critical flows only.
- `@regression` — Edge cases, validation, error states, boundary conditions.

---

## QA Agent Instructions

This section is specifically for Claude Code acting as an autonomous QA agent.

### Tools Available

1. **`npx playwright test`** — runs the Playwright spec suite (structured results via `--reporter=json`)
2. **`playwright-cli`** — controls the live browser directly, step by step, for exploration and triage
3. **File system** — read spec files, write triage reports to `ai/results/`

### playwright-cli Quick Reference

```bash
# Open the live app
playwright-cli open https://habit-tracker-one-dun-53.vercel.app/

# Get current page state + element refs (use this before clicking anything)
playwright-cli snapshot

# Interact using refs from snapshot
playwright-cli click <ref>
playwright-cli fill <ref> "text"
playwright-cli press Enter

# Capture current state
playwright-cli screenshot

# Check network calls
playwright-cli network

# Save and restore session state (skip re-doing setup steps)
playwright-cli state-save auth.json
playwright-cli state-load auth.json
```

### Running Tests

```bash
# Always start with smoke — never jump straight to regression
npx playwright test --grep "@smoke" --reporter=json

# Run regression only after smoke passes
npx playwright test --grep "@regression" --reporter=json

# Run a single test by name keyword
npx playwright test --grep "add habit" --reporter=json

# Run with trace on failure (use for triage)
npx playwright test --trace=on-first-retry --reporter=json

# Run full suite
npx playwright test --reporter=json
```

### Agent Decision Rules

Follow this order strictly on every run:

```
1. Run @smoke first
   ├── All pass  → proceed to @regression
   └── Any fail  → STOP, triage smoke failures before continuing

2. On any failure:
   a. Read the failing test in add-habit-form.spec.js
   b. Open live app with playwright-cli
   c. Recreate the failing steps manually using playwright-cli
   d. Take a snapshot + screenshot at the failure point
   e. Categorise the failure (see categories below)
   f. Propose fix

3. Never mark a run complete without a written triage summary
```

### Failure Categories

Every failure must be assigned one of these categories:

| Category          | What it means                                 | Example                        |
| ----------------- | --------------------------------------------- | ------------------------------ |
| `selector-broken` | CSS selector no longer matches an element     | Class renamed in a deploy      |
| `timing`          | Element not ready when test interacts with it | Missing await, animation delay |
| `real-bug`        | App behaviour doesn't match expected          | Form submits with empty input  |
| `env-issue`       | Vercel deploy, network, or config problem     | 404 on live URL                |
| `test-data`       | Test data assumptions incorrect               | Date format mismatch           |

### Token Efficiency Rules

Always follow these to stay within context limits:

- Use `--grep` to scope test runs — never run the full suite when a subset is enough
- Use `--reporter=json` — never `--reporter=html` (not parseable)
- Use `playwright-cli snapshot` to inspect page state — never read full page source
- Read only the failing test's code from `add-habit-form.spec.js`, not the entire file
- Write results to `ai/results/` files rather than holding everything in context

### Required Output Format

After every agent run, produce a summary in this exact format:

```
## QA Run Summary — [date]

**Scope**: @smoke | @regression | full
**Result**: X passed / Y failed / Z skipped
**Duration**: Xms

### Failures

#### [Test name]
- **Category**: selector-broken | timing | real-bug | env-issue | test-data
- **Root cause**: One sentence explanation
- **Steps to reproduce** (via playwright-cli):
  1. playwright-cli open https://habit-tracker-one-dun-53.vercel.app/
  2. ...
- **Suggested fix**: Exact change needed (selector update / wait added / bug filed)
- **Screenshot**: [path if taken]

### Recommended Actions
- [ ] Action 1
- [ ] Action 2
```

---

## Agent Prompt Files

Reusable task prompts live in `ai/prompts/`. Reference them directly:

| File                                 | When to use                                 |
| ------------------------------------ | ------------------------------------------- |
| `ai/prompts/smoke-run.md`            | Quick pre-commit smoke check                |
| `ai/prompts/regression-run.md`       | Full QA cycle after a feature change        |
| `ai/prompts/triage-failure.md`       | Deep dive on a specific failing test        |
| `ai/prompts/explore-and-generate.md` | Discover untested flows, generate new tests |

**Example usage in Claude Code:**

```
Follow the instructions in ai/prompts/smoke-run.md
```

---

## Autonomous QA Workflow

When asked to run a full QA cycle autonomously, follow this flow:

```
Step 1: Read this CLAUDE.md for full context
Step 2: Run @smoke → npx playwright test --grep "@smoke" --reporter=json
Step 3: If smoke passes → run @regression
Step 4: For each failure:
          - Read failing test code
          - Open live app via playwright-cli
          - Reproduce steps manually
          - Snapshot + screenshot at failure point
          - Categorise and propose fix
Step 5: Write summary to ai/results/run-[timestamp].md
Step 6: Print summary to terminal
```

---

## Key Playwright-CLI vs npx playwright test

|                | `playwright-cli`                                 | `npx playwright test`             |
| -------------- | ------------------------------------------------ | --------------------------------- |
| **Purpose**    | Live browser control for agents                  | Run the spec suite                |
| **Use when**   | Triaging failures, exploring UI, verifying fixes | Running @smoke, @regression in CI |
| **Output**     | Page snapshots, screenshots, network logs        | JSON results, pass/fail counts    |
| **Token cost** | Low (snapshot is compact)                        | Low (JSON reporter is compact)    |
| **Install**    | `npm install -g @playwright/cli@latest`          | Already in devDependencies        |

---

## CI/CD

Tests run automatically on push/PR via GitHub Actions (`.github/workflows/playwright.yml`).

- Smoke tests run on every PR
- Full regression runs on merge to main
- Failures trigger AI triage job which posts a summary as a PR comment
