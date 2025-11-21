# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is **Supademo's fork of rrweb**, a browser session recording/replaying library. The fork contains custom patches, particularly in the snapshot package (`rrweb-snapshot`) for Supademo's specific recording needs.

## Common Commands

### Setup and Building
```bash
pnpm install                    # Install dependencies
pnpm build:all                  # Build all packages (uses 4GB heap)
pnpm dev                        # Watch mode for all packages
```

### Testing
```bash
pnpm test                       # Run all tests (sequential)
pnpm test:watch                 # Watch mode
pnpm test:update                # Update snapshots

# Single package testing
cd packages/rrweb && pnpm test:watch

# Headful browser testing (visible browser)
cd packages/rrweb && pnpm test:headful
```

### Code Quality
```bash
pnpm check-types                # TypeScript checking across all packages
pnpm format:head                # Format files from last commit
pnpm lint                       # ESLint + markdownlint
```

### Debugging
```bash
cd packages/rrweb && pnpm repl        # Interactive REPL for testing recording
cd packages/rrweb && pnpm live-stream # Local cobrowsing/mirroring session
```

## Architecture

### Monorepo Structure

This is a pnpm workspaces monorepo using Turbo for task orchestration.

**Core Packages:**
- `rrweb` - Main library combining record + replay
- `rrweb-snapshot` - DOM serializer (**key Supademo customizations here**)
- `rrweb-types` - Shared TypeScript types
- `rrweb-utils` - Utility functions

**Standalone Modules:**
- `record` - Standalone recording module
- `replay` - Standalone replaying module

**Infrastructure:**
- `rrdom` / `rrdom-nodejs` - Virtual DOM implementation for replay
- `rrweb-player` - Svelte 4-based replayer UI component
- `rrweb-packer` - Data compression/decompression

**Plugins:** Canvas WebRTC, console capture, sequential ID tracking (in `packages/plugins/`)

### Package Dependencies

```
rrweb (main)
├── rrweb-types
├── rrweb-utils
├── rrdom
└── rrweb-snapshot

rrdom
└── rrweb-snapshot

rrweb-snapshot
├── rrweb-types
└── rrweb-utils
```

All internal dependencies use `workspace:^` protocol.

### Build System

**Vite-based build** with configuration in `vite.config.default.ts`.

**Output formats per package:**
- ES modules (`.js`)
- CommonJS (`.cjs`)
- UMD (`.umd.cjs`, `.umd.min.cjs`)
- TypeScript declarations (`.d.ts`, `.d.cts`)

## Testing

- **Test runner:** Vitest (not Jest)
- **Browser automation:** Puppeteer with real browsers (not jsdom)
- **Globals enabled:** `describe`, `it`, `expect`, `beforeAll` available without imports
- **Test location:** `test/` directories within each package

## Code Style

From `docs/development/coding-style.md`:
- Files must end with newline
- Use `const`/`let`, arrow functions, template literals (ES6+)
- PascalCase for classes, camelCase for API sets
- Trailing commas required (Prettier enforced)
- Format with `pnpm format:head` before committing

## Important Notes

1. **Always use pnpm** (version 9.15.0 specified)
2. **TypeScript is mandatory** - run `pnpm check-types` frequently
3. **Memory-intensive builds** - full builds require 4GB Node heap
4. **Real browser testing** - tests run in actual Chrome via Puppeteer
5. **Turbo orchestration** - use `pnpm turbo run prepublish` for proper build ordering
6. **Main branch is `main`**, fork from `master` for PRs

## Authentication

This repository publishes to **GitHub Packages** registry which requires authentication.

**Required Environment Variable:**
```bash
export GITHUB_NPM_TOKEN=ghp_YourPersonalAccessToken
```

The `.npmrc` file uses `${GITHUB_NPM_TOKEN}` for authentication. You must set this environment variable before:
- Installing private dependencies
- Publishing packages

**Creating a GitHub Personal Access Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `write:packages` and `read:packages` scopes
3. Add to your shell profile (`~/.zshrc` or `~/.bashrc`):
   ```bash
   export GITHUB_NPM_TOKEN=ghp_YourTokenHere
   ```

## Publishing

Uses GitHub Packages registry with Changesets for versioning.

**Prerequisites:**
- `GITHUB_NPM_TOKEN` environment variable must be set (see Authentication above)

**Release workflow:**
```bash
# 1. Create changeset
pnpm changeset

# 2. Commit changeset
git add .changeset && git commit -m "chore: add changeset"

# 3. Version packages
pnpm changeset version

# 4. Commit version changes
git add . && git commit -m "chore: version packages"

# 5. Build and publish
pnpm release    # Build all + changeset publish

# 6. Push to remote
git push --follow-tags
```

