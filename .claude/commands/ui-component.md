# UI Component Creation Guide

## Custom Command

**Usage:** `/ui-component [component-name] [type]`

**Examples:**
- `/ui-component ProgressBar reusable`
- `/ui-component Dashboard page`
- `/ui-component ConfirmDialog modal`

---

## Component Types

### 1. Reusable Components (`/src/components/`)
Small, reusable UI building blocks that can be used across multiple pages.

**Examples:** StatCard, TextInput, DateSelector, StatusSelector, ThemeToggle

**Characteristics:**
- Accept props for customization
- No direct state management (unless internal UI state)
- Highly composable
- Single responsibility

### 2. Container Components (`/src/components/`)
Components that compose multiple smaller components and manage local state.

**Examples:** HabitForm, HabitList, SummaryCards, Navigation

**Characteristics:**
- Compose multiple reusable components
- May manage local state (e.g., form state)
- Handle user interactions
- Pass data down to child components

### 3. Page Components (`/src/pages/`)
Top-level route components that represent entire pages.

**Examples:** Home, Trends, About

**Characteristics:**
- Mapped to routes in App.js
- Receive data via props from App.js
- Compose container and reusable components
- Manage page-specific layout

---

## Component Creation Best Practices

### File Naming Conventions

```
Component File:  PascalCase.js     (e.g., StatCard.js)
CSS File:        kebab-case.css    (e.g., stat-card.css)
Utility File:    camelCase.js      (e.g., habitAnalytics.js)
```

### Component Structure Template

```javascript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Component imports (alphabetical)
import ChildComponent from './ChildComponent';
import OtherComponent from './OtherComponent';

// 3. Utility/hook imports
import { helperFunction } from '../utils/helpers';
import useCustomHook from '../hooks/useCustomHook';

// 4. Style imports (last)
import '../styles/component-name.css';

// 5. Component definition (use function declaration, not arrow function)
function ComponentName({ prop1, prop2, onAction, className }) {
  // 6. Hooks (in order: useState, useEffect, custom hooks)
  const [state, setState] = useState(initialValue);
  const customValue = useCustomHook();

  // 7. Event handlers
  const handleClick = () => {
    // handler logic
    onAction?.(data); // Optional chaining for optional callbacks
  };

  // 8. Derived/computed values
  const computedValue = prop1 + prop2;

  // 9. Early returns for edge cases
  if (!prop1) {
    return null; // or empty state
  }

  // 10. Main render
  return (
    <div className={`component-name ${className || ''}`}>
      {/* Component JSX */}
    </div>
  );
}

// 11. Export (default)
export default ComponentName;
```

---

## Props Best Practices

### Prop Naming Conventions

```javascript
// Data props: nouns
{ habit, habits, user, userData }

// Action props: verb prefixed with "on"
{ onAdd, onDelete, onUpdate, onSubmit, onChange }

// Boolean props: adjectives or "is/has" prefix
{ isActive, isLoading, hasError, disabled, visible }

// Style props: className (not style object)
{ className }
```

### Props Destructuring

```javascript
// ✅ GOOD: Destructure in function parameters
function Component({ title, onSave, isActive, className }) {
  return <div className={className}>{title}</div>;
}

// ❌ BAD: Use props object
function Component(props) {
  return <div className={props.className}>{props.title}</div>;
}
```

### Optional Props with Defaults

```javascript
// Method 1: Default parameters
function Component({ title = 'Default Title', count = 0 }) {
  // ...
}

// Method 2: Fallback with ||
function Component({ className }) {
  return <div className={`card ${className || ''}`} />;
}

// Method 3: Optional chaining for callbacks
function Component({ onSave }) {
  const handleClick = () => {
    onSave?.(data); // Only calls if onSave exists
  };
}
```

---

## Styling Rules

### CSS Architecture

```
/src/styles/
├── index.css           # Global styles, CSS variables, theme definitions
├── App.css            # Layout, header, navigation, global layout
├── habit.css          # Domain-specific: forms, cards, lists
├── trends.css         # Page-specific: trends page components
└── summary.css        # Feature-specific: home summary section
```

### Theme Support (REQUIRED)

All components MUST use CSS variables for theming:

```css
/* ✅ GOOD: Use CSS variables */
.component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px var(--shadow);
}

/* ❌ BAD: Hardcoded colors */
.component {
  background: #ffffff;
  color: #000000;
  border: 1px solid #ccc;
}
```

### Available CSS Variables

```css
/* Theme variables (from index.css) */
--bg-primary        /* Main background */
--bg-secondary      /* Cards, secondary surfaces */
--text-primary      /* Primary text color */
--text-secondary    /* Muted text, labels */
--border-color      /* Borders, dividers */
--shadow            /* Box shadows (rgba) */
--button-bg         /* Primary button background */
--button-hover      /* Button hover state */
--button-text       /* Button text color */
```

### Responsive Design (REQUIRED)

Use mobile-first approach with these breakpoints:

```css
/* Mobile first: base styles for mobile */
.component {
  padding: 16px;
  font-size: 1rem;
}

/* Tablet: 768px and up */
@media (max-width: 768px) {
  .component {
    padding: 20px;
  }
}

/* Mobile: 480px and down */
@media (max-width: 480px) {
  .component {
    padding: 12px;
    font-size: 0.9rem;
  }
}
```

### CSS Grid Patterns

```css
/* Auto-fit grid (responsive columns) */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

/* Fixed columns with responsive breakpoints */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
```

### Component-Specific CSS

```css
/* Use BEM-like naming with component prefix */
.stat-card {
  /* Card container */
}

.stat-card:hover {
  /* Hover effects encouraged for interactivity */
}

.stat-icon {
  /* Icon within card */
}

.stat-content {
  /* Content wrapper */
}

.stat-value {
  /* Primary value display */
}

.stat-label {
  /* Label/description */
}
```

---

## State Management Rules

### Local State (useState)

Use for UI-only state that doesn't need to be shared:

```javascript
function Component() {
  // ✅ GOOD: Form input state
  const [inputValue, setInputValue] = useState('');

  // ✅ GOOD: UI toggle state
  const [isOpen, setIsOpen] = useState(false);

  // ✅ GOOD: Local filter state
  const [selectedFilter, setSelectedFilter] = useState('all');
}
```

### Lifted State (Props)

For data that needs to be shared or persisted, lift to parent:

```javascript
// ✅ GOOD: Habits managed in App.js, passed down via props
function Home({ habits, onAddHabit, onDeleteHabit }) {
  // Receive state and callbacks from parent
}

// ❌ BAD: Don't duplicate app-level state in components
function Home() {
  const [habits, setHabits] = useState([]); // This won't sync with App.js
}
```

---

## Conditional Rendering Patterns

### Early Return for Empty States

```javascript
function HabitList({ habits }) {
  // ✅ GOOD: Early return for empty state
  if (!habits || habits.length === 0) {
    return (
      <div className="empty-state">
        <p>No habits yet. Add your first habit!</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habits.map(habit => <HabitCard key={habit.id} habit={habit} />)}
    </div>
  );
}
```

### Conditional Rendering with &&

```javascript
// ✅ GOOD: Show element only if condition is true
{isLoading && <LoadingSpinner />}

{error && <ErrorMessage message={error} />}

{habits.length > 0 && <SummaryCards habits={habits} />}
```

### Conditional Rendering with Ternary

```javascript
// ✅ GOOD: Toggle between two states
{isEditing ? <EditForm /> : <ViewMode />}

{habits.length > 0 ? <HabitList habits={habits} /> : <EmptyState />}
```

---

## Event Handler Best Practices

### Naming Convention

```javascript
// ✅ GOOD: handleAction format
const handleClick = () => { };
const handleSubmit = () => { };
const handleChange = (e) => { };
const handleSave = (data) => { };

// ❌ BAD: Unclear names
const onClick = () => { };
const doSomething = () => { };
```

### Prop Callbacks

```javascript
// ✅ GOOD: Call parent callbacks with necessary data
const handleSave = () => {
  const habitData = { habit, date, status };
  onSave?.(habitData); // Pass data to parent
};

// ❌ BAD: Don't pass entire event object up
const handleChange = (e) => {
  onChange?.(e); // Parent has to extract e.target.value
};
```

### Prevent Default

```javascript
// ✅ GOOD: Prevent default for forms
const handleSubmit = (e) => {
  e.preventDefault();
  // form handling
};

// ✅ GOOD: Prevent default for links when using onClick
const handleLinkClick = (e) => {
  e.preventDefault();
  // custom navigation
};
```

---

## Component Testing Checklist

Before considering a component complete, verify:

### Functionality
- [ ] Component renders without errors
- [ ] All props are properly handled
- [ ] Event handlers work as expected
- [ ] Edge cases handled (null, undefined, empty arrays)
- [ ] Optional props have sensible defaults

### Styling
- [ ] Component uses CSS variables (no hardcoded colors)
- [ ] Responsive on mobile (480px), tablet (768px), desktop
- [ ] Works in both light and dark themes
- [ ] Hover/focus states are visible and appropriate
- [ ] Spacing and alignment are consistent with design system

### Integration
- [ ] Component integrates properly with parent components
- [ ] No prop drilling issues (data flows logically)
- [ ] No duplicate state management
- [ ] Re-renders appropriately when props change

### Accessibility
- [ ] Semantic HTML elements used where appropriate
- [ ] Interactive elements are keyboard accessible
- [ ] Form inputs have associated labels
- [ ] Color contrast meets accessibility standards

---

## Common Patterns in This Project

### Pattern 1: Form Input Components

```javascript
function TextInput({ label, value, onChange, placeholder, required }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        required={required}
      />
    </div>
  );
}
```

### Pattern 2: Card Components

```javascript
function Card({ icon, title, value, subtitle, onClick, className }) {
  return (
    <div
      className={`card ${className || ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <div className="card-icon">{icon}</div>}
      <div className="card-content">
        {title && <div className="card-title">{title}</div>}
        {value && <div className="card-value">{value}</div>}
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
```

### Pattern 3: List/Grid Components

```javascript
function ItemGrid({ items, onItemClick, renderItem, emptyMessage }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <p>{emptyMessage || 'No items to display'}</p>
      </div>
    );
  }

  return (
    <div className="item-grid">
      {items.map((item, index) => (
        <div key={item.id || index} onClick={() => onItemClick?.(item)}>
          {renderItem ? renderItem(item) : <DefaultItem item={item} />}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 4: Analytics/Utility Usage

```javascript
import { calculateStats } from '../utils/analytics';

function StatsSummary({ data }) {
  // Calculate stats from raw data
  const stats = calculateStats(data);

  return (
    <div className="stats-summary">
      <StatCard icon="📊" value={stats.total} label="Total" />
      <StatCard icon="✅" value={`${stats.completionRate}%`} label="Complete" />
    </div>
  );
}
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Inline Styles (Use CSS Variables Instead)

```javascript
// ❌ BAD
<div style={{ backgroundColor: '#fff', color: '#000' }}>

// ✅ GOOD
<div className="card">  {/* Uses var(--bg-secondary) */}
```

### ❌ Don't: Prop Drilling Through Many Levels

```javascript
// ❌ BAD
<GrandParent data={data}>
  <Parent data={data}>
    <Child data={data}>
      <GrandChild data={data} />  {/* Too deep! */}

// ✅ GOOD: Lift state higher or use context/composition
```

### ❌ Don't: Mutate Props or State Directly

```javascript
// ❌ BAD
props.habit.status = 'Completed';  // Never mutate props!
habits.push(newHabit);             // Never mutate state!

// ✅ GOOD
const updatedHabit = { ...habit, status: 'Completed' };
const updatedHabits = [...habits, newHabit];
```

### ❌ Don't: Use Index as Key in Lists (Unless Truly Static)

```javascript
// ❌ BAD (if list can be reordered/filtered)
{habits.map((habit, index) => <HabitCard key={index} habit={habit} />)}

// ✅ GOOD
{habits.map(habit => <HabitCard key={habit.id} habit={habit} />)}
```

### ❌ Don't: Create Components That Do Too Much

```javascript
// ❌ BAD: Component does form, validation, API call, and display
function HabitManagementSystem() {
  // 500 lines of code...
}

// ✅ GOOD: Split into focused components
function HabitForm() { }      // Just the form
function HabitList() { }      // Just the display
function HabitValidator() { } // Just validation
```

---

## File Organization Checklist

When creating a new UI component:

1. **Choose the right location:**
   - Reusable components → `/src/components/ComponentName.js`
   - Page components → `/src/pages/PageName.js`
   - Utilities/helpers → `/src/utils/utilityName.js`
   - Styles → `/src/styles/component-name.css`

2. **Create the component file** with proper structure (see template above)

3. **Create the CSS file** if needed (use existing styles when possible)

4. **Update parent component:**
   - Import the new component
   - Add it to JSX
   - Pass required props

5. **Update Navigation** (if creating a page):
   - Add route to `App.js`
   - Add NavLink to `Navigation.js`

6. **Test thoroughly** using the checklist above

---

## Quick Reference Card

```javascript
// Component file structure
import React from 'react'        // 1. React
import Component from './Component'  // 2. Components
import { helper } from '../utils'    // 3. Utilities
import './styles.css'               // 4. Styles

function MyComponent({ prop1, onAction }) {  // Destructure props
  const [state, setState] = useState(init)   // Hooks first

  const handleClick = () => {                // Event handlers
    onAction?.(data)                         // Optional chaining
  }

  if (!prop1) return null                   // Early returns

  return (                                   // Main render
    <div className="my-component">
      {/* JSX */}
    </div>
  )
}

export default MyComponent                   // Default export
```

**CSS Pattern:**
```css
.component-name {
  background: var(--bg-primary);   /* Use CSS vars */
  color: var(--text-primary);
  transition: all 0.2s ease;       /* Smooth transitions */
}

@media (max-width: 768px) {        /* Mobile responsive */
  .component-name { /* adjustments */ }
}
```

---

## Success Criteria

A well-built component in this project should:

✅ Follow the component structure template
✅ Use CSS variables for all colors
✅ Be responsive (mobile, tablet, desktop)
✅ Handle edge cases (null, empty, undefined)
✅ Have clear prop names and types
✅ Use semantic HTML
✅ Export as default
✅ Be located in the correct directory
✅ Work in both light and dark themes
✅ Follow naming conventions
✅ Have appropriate hover/focus states
✅ Not duplicate existing functionality

---

*Last updated: Based on StatCard, SummaryCards, and existing component patterns*
