# Design Brief: Stoisches Tagebuch

## 1. App Analysis

### What This App Does
This is a **gamified Stoic journaling app** that helps users build daily philosophical habits through task completion and XP tracking. Users log journal entries, complete predefined tasks (like morning reflections, gratitude exercises, evening reviews), and earn experience points that contribute to various "stats" (character attributes like Wisdom, Discipline, Temperance). It's essentially a personal development RPG where daily Stoic practices level up your character.

### Who Uses This
A German-speaking individual interested in Stoicism and personal growth. They want to build consistent journaling habits and enjoy seeing their progress gamified. They check this dashboard daily - first thing in the morning and last thing in the evening - to see what tasks await them and how much XP they've earned.

### The ONE Thing Users Care About Most
**"How am I doing today?"** - They want to immediately see:
1. Their total XP earned today (the dopamine hit)
2. Open tasks they still need to complete
3. Their writing streak / consistency

### Primary Actions (IMPORTANT!)
Users need to DO things, not just view data:
1. **Eintrag schreiben** (Write Entry) → Primary Action Button - the most frequent action
2. Complete a task (mark as done)
3. View task details

---

## 2. What Makes This Design Distinctive

### Visual Identity
This dashboard evokes the **marble and bronze aesthetic of ancient Rome** - not literally, but through color choices. A warm stone-white background with deep bronze/amber accents creates a contemplative, timeless feel that matches Stoic philosophy. The design feels like a well-worn leather journal combined with a modern productivity app.

### Layout Strategy
**Asymmetric hero-left layout** - The left side (60% on desktop) contains the hero XP display and today's progress, creating immediate visual impact. The right side (40%) shows actionable items - open tasks that need attention. This mirrors how Stoics think: reflect on progress (left), then act (right).

On mobile, the hero XP dominates the first viewport with a large circular progress indicator, followed by scrollable task cards below. The layout creates visual interest through:
- **Size variation**: Hero XP is dramatically larger than task cards
- **Typography contrast**: Big bold numbers vs. subtle labels
- **Spacing rhythm**: Generous padding around hero, tighter grouping for tasks

### Unique Element
The **XP counter uses a subtle radial gradient glow** behind the number - like bronze catching firelight. When combined with the "Level" badge, it creates a game-like feeling without being childish. The number itself uses tabular figures for that satisfying counter aesthetic.

---

## 3. Theme & Colors

### Font
- **Family:** Source Serif 4
- **URL:** `https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600;8..60,700&display=swap`
- **Why this font:** Source Serif 4 has the gravitas of classical texts while remaining highly readable. Its variable weight axis allows for dramatic contrast between the bold XP numbers and lighter body text. It feels like wisdom carved in stone.

### Color Palette
All colors as complete hsl() functions:

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| Page background | `hsl(35 30% 97%)` | `--background` |
| Main text | `hsl(25 20% 15%)` | `--foreground` |
| Card background | `hsl(0 0% 100%)` | `--card` |
| Card text | `hsl(25 20% 15%)` | `--card-foreground` |
| Borders | `hsl(35 20% 88%)` | `--border` |
| Primary action (bronze) | `hsl(30 65% 45%)` | `--primary` |
| Text on primary | `hsl(40 30% 98%)` | `--primary-foreground` |
| Accent highlight | `hsl(35 40% 92%)` | `--accent` |
| Muted background | `hsl(35 20% 94%)` | `--muted` |
| Muted text | `hsl(25 10% 45%)` | `--muted-foreground` |
| Success/positive | `hsl(145 50% 40%)` | (component use) |
| Error/negative | `hsl(0 65% 50%)` | `--destructive` |

### Why These Colors
The warm cream background (`hsl(35 30% 97%)`) evokes parchment - the medium of ancient philosophers. The bronze primary (`hsl(30 65% 45%)`) references Roman coins and statues, connecting to Stoic origins (Marcus Aurelius, Seneca). Deep warm browns for text ensure readability while maintaining the aged-paper feel. This palette is calming yet distinguished.

### Background Treatment
The background uses a very subtle warm tint - not pure white. This creates visual warmth and reduces eye strain for a journaling app that might be used in low light (morning/evening routines). Cards are pure white to create subtle lift through contrast.

---

## 4. Mobile Layout (Phone)

### Layout Approach
The mobile layout creates visual hierarchy through dramatic size differences. The hero XP section fills ~40% of the viewport height with centered, large typography. Below it, tasks are compact cards that users can quickly scan and complete.

### What Users See (Top to Bottom)

**Header:**
- Simple title "Stoisches Tagebuch" in medium weight, left-aligned
- Date shown as "Heute, 25. Januar" in muted text below
- No complex navigation - this is a single-page dashboard

**Hero Section (The FIRST thing users see):**
The hero shows today's XP progress in a centered, focused display:
- Large XP number (64px, weight 700) in bronze color
- Label "XP heute" in small muted text below
- Secondary row showing: Tasks done (e.g., "3/5 Aufgaben") | Current streak (e.g., "7 Tage")
- Takes approximately 35-40% of viewport height
- Generous vertical padding (48px top, 32px bottom) creates breathing room
- This answers "how am I doing today?" instantly

**Section 2: Offene Aufgaben (Open Tasks)**
- Section header: "Offene Aufgaben" with count badge
- Compact task cards, each showing:
  - Task title (medium weight)
  - Category tag (small, muted badge)
  - XP reward (right-aligned, bronze colored)
  - Tap to complete (entire card is tappable)
- Cards have minimal vertical padding for density
- Maximum 4-5 visible without scrolling

**Section 3: Letzte Einträge (Recent Entries)**
- Section header: "Letzte Einträge"
- Simple list of recent journal entries
- Each item shows: Title, date, private badge if applicable
- Muted styling - this is reference, not primary focus

**Bottom Navigation / Action:**
- Fixed bottom button: "Eintrag schreiben" (Write Entry)
- Full-width, primary bronze color, 56px height
- Safe area padding at bottom
- This is THE primary action, always accessible

### Mobile-Specific Adaptations
- XP chart (shown on desktop) is hidden - too complex for quick mobile checks
- Tasks show simplified info (no description, just title + XP)
- Recent entries condensed to 3 items max

### Touch Targets
- Task cards: minimum 48px height for comfortable tapping
- Primary button: 56px height
- All interactive elements have 44px+ tap targets

### Interactive Elements
- Tapping a task card opens a bottom sheet with task details and "Als erledigt markieren" (Mark complete) button
- Tasks animate out smoothly when completed

---

## 5. Desktop Layout

### Overall Structure
**Two-column asymmetric layout**: 60% left (hero + chart) / 40% right (tasks + entries)

This creates a clear reading hierarchy:
1. Eye lands on large XP hero (top-left)
2. Scans down to progress chart
3. Moves right to see action items (tasks)
4. Scrolls right column for entries

Maximum content width: 1400px, centered with side padding.

### Section Layout

**Top area (full width):**
- Header bar with app title, date, and "Eintrag schreiben" button (right-aligned)

**Left column (60%):**
- **Hero KPI card**: Large XP display with today's total, tasks completed, and streak
- **Weekly Chart**: Area chart showing XP earned per day over the last 7 days
- More spacious layout with generous card padding

**Right column (40%):**
- **Open Tasks section**: Scrollable list of pending tasks with completion buttons
- **Recent Entries section**: Last 5 journal entries with preview text
- Denser information layout - this is the action zone

### What Appears on Hover
- Task cards: Subtle background darkening, cursor pointer
- Entry items: Underline on title, cursor pointer
- Chart: Tooltip showing exact XP for hovered day

### Clickable/Interactive Areas
- Task cards: Click to expand details inline or open modal
- Entry items: Click to view full entry (could navigate or open sheet)
- "Eintrag schreiben" button in header: Opens entry creation form

---

## 6. Components

### Hero KPI
The MOST important metric that users see first.

- **Title:** Heutige XP
- **Data source:** XP-Events app, filtered to today's date
- **Calculation:** Sum of `final_xp` for all events where `date` equals today
- **Display:** Large centered number (64px mobile, 80px desktop), bold weight, bronze color. Below it: two secondary stats in a row - "X/Y Aufgaben" and "Z Tage Streak"
- **Context shown:** Tasks completed ratio gives sense of progress. Streak shows consistency.
- **Why this is the hero:** The XP number is the gamification hook - it's the reward users seek. Seeing it prominently motivates continued engagement.

### Secondary KPIs

**Erledigte Aufgaben (Tasks Completed)**
- Source: Aufgaben app
- Calculation: Count where `status = 'done'` and `completed_at` is today / Total where `created_at` is today
- Format: "X/Y"
- Display: Inline with hero section, medium text

**Streak (Tage in Folge)**
- Source: Tagebucheintraege app
- Calculation: Count consecutive days with at least one entry ending today
- Format: "X Tage"
- Display: Inline with hero section, with subtle flame/fire icon

### Chart
- **Type:** Area chart - soft, filled area shows accumulated progress better than bare lines. The filled area creates visual weight, emphasizing growth.
- **Title:** XP diese Woche
- **What question it answers:** "Am I improving? How does today compare to recent days?"
- **Data source:** XP-Events app, grouped by date for last 7 days
- **X-axis:** Date (day name: Mo, Di, Mi, Do, Fr, Sa, So)
- **Y-axis:** Total XP (sum of `final_xp` per day)
- **Mobile simplification:** Hidden on mobile - the weekly overview isn't critical for quick daily checks

### Lists/Tables

**Offene Aufgaben (Open Tasks)**
- Purpose: Shows what the user needs to do - the actionable items
- Source: Aufgaben app
- Fields shown: title, XP reward (calculated from task_definition_id link), category (via task_definition_id → category_id)
- Mobile style: Compact cards, tap to complete
- Desktop style: Table-like rows with inline complete button
- Sort: By due_date (soonest first), then by importance
- Limit: All open tasks (status = 'open')

**Letzte Einträge (Recent Entries)**
- Purpose: Quick reference to recent journal entries
- Source: Tagebucheintraege app
- Fields shown: title, occurred_at (formatted as date), is_private badge
- Mobile style: Simple list items
- Desktop style: Cards with text preview (first 100 chars of `text` field)
- Sort: By occurred_at descending
- Limit: 5 items

### Primary Action Button (REQUIRED!)

- **Label:** "Eintrag schreiben"
- **Action:** add_record
- **Target app:** Tagebucheintraege (6975ec8930214ae3b085906a)
- **What data:** Form with fields:
  - title (text input, required)
  - text (textarea, required)
  - occurred_at (datetime, default to now)
  - is_private (checkbox, default false)
- **Mobile position:** bottom_fixed - always visible, one-tap access
- **Desktop position:** header - top right, prominent but not blocking content
- **Why this action:** Journaling is the core habit this app builds. Every other feature (XP, tasks, stats) exists to motivate this one action. Making it frictionless is essential.

---

## 7. Visual Details

### Border Radius
**rounded (8px)** - Soft enough to feel friendly, not so round as to feel childish. The `--radius` variable should be `0.5rem`.

### Shadows
**subtle** - Cards use `shadow-sm` equivalent: `0 1px 2px 0 rgb(0 0 0 / 0.05)`. Elevated elements (modals, floating buttons) use `shadow-md`. The goal is depth without heaviness.

### Spacing
**normal to spacious** - Hero section has generous padding (32-48px). Task cards are more compact (16px padding). The contrast between spacious hero and dense tasks creates visual rhythm.

### Animations
- **Page load:** Subtle fade-in (200ms) for the entire page. Numbers could optionally count up.
- **Hover effects:** Cards get subtle background color shift (5% darker). Buttons show cursor pointer.
- **Tap feedback:** Task completion triggers brief scale (0.98) and color pulse before card fades/slides out.

---

## 8. CSS Variables (Copy Exactly!)

The implementer MUST copy these values exactly into `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600;8..60,700&display=swap');

:root {
  --radius: 0.5rem;
  --background: hsl(35 30% 97%);
  --foreground: hsl(25 20% 15%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(25 20% 15%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(25 20% 15%);
  --primary: hsl(30 65% 45%);
  --primary-foreground: hsl(40 30% 98%);
  --secondary: hsl(35 20% 94%);
  --secondary-foreground: hsl(25 20% 20%);
  --muted: hsl(35 20% 94%);
  --muted-foreground: hsl(25 10% 45%);
  --accent: hsl(35 40% 92%);
  --accent-foreground: hsl(25 20% 20%);
  --destructive: hsl(0 65% 50%);
  --border: hsl(35 20% 88%);
  --input: hsl(35 20% 88%);
  --ring: hsl(30 65% 45%);
  --chart-1: hsl(30 65% 45%);
  --chart-2: hsl(35 40% 60%);
  --chart-3: hsl(145 50% 40%);
  --chart-4: hsl(25 30% 70%);
  --chart-5: hsl(35 20% 50%);
}
```

---

## 9. Implementation Checklist

The implementer should verify:
- [ ] Font loaded from Google Fonts URL above
- [ ] All CSS variables copied exactly to :root in index.css
- [ ] Mobile layout matches Section 4 - hero prominent, fixed bottom button
- [ ] Desktop layout matches Section 5 - 60/40 split columns
- [ ] Hero XP element is large and prominent as described
- [ ] Bronze accent color used for XP numbers and primary buttons
- [ ] Colors create warm, parchment-like mood described in Section 2
- [ ] Primary action button is always accessible (fixed mobile, header desktop)
- [ ] Tasks are tappable/clickable to complete
- [ ] Area chart shows weekly XP on desktop only
