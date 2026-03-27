# React Playground

A personal playground for learning and exploring React features, patterns, and concepts hands-on. Each entry is a small, self-contained project that focuses on specific React topics.

## What's Inside

| App             | Topics Covered                                                                                           | Path                |
| --------------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| **Tic Tac Toe** | `useState`, immutable state, component composition, lifting state up, multiplayer (Supabase Realtime)    | `/apps/tic-tac-toe` |
| **Memory Game** | `useState`, `useEffect`, timers, conditional rendering, flip animations, multiplayer (Supabase Realtime) | `/apps/memory-game` |
| **15 Puzzle** | `setInterval`, `useEffect`, `useRef` leak-free timer, sovalbility check, inversion counting, blank-row parity | `/apps/puzzle-slider` |

## Learning Goals

This project exists to:

- **Learn by building** — each feature is a small, focused experiment rather than a tutorial follow-along
- **Explore React patterns** — state management, hooks, context, effects, refs, and more
- **Try things out** — a safe space to break things, refactor, and understand _why_ something works

## Adding New Content

### Adding an App

1. Create a directory at `src/app/apps/your-slug/`
2. Add `page.en.mdx` with an exported `app` metadata object
3. Create the game component in `src/components/games/YourGame.tsx` (use `'use client'`)
4. Create `play/page.tsx` for the playable page

The home page picks up new apps automatically.

### Adding a Journal Entry

1. Create a directory in `journal-examples/your-slug/` (public) or `journal/your-slug/` (private submodule)
2. Add `page.en.mdx` with an exported `entry` metadata object and your MDX content
3. Add `page.tsx`, `MdxContent.tsx`, and optionally `page.de.mdx` for German
4. Run `npm run prepare-content` (or `npm run dev`, which runs it automatically)

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19** with TypeScript
- **Tailwind CSS v4** with dark mode
- **MDX** for content pages with syntax highlighting
- **Supabase** Realtime for multiplayer
- **i18n** — English & German with client-side locale switching

## Features

- **Journal** — MDX-based entries for documenting learnings (content managed via git submodule)
- **Multiplayer** — real-time game rooms via Supabase Realtime with shareable room codes
- **i18n** — English/German with automatic fallback when translations are missing
- **Static export** — pure HTML/CSS/JS output, no Node.js server needed (cPanel-friendly)
- **Dark mode** — system-aware theme switching

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Ideas and to-dos

- [x] ~~**Memory Game**~~ ✓
- [x] ~~**Tic-Tac-Toe** multiplayer~~ ✓
- [ ] How testing works with React/JS
- [ ] **Todo App** — `useReducer`, `useContext`, CRUD patterns, auth, database

## Resources

- [React Tutorial: Tic-Tac-Toe](https://react.dev/learn/tutorial-tic-tac-toe) — where the first experiment started
- [React Docs](https://react.dev/learn) — official learning guide
- [Next.js Docs](https://nextjs.org/docs) — framework documentation
- [Supabase](https://supabase.com) - database for managing rooms in multiplayer games
