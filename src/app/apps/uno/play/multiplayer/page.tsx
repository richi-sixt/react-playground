import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { MultiplayerPageHeader } from '@/components/GamePageHeader'
import { MultiplayerUno } from '@/components/multiplayer/MultiplayerUno'

export const metadata: Metadata = {
  title: 'UNO – Multiplayer',
  description: 'Play UNO with 2-4 players online in real-time.',
}

export default function MultiplayerUnoPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <MultiplayerPageHeader
        titleKey="mp.uno.title"
        descriptionKey="mp.uno.description"
      />
      <div className="mt-16 sm:mt-20">
        <MultiplayerUno />
      </div>
    </Container>
  )
}
