# TabBar Navigation Design

**Date:** 2026-07-03  
**Status:** Approved

## Problem

The current `SegmentSwitch` (問題/概念 toggle) is `hidden md:block` in the TopBar, making it inaccessible on mobile. On mobile, users must open the hamburger menu to switch between sections — an extra step that hurts discoverability.

Additionally, the hamburger menu itself exists solely to expose this navigation on mobile, adding unnecessary UI complexity.

## Solution

Replace the in-header `SegmentSwitch` + hamburger menu pattern with a full-width `TabBar` placed directly below the TopBar. Visible at all screen sizes.

## Design

### TopBar (simplified)

Remove:
- `SegmentSwitch` (center column, `hidden flex-1 justify-center md:flex`)
- Hamburger button and mobile dropdown menu

Result: `[Logo] ← flex-1 → [Search] [ThemeToggle]`

The header becomes a single-row utility bar without navigation responsibility.

### TabBar component

New file: `components/layout/TabBar.tsx`

```
┌─────────────────────────────────────────────────────┐
│   ____問題____   │         概念                     │
│   ▁▁▁▁▁▁▁▁▁▁▁                                      │  ← 2px accent underline
└─────────────────────────────────────────────────────┘
```

- Full-width flex row, `border-b border-line`
- Each tab: `flex-1`, centered text, `py-3`, `text-[14px] font-semibold`
- Active state: `text-fg` + `border-b-2 border-accent`
- Inactive state: `text-fg-3 hover:text-fg-2 border-b-2 border-transparent`
- Props: `{ active: "problems" | "concepts" }`

### Integration

Insert `<TabBar active={variant} />` immediately after `<TopBar ... />` in:
- `components/library/LibraryView.tsx`
- `components/library/ConceptLibraryView.tsx`

The `TopBar` `variant` prop remains unchanged; `TabBar` uses the same value.

## Files Changed

| File | Change |
|------|--------|
| `components/layout/TopBar.tsx` | Remove SegmentSwitch, hamburger button, and mobile dropdown |
| `components/layout/TabBar.tsx` | New component |
| `components/layout/SegmentSwitch.tsx` | Delete (no longer used) |
| `components/library/LibraryView.tsx` | Add `<TabBar>` below `<TopBar>` |
| `components/library/ConceptLibraryView.tsx` | Add `<TabBar>` below `<TopBar>` |
| `components/layout/TopBar.test.tsx` | Update tests to remove hamburger assertions |

## Out of Scope

- Detail pages (`/problems/[id]`, `/concepts/[id]`) — they use TocRail for navigation, not TopBar
- Chat page — separate layout
