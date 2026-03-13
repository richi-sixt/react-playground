
import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { TicTacToe } from '@/components/games/TicTacToe'

export const metadata: Metadata = {
  title: 'Tic Tac Toe',
  description: 'Classic two-player tic-tac-toe game with move history.',
}

export default function TicTacToePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Tic Tac Toe
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Classic two-player game with move history and time travel. Built
          following the official React tutorial.
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <TicTacToe />
      </div>
    </Container>
  )
}
