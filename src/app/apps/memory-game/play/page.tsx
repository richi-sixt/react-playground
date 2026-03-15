import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { GamePageHeader } from '@/components/GamePageHeader'
import { MemoryGame } from '@/components/games/MemoryGame'

export const metadata: Metadata = {
  title: 'Memory Game',
  description: 'A card-matching memory game with flip animations.',
}

export default function MemoryGamePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <GamePageHeader
        titleKey="memory.title"
        descriptionKey="memory.description"
        multiplayerHref="/apps/memory-game/play/multiplayer/"
        multiplayerLabelKey="memory.playMultiplayer"
      />
      <div className="mt-16 sm:mt-20">
        <MemoryGame />
      </div>
    </Container>
  )
}
