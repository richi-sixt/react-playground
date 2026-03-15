import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { MultiplayerPageHeader } from '@/components/GamePageHeader'
import { MultiplayerTicTacToe } from '@/components/multiplayer/MultiplayerTicTacToe'

export const metadata: Metadata = {
  title: 'Tic Tac Toe – Multiplayer',
  description: 'Play Tic Tac Toe against a friend in real-time.',
}

export default function MultiplayerTicTacToePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <MultiplayerPageHeader
        titleKey="mp.ttt.title"
        descriptionKey="mp.ttt.description"
      />
      <div className="mt-16 sm:mt-20">
        <MultiplayerTicTacToe />
      </div>
    </Container>
  )
}
