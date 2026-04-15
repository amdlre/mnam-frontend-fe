# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js 16 Breaking Changes

This project uses **Next.js 16.2.3** which has breaking changes from earlier versions. Before writing any Next.js code, consult the bundled documentation at `node_modules/next/dist/docs/` — particularly the `01-app/` section for App Router patterns. Do not rely on prior Next.js knowledge without verifying against these docs.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Start production:** `npm run start`
- **Lint:** `npm run lint` (ESLint 9 flat config with Next.js core-web-vitals and TypeScript rules)

No test framework is currently configured.

## Tech Stack

- Next.js 16.2.3 with App Router
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS 4 (uses `@import "tailwindcss"` syntax and `@theme inline` for theming — not v3 config files)
- ESLint 9 (flat config format in `eslint.config.mjs`)

## Architecture

- **App Router only** — all routing lives in `/app` using file-based conventions
- Server Components are the default; add `"use client"` only when needed
- Path alias `@/*` maps to the project root (configured in `tsconfig.json`)
- Fonts: Geist and Geist Mono loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` and `--font-geist-mono`
- Dark mode: handled via `prefers-color-scheme` media query with CSS variables in `globals.css`

## Tailwind CSS 4

Tailwind v4 is significantly different from v3. There is no `tailwind.config.js` — theme customization uses the `@theme inline` directive in `globals.css`. The PostCSS plugin is `@tailwindcss/postcss`, not `tailwindcss`.
