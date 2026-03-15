import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { MultiplayerPageHeader } from '@/components/GamePageHeader'
import { MultiplayerMemoryGame } from '@/components/multiplayer/MultiplayerMemoryGame'

export const metadata: Metadata = {
  title: 'Memory Game – Multiplayer',
  description: 'Play Memory Game against a friend in real-time.',
}

export default function MultiplayerMemoryGamePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <MultiplayerPageHeader
        titleKey="mp.memory.title"
        descriptionKey="mp.memory.description"
      />
      <div className="mt-16 sm:mt-20">
        <MultiplayerMemoryGame />
      </div>
    </Container>
  )
}
