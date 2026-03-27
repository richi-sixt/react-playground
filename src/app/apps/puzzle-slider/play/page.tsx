import { type Metadata } from 'next'

import { Container } from '@/components/Container'
import { GamePageHeader } from '@/components/GamePageHeader'
import { PuzzleSlider } from '@/components/games/PuzzleSlider'

export const metadata: Metadata = {
  title: '15 Puzzle',
  description: 'A classic sliding puzzle. Arrange tiles 1–15 in order.',
}

export default function PuzzleSliderPlayPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <GamePageHeader
        titleKey="puzzle.title"
        descriptionKey="puzzle.description"
      />
      <div className="mt-16 sm:mt-20">
        <PuzzleSlider />
      </div>
    </Container>
  )
}
