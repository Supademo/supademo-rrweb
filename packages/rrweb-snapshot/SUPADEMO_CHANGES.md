# Supademo Custom Patches for rrweb-snapshot

This document describes the custom modifications made by Supademo to the upstream rrweb-snapshot package.

## Overview

These patches address specific issues encountered when recording web pages for Supademo's demo recording platform. The modifications focus on CSS capture accuracy, canvas handling, error resilience, and additional configuration options.

---

## CSS Capture Patches

### 1. Smart Merge CSS Strategy (CSS Variables & Shorthand Preservation)

**Commit:** Current
**Files:** `src/utils.ts`, `src/snapshot.ts`

#### Problem

The standard CSSOM API (`.sheet.cssRules`) normalizes CSS when serializing, causing:
- **CSS variables disappear** - Custom properties like `--my-color: red` are lost entirely
- **Shorthand properties expand** - `background: url(x) center/cover` becomes 8+ longhand properties

#### Solution

Implemented a "Smart Merge" strategy:
1. Uses `textContent` as the primary source for inline `<style>` elements (preserves original CSS)
2. Detects dynamically added rules via CSSOM (e.g., `insertRule()`)
3. Merges both sources: textContent + CSSOM-only rules (marked with `/* rrweb-cssom-rules */`)

---

### 2. `all: unset` Workaround

**Commit:** `8002aa3`
**File:** `src/utils.ts`

#### Problem

Browsers expand `all: unset` into all longhand properties, breaking the order of subsequent CSS rules and producing massive output.

#### Solution

When `all: unset` is detected in inline stylesheet text content, bypass CSSOM entirely and use raw `textContent`.

#### Trade-off

Won't capture styles added dynamically via CSSOM for stylesheets containing `all: unset`.

---

### 3. `absolutifyURLs` Fix

**Commit:** `01ba18b`
**File:** `src/utils.ts`

#### Problem

The original `absolutifyURLs` function used manual path resolution logic that failed on edge cases with relative paths and protocol-relative URLs.

#### Solution

Replaced with implementation using the standard `URL()` constructor:
```typescript
const absoluteUrl = new URL(filePath, href).href;
```

---

### 4. `splitCssText` Simplification

**Commits:** `aa6b632`, `16f505d`
**File:** `src/utils.ts`

#### Problem

The original `splitCssText` function used a complex algorithm to map stringified CSS output back to individual text nodes. This was fragile and could fail on unusual `<style>` element structures.

#### Solution

Replaced with a simpler, more robust implementation that:
- Handles null/undefined values gracefully
- Uses direct text node content when available
- Falls back safely on errors

#### Skipped Tests

Three tests in `test/css.test.ts` are skipped because they test the upstream reverse-mapping behavior that was intentionally replaced. The skipped tests are marked with `it.skip()` and document the original behavior for reference.

---

### 5. `markCssSplits` Error Handling

**Commit:** `2941143`
**File:** `src/snapshot.ts`

#### Problem

`markCssSplits` could throw errors on malformed or unusual `<style>` elements, causing snapshot failures.

#### Solution

Wrapped in try-catch that logs a warning in development and falls back to original CSS text on error.

---

### 6. PostCSS Parser Failsafe

**Commit:** `53a20e1`
**File:** `src/snapshot.ts`

#### Problem

PostCSS could throw errors when parsing certain malformed CSS.

#### Solution

Added try-catch wrapper around `extractHoverPseudoClass` to prevent snapshot failures.

---

### 7. Hover Pseudo-Class Extraction

**Commits:** `399fd0f`, `fe0b6e2`
**Files:** `src/snapshot.ts`, `src/css.ts`

#### Feature

Extracts `:hover` pseudo-classes and converts them to class-based selectors for replay compatibility. This allows hover states to be simulated during playback.

---

## Canvas Capture Patches

### 8. Canvas `toDataURL` Fix

**Commit:** `11f53dd`
**File:** `src/snapshot.ts`

#### Problem

Duplicate or empty canvas `toDataURL` calls were causing issues.

#### Solution

Removed redundant second `toDataURL` call and added proper empty canvas handling.

---

### 9. WebGL Canvas Capture Improvements

**Commit:** `b62d7ec`
**File:** `src/snapshot.ts`

#### Feature

Improved WebGL canvas capture with better context handling and preservation options.

---

### 10. Canvas Fallback Capture Support

**Commit:** Current
**File:** `src/snapshot.ts`

#### Problem

Some canvases cannot be captured via `toDataURL()`:
- **WebGL with `preserveDrawingBuffer: false`**: The WebGL buffer is cleared after each frame, so `toDataURL()` returns a black/transparent image
- **Tainted canvases**: Cross-origin content causes a `SecurityError` when calling `toDataURL()`

#### Solution

Added two new attributes to canvas serialization to enable fallback capture via viewport screenshot cropping:

1. **`rr_canvasBounds`** (always present for canvas elements):
   ```typescript
   {
     x: number,      // viewport-relative X position
     y: number,      // viewport-relative Y position
     width: number,  // element width
     height: number, // element height
     inViewport: boolean  // whether canvas is visible in viewport
   }
   ```

2. **`rr_skipReason`** (only when capture fails):
   - `'webgl-no-preserve-buffer'` - WebGL context with `preserveDrawingBuffer: false`
   - `'tainted'` - Cross-origin content (SecurityError)

#### Implementation

Before attempting `toDataURL()`, the code now:
1. Always captures bounds via `getBoundingClientRect()`
2. Pre-checks WebGL contexts for `preserveDrawingBuffer: false` to avoid wasted `toDataURL()` calls
3. Sets `rr_skipReason` instead of `rr_dataURL` when capture is known to fail
4. Catches `SecurityError` for tainted canvases and sets appropriate skip reason

#### Consumer Usage

The consuming application (e.g., Supademo Extension) can detect `rr_skipReason` and use `rr_canvasBounds` to crop the canvas region from a viewport screenshot as a fallback.

---

## Animation Patches

### 11. Web Animations API Capture

**Commit:** `e5e2815`
**File:** `src/snapshot.ts`

#### Feature

Captures Web Animations API state in snapshots, allowing CSS animations and transitions created via JavaScript to be preserved and replayed.

---

## Shadow DOM Patches

### 12. adoptedStyleSheets Support

**Commits:** `bb85236`, `151082d`
**File:** `src/snapshot.ts`

#### Feature

Added support for `adoptedStyleSheets` in Shadow DOM, which is used by modern web components and CSS-in-JS libraries that target Shadow DOM.

---

## Configuration Options

### 13. `ignoreSelector` Support

**Commit:** `c03763b`
**Files:** `src/snapshot.ts`, `src/types.ts`

#### Feature

Added `ignoreSelector` option to exclude specific elements from recording based on CSS selectors.

---

### 14. `customGenId` / `genId` Support

**Commits:** `86b26cf`, `2c0cd9b`
**Files:** `src/snapshot.ts`, `src/types.ts`

#### Feature

Added support for custom ID generation functions, allowing applications to use their own ID schemes for recorded nodes.

---

## Testing

To verify these patches work correctly, test with:

1. **CSS Variables:**
   ```html
   <style>:root { --color: red; } .btn { color: var(--color); }</style>
   ```

2. **Background Shorthand:**
   ```html
   <style>.hero { background: url(x.jpg) center/cover no-repeat; }</style>
   ```

3. **Dynamic Rules (insertRule):**
   ```javascript
   style.sheet.insertRule('.dynamic { color: blue; }', 0);
   ```

4. **CSS-in-JS (empty style + insertRule):**
   ```javascript
   const style = document.createElement('style');
   document.head.appendChild(style);
   style.sheet.insertRule('.cssinjs { color: red; }', 0);
   ```

5. **Shadow DOM with adoptedStyleSheets:**
   ```javascript
   const sheet = new CSSStyleSheet();
   sheet.replaceSync('.shadow { color: blue; }');
   shadowRoot.adoptedStyleSheets = [sheet];
   ```

---

## Commit History Summary

| Commit | Description |
|--------|-------------|
| `e5e2815` | Web Animations API capture |
| `b62d7ec` | WebGL canvas capture improvements |
| `8002aa3` | `all: unset` serialization workaround |
| `01ba18b` | `absolutifyURLs` fix |
| `16f505d` | `splitCssText` return fix |
| `aa6b632` | `splitCssText` simplification |
| `53a20e1` | PostCSS parser failsafe |
| `11f53dd` | Canvas `toDataURL` fix |
| `c03763b` | `ignoreSelector` support |
| `86b26cf` | `customGenId` support |
| `2941143` | `markCssSplits` error handling |
| `399fd0f` | Hover pseudo-class extraction |
| `151082d` | `adoptedStyleSheets` rebuild fix |
| `bb85236` | `adoptedStyleSheets` Shadow DOM support |

---

## Upstream Considerations

These patches are specific to Supademo's use case. If upstreaming:
- The smart merge CSS strategy could benefit the broader rrweb community
- The `all: unset` workaround has general applicability
- Error handling improvements are universally beneficial
- `ignoreSelector` and `customGenId` are feature additions that may be useful upstream
