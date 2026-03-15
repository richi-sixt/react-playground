import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { MultiplayerTicTacToe } from '@/components/multiplayer/MultiplayerTicTacToe'

export const metadata: Metadata = {
  title: 'Tic Tac Toe – Multiplayer',
  description: 'Play Tic Tac Toe against a friend in real-time.',
}

export default function MultiplayerTicTacToePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Tic Tac Toe{' '}
          <span className="text-violet-500 dark:text-violet-400">
            Multiplayer
          </span>
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Play Tic Tac Toe against a friend in real time. 
          Create a room and share the code
          — or join an existing room.
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <MultiplayerTicTacToe />
      </div>
    </Container>
  )
}
