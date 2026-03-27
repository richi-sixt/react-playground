'use client'

import { useState } from 'react'
import { TicTacToe } from '@/components/games/TicTacToe'
import { TicTacToeSettings } from '@/components/games/TicTacToeSettings'
import type { Difficulty, GameMode } from '@/lib/tic-tac-toe-ai'

export function TicTacToePlayClient() {
  const [mode, setMode] = useState<GameMode>('local')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [gameKey, setGameKey] = useState(0)

  function handleModeChange(newMode: GameMode) {
    setMode(newMode)
    setGameKey((k) => k + 1)
  }

  function handleDifficultyChange(newDifficulty: Difficulty) {
    setDifficulty(newDifficulty)
    setGameKey((k) => k + 1)
  }

  return (
    <>
      <TicTacToeSettings
        mode={mode}
        difficulty={difficulty}
        onModeChange={handleModeChange}
        onDifficultyChange={handleDifficultyChange}
      />
      <TicTacToe key={gameKey} mode={mode} difficulty={difficulty} />
    </>
  )
}
