# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a React-based habit tracking application built with Create React App.

```
habit-tracker/                   # Repository root
├── CLAUDE.md                    # This file
├── public/                      # Static assets
├── src/
    │   ├── components/          # Reusable React components
    │   │   ├── HabitForm.js     # Main form component for adding habits
    │   │   ├── HabitList.js     # Grid display of habit cards
    │   │   ├── Navigation.js    # Header navigation with NavLink
    │   │   ├── ThemeToggle.js   # Light/dark mode toggle button
    │   │   ├── TextInput.js     # Reusable text input field
    │   │   ├── DateSelector.js  # Date picker component
    │   │   └── StatusSelector.js # Status dropdown with icons
    │   ├── hooks/               # Custom React hooks
    │   │   └── useTheme.js      # Theme state with localStorage
    │   ├── pages/               # Page components (routes)
    │   │   ├── Home.js          # Main habit tracker page (/)
    │   │   ├── Trends.js        # Analytics/trends page (/trends)
    │   │   └── About.js         # About page (/about)
    │   ├── styles/              # CSS modules
    │   │   ├── habit.css        # Form, card, and list styles
    │   │   └── trends.css       # Trends page and analytics styles
    │   ├── utils/               # Utility functions
    │   │   └── habitAnalytics.js # Habit statistics and trend calculations
│   ├── App.js                   # Root component with router setup
│   ├── App.css                  # Layout, header, nav, theme styles
│   ├── index.js                 # App entry point
│   ├── index.css                # CSS variables and global styles
│   └── setupTests.js            # Test configuration
├── package.json
├── vercel.json                  # Vercel deployment configuration
└── README.md
```

## Development Commands

```bash
npm start         # Start development server at http://localhost:3000
npm test          # Run tests in interactive watch mode
npm run build     # Create production build in build/ folder
```

## Architecture

### Routing
- Uses `react-router-dom` for client-side routing
- Routes defined in `App.js`:
  - `/` - Home page with habit tracker functionality
  - `/trends` - Analytics and trends dashboard
  - `/about` - About page with app information

### State Management
- Habit state is managed in `App.js` using React's `useState` hook and passed down as props
- Theme state is managed via `useTheme` hook in `App.js`
- No external state management library (Redux, Zustand, etc.)
- **localStorage Persistence**:
  - Habits are persisted to localStorage under key `habit-tracker-habits`
  - Loaded on app initialization from localStorage
  - Automatically saved whenever habits change
  - Data persists across page refreshes and navigation

### Component Structure

**Pages** (in `src/pages/`):
- **Home.js**: Main page that renders HabitForm and HabitList (receives habits and onAddHabit as props)
- **Trends.js**: Analytics and insights page showing habit statistics, streaks, and trends
- **About.js**: Static informational page about the app

**Components** (in `src/components/`):
- **Navigation.js**: Semantic nav element with NavLink for active route highlighting
- **HabitForm**: Main form container that composes smaller input components
- **HabitList**: Grid/card-based display with habits grouped by date, shows "Today", "Yesterday", or full date
- **ThemeToggle**: Button component that displays sun/moon emoji and triggers theme changes
- **TextInput**: Reusable labeled text input field
- **DateSelector**: Labeled date picker input
- **StatusSelector**: Dropdown with status options and visual icons

### Habit Grouping
- Habits are automatically grouped by date in descending order (newest first)
- Date headers show "Today", "Yesterday", or formatted full date
- Each date group displays habit count
- Cards within a group are displayed in a responsive grid

### Analytics & Trends
The Trends page (`/trends`) provides comprehensive analytics:

**Overall Statistics:**
- Total unique habits tracked
- Total days with habit tracking
- Overall completion rate percentage
- Number of active streaks

**Habit-Specific Metrics** (calculated per unique habit name):
- **Days Tracked**: Total number of days the habit was logged
- **Completion Rate**: Percentage of times marked as "Completed"
- **Current Streak**: Consecutive days with completed status (from today backwards)
- **Longest Streak**: Best streak ever achieved for that habit
- **Trend Analysis**: Comparing last 7 days vs previous 7 days (improving/stable/declining)

**Insights:**
- **Top Performers**: Top 3 habits with highest completion rates (minimum 3 days tracked)
- **Needs Attention**: Habits with <50% completion rate that need focus

**Utilities** (`src/utils/habitAnalytics.js`):
- Groups habits by name (case-insensitive)
- Calculates streaks using consecutive date matching
- Determines trends by comparing recent vs historical performance

**App.js**: Root component that sets up routing, manages global state (habits with localStorage, theme), and renders header with Navigation and ThemeToggle

**Important Convention**: When creating new page components, always add a navigation link to that page in the Navigation component (`src/components/Navigation.js`). This ensures consistent navigation across the application.

### Custom Hooks
- **useTheme**: Manages theme state (light/dark) with localStorage persistence
  - Returns: `{ theme, toggleTheme, setLightTheme, setDarkTheme, isLight, isDark }`
  - Automatically syncs theme to `data-theme` attribute on document root
  - Persists user preference to localStorage under key `habit-tracker-theme`

### Data Model
Each habit entry is an object with:
- `habit` (string): The habit name/description
- `date` (string): ISO date format (YYYY-MM-DD)
- `status` (string): One of: "Completed", "To Do", "Not Completed", "Skipped"

### Styling
- **Layout**: Full-width responsive design with centered max-width content (1200px)
  - Sticky header with shadow and border
  - Full viewport height background
  - Responsive breakpoints at 768px (tablet) and 480px (mobile)
- **Theming System**: Uses CSS custom properties defined in `index.css`
  - Theme is applied via `data-theme` attribute on `:root` element
  - Variables: `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--border-color`, `--shadow`, `--button-bg`, `--button-hover`, `--button-text`
  - Two themes: `light` (default) and `dark`
  - Smooth transitions on theme changes
- **CSS Architecture**:
  - `index.css` - CSS variables, global styles, theme definitions
  - `App.css` - Header, navigation, main layout, about page, responsive media queries
  - `styles/habit.css` - Form components, habit cards grid, status badges, empty states
- **Component Patterns**:
  - Form inputs use focus states with border-color changes and subtle shadows
  - Habit cards displayed in responsive CSS Grid (auto-fill, min 320px)
  - Card hover effects with transform and enhanced shadows
  - Status badges with icons and color-coded backgrounds
  - Active navigation links highlighted with different background color

## Testing

Tests are written using React Testing Library and Jest (configured via react-scripts). The test setup is in `src/setupTests.js`.
