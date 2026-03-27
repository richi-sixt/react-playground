'use client'

import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useTranslation } from '@/i18n'

// The board is a flat array of 16 numbers.
// Numbers 1–15 are tiles; 0 represents the empty space.
type Board = number[]

const GRID = 4
const GOAL: Board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]

// --- Solvability ---
// A 15-puzzle (4×4 even-width grid) is solvable when:
//   • blank on an even row from bottom  →  inversions must be odd
//   • blank on an odd row from bottom   →  inversions must be even
function countInversions(board: Board): number {
  const tiles = board.filter((n) => n !== 0)
  let inv = 0
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inv++
    }
  }
  return inv
}

function isSolvable(board: Board): boolean {
  const blankRow = Math.floor(board.indexOf(0) / GRID) // 0-indexed from top
  const blankRowFromBottom = GRID - blankRow // 1-indexed from bottom
  const inv = countInversions(board)
  return blankRowFromBottom % 2 === 0 ? inv % 2 === 1 : inv % 2 === 0
}

function createShuffledBoard(): Board {
  const board = [...GOAL]
  // Fisher-Yates shuffle
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[board[i], board[j]] = [board[j], board[i]]
  }
  if (!isSolvable(board)) {
    // Swap the first two non-blank tiles to flip parity — blank row stays the same
    const nonZero = board.reduce<number[]>(
      (acc, v, i) => (v !== 0 ? [...acc, i] : acc),
      [],
    )
    ;[board[nonZero[0]], board[nonZero[1]]] = [board[nonZero[1]], board[nonZero[0]]]
  }
  return board
}

// --- Movement ---
function isAdjacentToBlank(tileIdx: number, blankIdx: number): boolean {
  const tr = Math.floor(tileIdx / GRID)
  const tc = tileIdx % GRID
  const br = Math.floor(blankIdx / GRID)
  const bc = blankIdx % GRID
  return Math.abs(tr - br) + Math.abs(tc - bc) === 1
}

function isGoal(board: Board): boolean {
  return board.every((v, i) => v === GOAL[i])
}

// --- Timer display ---
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function PuzzleSlider() {
  const { t } = useTranslation()

  // Start with null to avoid SSR / hydration mismatch (same pattern as MemoryGame)
  const [board, setBoard] = useState<Board | null>(null)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [isWon, setIsWon] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialise board client-side only
  useEffect(() => {
    setBoard(createShuffledBoard())
  }, [])

  // Timer: starts on first move, stops on win
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerActive])

  function handleTileClick(idx: number) {
    if (!board || isWon) return
    const blankIdx = board.indexOf(0)
    if (!isAdjacentToBlank(idx, blankIdx)) return

    const newBoard = [...board]
    ;[newBoard[idx], newBoard[blankIdx]] = [newBoard[blankIdx], newBoard[idx]]

    const newMoves = moves + 1
    setBoard(newBoard)
    setMoves(newMoves)

    if (newMoves === 1) setTimerActive(true)

    if (isGoal(newBoard)) {
      setIsWon(true)
      setTimerActive(false)
    }
  }

  function handleNewGame() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setBoard(createShuffledBoard())
    setMoves(0)
    setTime(0)
    setTimerActive(false)
    setIsWon(false)
  }

  // Show goal state as placeholder during SSR (no random tiles flash on hydration)
  const displayBoard: Board = board ?? GOAL

  return (
    <div className="flex flex-col items-center">
      {/* Stats bar */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          {t('puzzle.moves', { count: moves })}
        </div>
        <div className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          {t('puzzle.time', { time: formatTime(time) })}
        </div>
        <button
          onClick={handleNewGame}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          {t('puzzle.newGame')}
        </button>
      </div>

      {/* Win banner */}
      {isWon && (
        <div className="mb-6 rounded-lg bg-green-50 px-6 py-3 text-lg font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {t('puzzle.youWon', { moves, time: formatTime(time) })}
        </div>
      )}

      {/* Board — 4×4 grid */}
      <div className="grid grid-cols-4 gap-2">
        {displayBoard.map((value, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            disabled={value === 0 || isWon}
            aria-label={value === 0 ? 'empty' : `tile ${value}`}
            className={clsx(
              'flex h-16 w-16 items-center justify-center rounded-xl text-xl font-bold',
              'transition-all duration-150 sm:h-20 sm:w-20 sm:text-2xl',
              value === 0
                ? 'cursor-default bg-zinc-100 dark:bg-zinc-800/50'
                : [
                    'cursor-pointer shadow-md',
                    'bg-violet-500 text-white',
                    'hover:bg-violet-400 active:scale-95',
                    'dark:bg-violet-600 dark:hover:bg-violet-500',
                    isWon && 'ring-2 ring-green-400 dark:ring-green-500',
                  ],
            )}
          >
            {value !== 0 && value}
          </button>
        ))}
      </div>
    </div>
  )
}
