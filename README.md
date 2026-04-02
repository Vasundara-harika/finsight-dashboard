# FinSight — Finance Dashboard

A clean, interactive personal finance dashboard built with React, Vite, and Tailwind CSS. This project was developed as part of the Zorvyn FinTech Pvt. Ltd. Frontend Developer Intern screening assignment.

**Built by:** Vasundara Harika

---

## Features

### Core Features (Phase 1)
- **Dashboard Overview** — Summary cards (Total Balance, Income, Expenses) with count-up animations, percentage change indicators, welcome banner, and smart daily tips
- **Time-Based Visualization** — Line chart showing cumulative balance trend over months (Recharts)
- **Categorical Visualization** — Donut chart showing spending distribution by category
- **Transaction List** — Full list with date, amount, category, type, avatar initials, color-coded amounts, and pie chart overview
- **Transaction Filtering** — Filter by category, date range (From/To), search by description
- **Transaction Search & Sort** — Search by description, sort by date or amount (ascending/descending)
- **Role-Based UI (RBAC)** — Viewer role sees data only; Admin role can add, edit, and delete transactions. Switch via navbar dropdown
- **Insights Section** — Key metrics (highest spending category, savings rate, biggest expense, MoM change) with grouped bar chart and horizontal category ranking chart
- **State Management** — React Context API manages transactions, role, theme, search, filters, sorting, and toasts
- **Responsive Design** — Works on mobile (bottom tab bar) and desktop (fixed sidebar)

### Phase 2 Enhancements (All Implemented)
- **Bug Fix: Reactive Summary Cards** — `useMemo`-based computed totals (`totalIncome`, `totalExpenses`, `totalBalance`) in context; functional state updaters in `useTransactions` eliminate stale-closure bugs
- **Welcome Banner** — Personalized greeting with time-of-day awareness and smart financial tip based on real data
- **Monthly Budget Overview** — Dashboard shows progress bars for Food, Shopping, and Entertainment budgets with color-coded status
- **Date Range Filter** — From/To date pickers in FilterBar with clear button; integrated into context filtering
- **Delete Transactions** — Admin can delete individual transactions via trash icon with confirmation modal
- **Bulk Select & Delete** — Checkbox selection with select-all, bulk action bar, and batch delete with confirmation
- **Financial Health Score** — Circular progress ring on Insights page computed from savings rate, spending diversity, transaction history, and expense trends; includes breakdown checklist and contextual tips
- **Toast Notifications** — Global toast system (success/error/warning) with auto-dismiss, stacked display, and manual close
- **Confirmation Modals** — Reusable `ConfirmModal` component for destructive actions (delete, clear all)
- **Count-Up Hook** — `useCountUp` hook with `requestAnimationFrame` replaces inline animation in SummaryCard
- **Profile Page** (`/profile`) — Editable personal info, financial summary, account preferences (currency, theme, notifications, default view), and recent activity
- **Settings Page** (`/settings`) — Tabbed UI (General, Appearance, Data, About) with profile quick edit, financial preferences, notification toggles, theme cards, accent color showcase, export CSV/JSON, import JSON, danger zone with clear-all, and assignment completion checklist
- **Help Page** (`/help`) — Searchable FAQ accordion, getting started steps, key features grid, and contact section
- **Sidebar Navigation** — Updated with routable links to Settings, Profile, and Help; profile avatar links to /profile
- **Page Transitions** — Fade-in page enter animations across all routes
- **Export JSON** — Full transaction export as formatted JSON from Settings → Data
- **Import Transactions** — Upload a JSON file to bulk-import transactions via Settings → Data
- **Dark Mode Compliance** — All new pages and components use Tailwind `dark:` variants matching the existing design system

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Welcome banner, summary cards, charts, recent transactions, budget progress |
| `/transactions` | Transactions | Pie chart, stats, filter bar with date range, transaction table with bulk select/delete |
| `/insights` | Insights | Insight cards, financial health score with circular ring, monthly comparison & category charts |
| `/profile` | Profile | Editable personal info, financial summary, preferences, recent activity |
| `/settings` | Settings | Tabbed settings (General, Appearance, Data, About) with import/export and danger zone |
| `/help` | Help & Support | Searchable FAQ, getting started guide, features overview, contact |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework and build tool |
| Tailwind CSS v3 | Utility-first styling with dark mode (`class` strategy) |
| Recharts | Line, Pie, and Bar charts |
| Lucide React | Icon library |
| React Router DOM v6 | Client-side routing (6 routes) |
| JSON Server | Mock REST API on `localhost:3001` (GET, POST, PUT, DELETE) |
| React Context API | Global state management with reactive computed values |

---

## Getting Started

### Prerequisites
- Node.js v18+ installed
- npm package manager

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start JSON Server (Terminal 1)
npm run server

# 4. Start React dev server (Terminal 2)
npm run dev
```

- React app runs at: **http://localhost:5173**
- JSON Server runs at: **http://localhost:3001**

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
finance-dashboard/
├── db.json                            ← Mock data for JSON Server
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── src/
    ├── App.jsx                        ← Route definitions (6 pages)
    ├── main.jsx                       ← Entry point with providers
    ├── index.css                      ← Tailwind + custom animations
    ├── context/
    │   └── AppContext.jsx             ← Global state, toasts, reactive totals
    ├── components/
    │   ├── Sidebar.jsx                ← Fixed sidebar + mobile bottom bar
    │   ├── Navbar.jsx                 ← Top bar with search, theme, role
    │   ├── Layout.jsx                 ← Page shell with sidebar + navbar + toast
    │   ├── SummaryCard.jsx            ← Metric card with useCountUp animation
    │   ├── BalanceTrendChart.jsx      ← Line chart (balance over months)
    │   ├── SpendingDonutChart.jsx     ← Donut chart (spending by category)
    │   ├── TransactionTable.jsx       ← Transaction list with select/delete
    │   ├── FilterBar.jsx              ← Search + filter + sort + date range
    │   ├── AddTransactionModal.jsx    ← Add/Edit transaction form modal
    │   ├── ConfirmModal.jsx           ← Reusable confirmation dialog
    │   ├── Toast.jsx                  ← Stacked toast notification container
    │   ├── EmptyState.jsx             ← No results placeholder
    │   ├── InsightCard.jsx            ← Single insight metric card
    │   ├── MonthlyComparisonChart.jsx ← Grouped bar (income vs expenses)
    │   └── CategoryBarChart.jsx       ← Horizontal bar (category ranking)
    ├── pages/
    │   ├── Dashboard.jsx              ← Dashboard with welcome banner + budgets
    │   ├── Transactions.jsx           ← Transactions with bulk select/delete
    │   ├── Insights.jsx               ← Insights with financial health score
    │   ├── Profile.jsx                ← User profile page
    │   ├── Settings.jsx               ← Tabbed settings page
    │   └── Help.jsx                   ← Help & FAQ page
    ├── data/
    │   └── db.json                    ← Reference copy of mock data
    ├── hooks/
    │   ├── useTransactions.js         ← Custom hook for CRUD API calls
    │   └── useCountUp.js             ← Count-up animation hook
    └── utils/
        └── helpers.js                 ← Currency formatting, calculations
```

---

## Design Decisions

- **Color System**: Warm orange (#F97316) primary accent with clean white cards on light blue-gray backgrounds. Fully themed dark mode with slate tones.
- **Component Architecture**: Each UI element is a self-contained component with clear props. Pages compose components together.
- **State Management**: Single Context provider avoids prop drilling. `useMemo` ensures derived data (filtered transactions, chart data, summary totals) is computed efficiently and reactively.
- **Responsive Strategy**: CSS Grid + Tailwind breakpoints. Sidebar collapses to bottom tab bar on mobile. Cards stack vertically.
- **Error Handling**: Graceful fallback to localStorage when JSON Server is unavailable. Loading skeletons prevent layout shift.
- **Bug Fix Strategy**: Stale closure bug in `addTransaction`/`editTransaction` fixed by using functional state updaters (`prev => ...`) instead of referencing `transactions` directly. Summary values computed via `useMemo` keyed on `[transactions]` for instant reactivity.
- **Toast System**: Built into Context with auto-dismiss timers. No external library needed.

---

## Role-Based Access Control

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard & charts | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Search, filter & date range | ✅ | ✅ |
| Export CSV / JSON | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |
| Bulk select & delete | ❌ | ✅ |
| Import transactions | ✅ | ✅ |

Switch roles using the dropdown in the navbar. The UI visibly changes — Admin sees action buttons, checkboxes, and delete icons that Viewer does not.

---

## License

This project was built for educational and evaluation purposes as part of the Zorvyn FinTech internship screening process.
