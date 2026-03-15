'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { useTranslation } from '@/i18n'
import { GameLobby } from './GameLobby'
import {
  subscribeToRoom,
  unsubscribeFromRoom,
  updateGameState,
  type Room,
  type TicTacToeState,
} from '@/lib/multiplayer'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ---- Square & Board (simplified for multiplayer, no history) ----

function Square({
  value,
  onClick,
  disabled,
}: {
  value: string | null
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      className={clsx(
        'h-20 w-20 border border-zinc-300 text-2xl font-bold transition-colors dark:border-zinc-600',
        disabled
          ? 'cursor-not-allowed bg-zinc-50 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-100'
          : 'bg-white text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
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

// ---- Main component ----

export function MultiplayerTicTacToe() {
  const { t } = useTranslation()
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId, setPlayerId] = useState<string>('')
  const channelRef = useRef<RealtimeChannel | null>(null)

  const handleRoomUpdate = useCallback((updatedRoom: Room) => {
    setRoom(updatedRoom)
  }, [])

  // Subscribe to room updates
  useEffect(() => {
    if (!room) return

    channelRef.current = subscribeToRoom(room.id, handleRoomUpdate)

    return () => {
      if (channelRef.current) {
        unsubscribeFromRoom(channelRef.current)
        channelRef.current = null
      }
    }
  }, [room?.id, handleRoomUpdate])

  function handleRoomReady(readyRoom: Room, pid: string) {
    setRoom(readyRoom)
    setPlayerId(pid)
  }

  // ---- Lobby phase ----
  if (!room || room.status === 'waiting') {
    return (
      <GameLobby
        gameType="tic-tac-toe"
        initialGameState={() => ({ squares: Array(9).fill(null) })}
        onRoomReady={handleRoomReady}
      />
    )
  }

  // ---- Game phase ----
  const state = room.game_state as TicTacToeState
  const squares = state.squares
  const isPlayerA = room.player_a === playerId
  const myMark = isPlayerA ? 'X' : 'O'
  const isMyTurn = room.current_turn === playerId
  const winner = calculateWinner(squares)
  const isDraw = !winner && squares.every((s) => s !== null)
  const isGameOver = !!winner || isDraw

  // Determine winner identity
  let winnerPlayerId: string | null = null
  if (winner === 'X') winnerPlayerId = room.player_a
  if (winner === 'O') winnerPlayerId = room.player_b

  // Status text
  let statusText: string
  if (winner) {
    statusText = winnerPlayerId === playerId ? t('mp.youWin') : t('mp.opponentWins')
  } else if (isDraw) {
    statusText = t('mp.draw')
  } else if (isMyTurn) {
    statusText = t('mp.ttt.yourTurnMark', { mark: myMark })
  } else {
    statusText = t('mp.opponentsTurn')
  }

  async function handleClick(i: number) {
    if (!isMyTurn || squares[i] || isGameOver || !room) return

    const nextSquares = squares.slice()
    nextSquares[i] = myMark

    const nextWinner = calculateWinner(nextSquares)
    const nextIsDraw = !nextWinner && nextSquares.every((s) => s !== null)

    const nextTurn = nextWinner || nextIsDraw
      ? null
      : isPlayerA
        ? room.player_b
        : room.player_a

    const nextWinnerPlayer = nextWinner === 'X'
      ? room.player_a
      : nextWinner === 'O'
        ? room.player_b
        : null

    await updateGameState(
      room.id,
      { squares: nextSquares },
      nextTurn,
      nextWinnerPlayer,
      nextWinner || nextIsDraw ? 'finished' : undefined,
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx(
          'mb-4 rounded-lg px-4 py-2 text-lg font-medium',
          isGameOver
            ? winnerPlayerId === playerId
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : isDraw
                ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            : isMyTurn
              ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
        )}
      >
        {statusText}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className={clsx(
          'rounded-md px-3 py-1 text-sm font-medium',
          isPlayerA
            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
        )}>
          {t('mp.you')} {myMark}
        </div>
        <div className={clsx(
          'rounded-md px-3 py-1 text-sm font-medium',
          !isPlayerA
            ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
        )}>
          {t('mp.opponent')} {isPlayerA ? 'O' : 'X'}
        </div>
      </div>

      {[0, 1, 2].map((row) => (
        <div key={row} className="flex">
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col
            return (
              <Square
                key={i}
                value={squares[i]}
                onClick={() => handleClick(i)}
                disabled={!isMyTurn || !!squares[i] || isGameOver}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
