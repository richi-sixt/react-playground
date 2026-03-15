'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { GameLobby } from './GameLobby'
import {
  subscribeToRoom,
  unsubscribeFromRoom,
  updateGameState,
  type Room,
  type MemoryGameState,
} from '@/lib/multiplayer'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ---- Card images (same as solo game) ----

const CARD_IMAGES = [
  '/images/memory-game/star.svg',
  '/images/memory-game/heart.svg',
  '/images/memory-game/diamond.svg',
  '/images/memory-game/circle.svg',
  '/images/memory-game/triangle.svg',
  '/images/memory-game/hexagon.svg',
]

function createShuffledDeck(): MemoryGameState['cards'] {
  const cards = CARD_IMAGES.flatMap((src, imageId) => [
    { id: imageId * 2, imageId, imageSrc: src },
    { id: imageId * 2 + 1, imageId, imageSrc: src },
  ])
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

function createInitialMemoryState(): MemoryGameState {
  return {
    cards: createShuffledDeck(),
    flippedIndices: [],
    matchedIndices: [],
    scoreA: 0,
    scoreB: 0,
    moves: 0,
  }
}

// ---- Main component ----

export function MultiplayerMemoryGame() {
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId, setPlayerId] = useState<string>('')
  const channelRef = useRef<RealtimeChannel | null>(null)
  const mismatchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleRoomUpdate = useCallback(
    (updatedRoom: Room) => {
      setRoom(updatedRoom)
    },
    [],
  )

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

  // Cleanup mismatch timeout
  useEffect(() => {
    return () => {
      if (mismatchTimeoutRef.current) {
        clearTimeout(mismatchTimeoutRef.current)
      }
    }
  }, [])

  function handleRoomReady(readyRoom: Room, pid: string) {
    setRoom(readyRoom)
    setPlayerId(pid)
  }

  // ---- Lobby phase ----
  if (!room || room.status === 'waiting') {
    return (
      <GameLobby
        gameType="memory-game"
        initialGameState={createInitialMemoryState}
        onRoomReady={handleRoomReady}
      />
    )
  }

  // ---- Game phase ----
  const state = room.game_state as MemoryGameState
  const { cards, flippedIndices, matchedIndices, scoreA, scoreB, moves } = state
  const isPlayerA = room.player_a === playerId
  const isMyTurn = room.current_turn === playerId
  const totalPairs = cards.length / 2
  const isGameOver = matchedIndices.length === cards.length

  // current_turn === null means we're in a mismatch reveal phase (both locked)
  const isMismatchPhase = room.current_turn === null && !isGameOver && room.status === 'playing'

  // Determine winner
  let resultText: string | null = null
  if (isGameOver) {
    const myScore = isPlayerA ? scoreA : scoreB
    const opponentScore = isPlayerA ? scoreB : scoreA
    if (myScore > opponentScore) resultText = 'Du gewinnst! 🎉'
    else if (myScore < opponentScore) resultText = 'Gegner gewinnt!'
    else resultText = 'Unentschieden!'
  }

  // Status text
  let statusText: string
  if (isGameOver) {
    statusText = resultText!
  } else if (isMismatchPhase) {
    statusText = 'Kein Paar…'
  } else if (isMyTurn) {
    statusText = 'Dein Zug'
  } else {
    statusText = 'Gegner ist dran…'
  }

  async function handleCardClick(index: number) {
    if (!room || !isMyTurn || isGameOver) return
    if (flippedIndices.includes(index) || matchedIndices.includes(index)) return
    if (flippedIndices.length >= 2) return

    const newFlipped = [...flippedIndices, index]

    if (newFlipped.length === 1) {
      // First card flipped — stay on same player
      await updateGameState(
        room.id,
        { ...state, flippedIndices: newFlipped, moves: moves + 1 },
        playerId,
      )
    } else if (newFlipped.length === 2) {
      // Second card flipped — check for match
      const [first, second] = newFlipped
      const isMatch = cards[first].imageId === cards[second].imageId

      if (isMatch) {
        // Match! Player stays on turn, score increases
        const newMatched = [...matchedIndices, first, second]
        const newScoreA = isPlayerA ? scoreA + 1 : scoreA
        const newScoreB = !isPlayerA ? scoreB + 1 : scoreB
        const allMatched = newMatched.length === cards.length

        await updateGameState(
          room.id,
          {
            ...state,
            flippedIndices: [],
            matchedIndices: newMatched,
            scoreA: newScoreA,
            scoreB: newScoreB,
            moves: moves + 1,
          },
          allMatched ? null : playerId,
          allMatched
            ? newScoreA > newScoreB
              ? room.player_a
              : newScoreB > newScoreA
                ? room.player_b
                : 'draw'
            : null,
          allMatched ? 'finished' : undefined,
        )
      } else {
        // Mismatch — show both cards, lock turn (current_turn = null)
        await updateGameState(
          room.id,
          { ...state, flippedIndices: newFlipped, moves: moves + 1 },
          null, // lock both players
        )

        // Only the active player runs the timeout to flip back
        mismatchTimeoutRef.current = setTimeout(async () => {
          const opponentId = isPlayerA ? room.player_b : room.player_a
          await updateGameState(
            room.id,
            { ...state, flippedIndices: [], moves: moves + 1 },
            opponentId, // switch turn to opponent
          )
        }, 1500)
      }
    }
  }

  const myScore = isPlayerA ? scoreA : scoreB
  const opponentScore = isPlayerA ? scoreB : scoreA

  return (
    <div className="flex flex-col items-center">
      {/* Score & status */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div
          className={clsx(
            'rounded-md px-3 py-1 text-sm font-medium',
            isMyTurn
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
          )}
        >
          Du: {myScore}
        </div>
        <div
          className={clsx(
            'rounded-md px-3 py-1 text-sm font-medium',
            !isMyTurn && !isMismatchPhase && !isGameOver
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
          )}
        >
          Gegner: {opponentScore}
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Züge: {moves} | Paare: {matchedIndices.length / 2}/{totalPairs}
        </div>
      </div>

      <div
        className={clsx(
          'mb-6 rounded-lg px-4 py-2 text-base font-medium',
          isGameOver
            ? resultText?.includes('gewinnst')
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : resultText === 'Unentschieden!'
                ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            : isMismatchPhase
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
              : isMyTurn
                ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
        )}
      >
        {statusText}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index)
          const isMatched = matchedIndices.includes(index)
          const showFace = isFlipped || isMatched

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={clsx(
                'h-24 w-20 sm:h-32 sm:w-28 [perspective:1000px]',
                isMyTurn && !isFlipped && !isMatched && !isGameOver
                  ? 'cursor-pointer'
                  : 'cursor-default',
              )}
            >
              <div
                className={clsx(
                  'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
                  showFace && '[transform:rotateY(180deg)]',
                )}
              >
                {/* Back face — visible when card is face-down */}
                <div
                  className={clsx(
                    'absolute inset-0 flex items-center justify-center rounded-xl',
                    'bg-violet-500 text-3xl font-bold text-white [backface-visibility:hidden]',
                    'transition-colors',
                    isMyTurn && !isGameOver
                      ? 'hover:bg-violet-400 dark:bg-violet-600 dark:hover:bg-violet-500'
                      : 'dark:bg-violet-600',
                    isMatched && 'ring-2 ring-green-400 dark:ring-green-500',
                  )}
                >
                  ?
                </div>
                {/* Front face — visible when card is flipped */}
                <div
                  className={clsx(
                    'absolute inset-0 flex items-center justify-center rounded-xl',
                    'border border-zinc-200 bg-white p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]',
                    'dark:border-zinc-700 dark:bg-zinc-800',
                    isMatched && 'ring-2 ring-green-400 dark:ring-green-500',
                  )}
                >
                  <img
                    src={card.imageSrc}
                    alt="card"
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
