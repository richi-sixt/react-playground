import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { GamePageHeader } from '@/components/GamePageHeader'
import { TicTacToe } from '@/components/games/TicTacToe'

export const metadata: Metadata = {
  title: 'Tic Tac Toe',
  description: 'Classic two-player tic-tac-toe game with move history.',
}

export default function TicTacToePage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <GamePageHeader
        titleKey="ttt.title"
        descriptionKey="ttt.description"
        multiplayerHref="/apps/tic-tac-toe/play/multiplayer/"
        multiplayerLabelKey="ttt.playMultiplayer"
      />
      <div className="mt-16 sm:mt-20">
        <TicTacToe />
      </div>
    </Container>
  )
}
