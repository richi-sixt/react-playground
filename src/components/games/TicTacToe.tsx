'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n'

interface SquareProps {
  value: string | null
  onSquareClick: () => void
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      className="h-20 w-20 border border-zinc-300 bg-white text-2xl font-bold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

interface BoardProps {
  xIsNext: boolean
  squares: (string | null)[]
  onPlay: (squares: (string | null)[]) => void
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  let { t } = useTranslation()

  function handleClick(i: number): void {
    if (squares[i] || calculateWinner(squares)) {
      return
    }
    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? 'X' : 'O'
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  const status = winner
    ? t('ttt.winner', { mark: winner })
    : t('ttt.nextPlayer', { mark: xIsNext ? 'X' : 'O' })

  return (
    <>
      <div className="mb-3 text-lg font-medium text-zinc-800 dark:text-zinc-200">
        {status}
      </div>
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex">
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
              />
            )
          })}
        </div>
      ))}
    </>
  )
}

export function TicTacToe() {
  let { t } = useTranslation()
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares: (string | null)[]): void {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number): void {
    setCurrentMove(nextMove)
  }

  const moves = history.map((_squares, move) => {
    const description =
      move > 0 ? t('ttt.goToMove', { move }) : t('ttt.restart')
    return (
      <li key={move}>
        <button
          className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    )
  })

  return (
    <div className="flex flex-col items-center">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {t('ttt.moveHistory')}
        </h3>
        <ol className="mt-3 space-y-2">{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares: (string | null)[]): string | null {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}
