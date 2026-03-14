
import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { MemoryGame } from '@/components/games/MemoryGame'

export const metadata: Metadata = {
  title: 'Memory Game',
  description: 'A card-matching memory game with flip animations.',
}

export default function MemoryGamePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Memory Game
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Flip cards to find matching pairs. Match all 6 pairs in as few moves
          as possible.
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <MemoryGame />
      </div>
    </Container>
  )
}
