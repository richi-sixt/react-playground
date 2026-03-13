export interface GameEntry {
  slug: string
  title: string
  description: string
  tech: string[]
  date: string
  category: 'game' | 'experiment' | 'demo'
}

export const games: GameEntry[] = [
  {
    slug: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description:
      'Classic two-player game with move history and time travel. Built following the official React tutorial.',
    tech: ['React', 'TypeScript', 'useState'],
    date: '2025-01-01',
    category: 'game',
  },
]

export function getAllGames(): GameEntry[] {
  return games.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
