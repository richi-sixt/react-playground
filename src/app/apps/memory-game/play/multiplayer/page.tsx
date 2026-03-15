import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { MultiplayerMemoryGame } from '@/components/multiplayer/MultiplayerMemoryGame'

export const metadata: Metadata = {
  title: 'Memory Game – Multiplayer',
  description: 'Play Memory Game against a friend in real-time.',
}

export default function MultiplayerMemoryGamePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Memory Game{' '}
          <span className="text-violet-500 dark:text-violet-400">
            Multiplayer
          </span>
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Play Memory against a friend in real time. Find the most pairs to win!
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <MultiplayerMemoryGame />
      </div>
    </Container>
  )
}
