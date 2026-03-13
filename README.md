# React Playground

A personal playground for learning and exploring React features, patterns, and concepts hands-on. Each entry is a small, self-contained project that focuses on specific React topics.

## What's Inside

| Game / Experiment | Topics Covered | Path |
|---|---|---|
| **Tic Tac Toe** | `useState`, immutable state updates, component composition, lifting state up | `/games/tic-tac-toe` |

## Learning Goals

This project exists to:

- **Learn by building** — each feature is a small, focused experiment rather than a tutorial follow-along
- **Explore React patterns** — state management, hooks, context, effects, refs, and more
- **Try things out** — a safe space to break things, refactor, and understand *why* something works

## Adding a New Experiment

1. Add an entry to the registry in `src/lib/games.ts`
2. Create the component in `src/components/games/YourComponent.tsx` (use `'use client'` for interactive components)
3. Create a page at `src/app/games/your-slug/page.tsx`

That's it — the home page and games listing pick it up automatically.

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19** with TypeScript
- **Tailwind CSS v4** with dark mode
- **MDX** support (ready for documentation pages)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Ideas for Future Experiments

- **Memory Game** — `useEffect`, timers, conditional rendering
- **Todo App** — `useReducer`, `useContext`, CRUD patterns
- **Fetch & Display** — data fetching, loading states, error boundaries
- **Drag & Drop** — refs, pointer events, custom hooks
- **Theme Builder** — CSS custom properties, context, persistence
- **Animation Sandbox** — transitions, `useRef`, `requestAnimationFrame`

## Resources

- [React Tutorial: Tic-Tac-Toe](https://react.dev/learn/tutorial-tic-tac-toe) — where the first experiment started
- [React Docs](https://react.dev/learn) — official learning guide
- [Next.js Docs](https://nextjs.org/docs) — framework documentation
