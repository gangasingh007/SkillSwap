# SkillSwap Market — Design System

> Derived from `globals.css`. Every token below maps directly to a CSS variable defined in that file.
> All colors are expressed in OKLCH — the perceptually uniform color space used throughout this project.
> **Never use raw hex or HSL values in components. Always reference the semantic token.**

---

## 1. Design Vocabulary

The palette is built around two axes:

- **Terracotta / Rust** — the primary action color. Warm, confident, human. Hue sits at ~20° in OKLCH (red-orange territory). Used for all primary actions, active states, and brand marks.
- **Sandy Stone** — the neutral foundation. Every background, border, and muted surface is tinted slightly warm (hue 56–80°), never cold gray. This gives the entire UI a unified, editorial warmth.

The result reads like high-quality print design: ink on warm paper, with a single terracotta accent.

---

## 2. Color Tokens

### 2.1 Semantic Tokens (use these in components)

These are the only values you should reference in Tailwind classes or inline styles.

| Token | Light Mode | Dark Mode | Role |
|---|---|---|---|
| `--background` | `oklch(1.0000 0 0)` | `oklch(0.2050 0 0)` | Page background |
| `--foreground` | `oklch(0.3395 0.0274 64.41)` | `oklch(0.8282 0.0122 59.53)` | Primary body text |
| `--card` | `oklch(1.0000 0 0)` | `oklch(19.1% 0.00002 271 / 53.4%)` | Card surface |
| `--card-foreground` | `oklch(0.2174 0.0019 106.56)` | `oklch(1.0000 0 0)` | Text on cards |
| `--popover` | `oklch(1.0000 0 0)` | `oklch(23.6% 0.00152 16.29)` | Popover/dropdown surface |
| `--popover-foreground` | `oklch(0.2627 0.0188 66.85)` | `oklch(0.9526 0.0017 67.80)` | Text in popovers |
| `--primary` | `oklch(0.5975 0.1890 20.83)` | `oklch(0.6512 0.1793 18.37)` | Brand / CTA / active |
| `--primary-foreground` | `oklch(1.0000 0 0)` | `oklch(1.0000 0 0)` | Text on primary |
| `--secondary` | `oklch(0.9497 0.0084 56.31)` | `oklch(1.0000 0 0)` | Subtle fills, secondary buttons |
| `--secondary-foreground` | `oklch(0.4399 0.0179 70.61)` | `oklch(0.3174 0.0038 84.58)` | Text on secondary |
| `--muted` | `oklch(0.9587 0.0084 56.31)` | `oklch(0.2268 0.0041 84.59)` | De-emphasized surfaces |
| `--muted-foreground` | `oklch(0.6226 0.0066 59.59)` | `oklch(0.7892 0.0137 71.29)` | Placeholder / caption text |
| `--accent` | `oklch(0.9497 0.0084 56.31)` | `oklch(0.2170 0.0086 59.18)` | Hover fills, accent surfaces |
| `--accent-foreground` | `oklch(0.2627 0.0188 66.85)` | `oklch(0.9967 0.0013 106.42)` | Text on accent |
| `--destructive` | `oklch(0.2174 0.0019 106.56)` | `oklch(0.6747 0.2255 5.74)` | Error / danger |
| `--destructive-foreground` | `oklch(1.0000 0 0)` | `oklch(1.0000 0 0)` | Text on destructive |
| `--border` | `oklch(0.9135 0.0046 78.30)` | `oklch(0.3690 0.0093 80.68)` | Dividers, card outlines |
| `--input` | `oklch(0.7800 0.0126 67.64)` | `oklch(0.4418 0.0104 67.55)` | Input field borders |
| `--ring` | `oklch(0.5975 0.1890 20.83)` | `oklch(0.6512 0.1793 18.37)` | Focus rings |

### 2.2 Color Character Reference

A plain-English guide to what each tone looks and feels like — useful when making judgment calls.

| Token | Visual Description |
|---|---|
| `background` | Pure white (light) / Near-black neutral (dark) |
| `foreground` | Warm dark brown — not cool black, not pure ink |
| `primary` | **Terracotta rust** — a warm red-orange, mid-saturation. Like fired clay. |
| `secondary` | Very pale sandy cream — barely-there warm tint |
| `muted` | Off-white with a sandy warmth — one step above background |
| `muted-foreground` | Warm medium gray — captions, labels, supporting text |
| `accent` | Identical to secondary — warm sand fill for hover states |
| `border` | Warm light gray — almost invisible on white, always warm-tinted |
| `input` | Warmer medium gray — visible but not loud |
| `destructive` (dark) | Vivid warm red — distinct from primary's orange warmth |

### 2.3 Chart Tokens

Available as `var(--chart-1)` through `var(--chart-5)`. All sit in the warm red-orange family — these are not a full rainbow palette, they are **tonal variations of the primary terracotta**. Use them only for data visualization.

| Token | OKLCH | Description |
|---|---|---|
| `--chart-1` | `oklch(0.5367 0.1955 25.69)` | Deep terracotta |
| `--chart-2` | `oklch(0.7329 0.1386 275.20)` | Contrasting violet (use sparingly) |
| `--chart-3` | `oklch(0.8966 0.0215 60.72)` | Pale warm sand |
| `--chart-4` | `oklch(0.9214 0.0284 283.65)` | Very pale lavender |
| `--chart-5` | `oklch(0.5430 0.2028 26.05)` | Slightly richer terracotta |

> **Note:** chart-2 and chart-4 are the only cool-hued values in the entire system. Use them only when a hard contrast is needed in data viz — they will look out of place in UI components.

---

## 3. Typography

### 3.1 Font Stack

All three stacks fall back gracefully to system fonts. No external font is loaded in the base config — add a Google Font or local font by overriding `--font-sans` in `:root`.

```css
--font-sans:  ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
              'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
--font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
--font-mono:  ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
              'Liberation Mono', 'Courier New', monospace;
--font-heading: var(--font-sans); /* heading = sans by default; override to serif for editorial weight */
```

### 3.2 Usage Rules

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display / Hero | `font-sans` | `font-black` (900) | Page titles, section headers — use `tracking-tighter` |
| Heading | `font-heading` | `font-bold` (700) | Card headings, section labels |
| Body | `font-sans` | `font-medium` (500) | Paragraphs, descriptions |
| Caption / Label | `font-sans` | `font-semibold` (600) | Metadata, tags, eyebrow labels |
| Mono data | `font-mono` | `font-bold` (700) | Credit amounts, numbers, stat figures, rail identifiers |
| Legal / fine print | `font-sans` | `font-bold` (700) | Footer links, copyright — use uppercase + `tracking-widest` |

### 3.3 Tracking Scale

```css
--tracking-tighter: calc(var(--tracking-normal) - 0.05em)  /* Display headlines */
--tracking-tight:   calc(var(--tracking-normal) - 0.025em) /* Subheadings */
--tracking-normal:  0em                                     /* Body copy */
--tracking-wide:    calc(var(--tracking-normal) + 0.025em) /* — */
--tracking-wider:   calc(var(--tracking-normal) + 0.05em)  /* — */
--tracking-widest:  calc(var(--tracking-normal) + 0.1em)   /* Eyebrows, labels, caps */
```

**Rule:** Display text (`font-black`) always pairs with `tracking-tighter`. All-caps labels always pair with `tracking-widest`. These two pairings are enforced as a system rule, not a suggestion.

### 3.4 Numeric Figures

For any number that appears in isolation (stats, credit amounts, prices), apply tabular figures to prevent layout shift as digits change:

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum";
```

In Tailwind: add a utility class `highlight-number` with these properties, or apply via `[font-variant-numeric:tabular-nums]`.

---

## 4. Spacing & Border Radius

### 4.1 Spacing Unit

```css
--spacing: 0.25rem  /* = 4px at default root font size */
```

All spacing in the system is multiples of this unit. Use Tailwind's spacing scale (which maps to this) rather than arbitrary values.

### 4.2 Border Radius Scale

The scale is derived from `--radius: 0.5rem` (8px). Every radius token is a multiplier of this base.

| Token | Value | Pixels | Use |
|---|---|---|---|
| `radius-sm` | `calc(0.5rem * 0.6)` | ~5px | Badges, small tags |
| `radius-md` | `calc(0.5rem * 0.8)` | ~6px | Buttons, inputs, small cards |
| `radius-lg` | `0.5rem` | 8px | Standard cards, dropdowns |
| `radius-xl` | `calc(0.5rem * 1.4)` | ~11px | Feature cards, panels |
| `radius-2xl` | `calc(0.5rem * 1.8)` | ~14px | Modal dialogs, drawers |
| `radius-3xl` | `calc(0.5rem * 2.2)` | ~18px | Section containers |
| `radius-4xl` | `calc(0.5rem * 2.6)` | ~21px | Hero blocks, CTA boxes |

In Tailwind: reference as `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl`.

---

## 5. Shadow System

Shadows are deliberately subtle — low blur, no spread, very low opacity. The system uses warm-tinted shadow color.

```css
--shadow-color:   oklch(0 0 0)
--shadow-opacity: 0.1
--shadow-blur:    3px
--shadow-spread:  0px
--shadow-offset:  0, 1px
```

| Token | Value | Use |
|---|---|---|
| `shadow-2xs` | `0 1px 3px 0px hsl(0 0% 0% / 5%)` | Almost imperceptible lift |
| `shadow-xs` | `0 1px 3px 0px hsl(0 0% 0% / 5%)` | Tag / badge lift |
| `shadow-sm` | dual layer, 10% opacity | Default card shadow |
| `shadow` | dual layer, 10% opacity | Interactive card shadow |
| `shadow-md` | wider spread, 10% | Floating panels |
| `shadow-lg` | `4px` blur layer | Modals, dropdowns |
| `shadow-xl` | `8px` blur layer | Popovers, tooltips |
| `shadow-2xl` | single layer, **25% opacity** | Full-page overlays |

**Rule:** Never use drop shadows for decoration. Shadows exist only to communicate elevation — use them to indicate that a surface is floating above another surface (modal above page, card above grid, tooltip above content).

---

## 6. Component Conventions

### 6.1 Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Default (primary) | `bg-primary` | `text-primary-foreground` | none | Main CTA |
| Secondary | `bg-secondary` | `text-secondary-foreground` | none | Alternative action |
| Outline | transparent | `text-foreground` | `border-border` | Tertiary action |
| Ghost | transparent | `text-foreground` | none | Nav links, icon buttons |
| Destructive | `bg-destructive` | `text-destructive-foreground` | none | Delete, irreversible actions |

**Shape:** Primary CTAs use `rounded-xl` (not full pill, not sharp square). Navigation buttons use `rounded-lg`. Tags and badges use `rounded-sm`.

### 6.2 Cards

Three distinct card treatments — do not mix:

| Type | Background | Border | Radius | Use |
|---|---|---|---|---|
| Surface card | `bg-card` | `border border-border/40` | `rounded-xl` | Standard content card |
| Elevated card | `bg-background` | `border border-border/60` | `rounded-2xl` | Prominent, standalone |
| Inverse card | `bg-foreground` | none | `rounded-2xl` | Hero block, primary CTA section |

### 6.3 Inputs

Always use `border-input` for the border token (not `border-border`) — `--input` is a distinct, more visible warm gray, intended for form fields where the affordance needs to be clearer than a card outline.

```tsx
// Correct
<input className="border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground" />
```

### 6.4 Labels & Eyebrows

Section eyebrows (small uppercase labels above headings) follow this exact pattern:

```tsx
<div className="flex items-center gap-3 mb-4">
  <div className="h-px w-8 bg-primary" />
  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
    Section Label
  </span>
</div>
```

This pairing — a short horizontal rule in `primary` + small-caps label in `primary` — is the system's structural signature. Use it consistently at every section open.

### 6.5 Live / Status Indicators

For "systems active" or "live" indicators:

```tsx
<div className="flex items-center gap-2">
  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
    Live
  </span>
</div>
```

Note: `emerald-500` is the single exception to the warm-palette-only rule — it is reserved exclusively for "operational / live / success" status indicators where green carries a universal meaning that cannot be replaced with terracotta.

---

## 7. Motion

### 7.1 Easing

All motion should feel resolved and intentional. Use deceleration easing for elements entering the screen:

```js
// Standard entrance
{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }  // Custom decelerate

// Fast micro-interactions (hover, toggle)
{ duration: 0.2 }

// Stagger between siblings
{ staggerChildren: 0.09 }
```

### 7.2 Motion Patterns

| Pattern | Use | Implementation |
|---|---|---|
| Fade + slide up | Section reveals on scroll | `initial: { opacity: 0, y: 24 }` → `animate: { opacity: 1, y: 0 }` |
| Stagger children | Card grids, list items | `stagger.animate` variant with `staggerChildren: 0.09` |
| Hover lift | Category cards, interactive cards | `whileHover: { y: -3 }`, `transition: { duration: 0.2 }` |
| Scale press | CTA buttons | `whileTap: { scale: 0.98 }` |
| Continuous scroll | Ticker / marquee | CSS `animation: ticker 38s linear infinite` |

### 7.3 Accessibility

Always include a reduced-motion override for CSS animations:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-ticker { animation: none; }
}
```

For Framer Motion, wrap animations with the `useReducedMotion` hook when building complex orchestrated sequences.

---

## 8. Layout

### 8.1 Container

```tsx
<div className="container mx-auto px-4 sm:px-6" />
```

Always use the Tailwind `container` class — it maps to the project's max-width breakpoints. Inner padding is `px-4` on mobile, `px-6` on sm and above.

### 8.2 Section Rhythm

Sections use consistent vertical spacing. Do not mix these:

| Context | Tailwind Class |
|---|---|
| Full-page section padding | `py-24` or `py-28` |
| Tighter sections (stats bars, tickers) | `py-20` |
| Section header bottom margin | `mb-14` or `mb-16` |
| Card internal padding | `p-8` |
| Between sibling cards | `gap-5` |

### 8.3 Section Dividers

Sections are separated by `border-t border-border/30` — never by background color changes alone. The warm gray border creates gentle rhythm without being loud. `border-border/30` (30% opacity) is the standard; use `border-border/40` for slightly more visible internal card outlines.

---

## 9. Dark Mode

Dark mode is handled via the `.dark` class on the `<html>` element (set by the `ModeToggle` component).

All semantic tokens update automatically. Component code should never include explicit dark-mode color overrides (`dark:bg-gray-900`, etc.) — if a dark override is needed, it means the semantic token is being misused. Revisit the token choice instead.

**Dark mode character:**
- Background shifts to near-black neutral `oklch(0.2050 0 0)` — no blue or warm tint, purely achromatic dark
- Primary lightens slightly from `oklch(0.5975)` to `oklch(0.6512)` — terracotta remains vivid against the dark background
- Card surfaces gain a subtle semi-transparent quality (`/53.4%` alpha) — layering becomes perceptible
- Borders become visible warm-dark lines `oklch(0.3690)` rather than disappearing into white

---

## 10. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `text-foreground` for all body copy | Use `text-gray-900` or hardcoded colors |
| Reference `border-border` for all dividers | Use `border-gray-200` or similar |
| Use `bg-muted` for de-emphasized fills | Use `bg-gray-100` |
| Use `text-primary` for the terracotta accent | Use arbitrary warm colors (`text-orange-500`) |
| Apply `tracking-tighter` on all `font-black` display text | Leave display text at default tracking |
| Use `font-mono` + tabular-nums for all numeric values | Use sans-serif for credit/stat numbers |
| Apply the eyebrow pattern (rule + label) at each section | Use plain colored text labels alone |
| Keep shadows to `shadow-sm` or lighter for cards | Use heavy `shadow-xl` on standard cards |
| Use emerald-500 only for live/success status dots | Use emerald for general success color in components (use `primary` instead) |
| One primary CTA per section, `bg-primary` or `bg-foreground` | Two equally-weighted CTAs side by side |