'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { useTranslation } from '@/i18n'
import { GameLobby } from './GameLobby'
import { MemoryCardFace } from '../games/MemoryCardFace'
import { MemorySettings } from '../games/MemorySettings'
import {
  subscribeToRoom,
  unsubscribeFromRoom,
  updateGameState,
  type Room,
  type MemoryGameState,
} from '@/lib/multiplayer'
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_THEME,
  getGridSizeById,
  getThemeById,
  getItemsForGrid,
  getCardSizeClasses,
  getEmojiSizeClasses,
} from '@/lib/memory-config'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ---- Deck creation ----

function createShuffledDeck(
  themeId: string,
  gridSizeId: string,
): MemoryGameState['cards'] {
  const theme = getThemeById(themeId)
  const gridSize = getGridSizeById(gridSizeId)
  const items = getItemsForGrid(theme, gridSize.pairs)
  const cards = items.flatMap((item, idx) => [
    { id: idx * 2, itemId: item.id, type: item.type, content: item.content },
    { id: idx * 2 + 1, itemId: item.id, type: item.type, content: item.content },
  ])
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

function createInitialMemoryState(
  themeId: string,
  gridSizeId: string,
): MemoryGameState {
  return {
    gridSizeId,
    themeId,
    cards: createShuffledDeck(themeId, gridSizeId),
    flippedIndices: [],
    matchedIndices: [],
    scoreA: 0,
    scoreB: 0,
    moves: 0,
  }
}

// ---- Main component ----

export function MultiplayerMemoryGame() {
  const { t } = useTranslation()
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId, setPlayerId] = useState<string>('')
  const [gridSizeId, setGridSizeId] = useState(DEFAULT_GRID_SIZE.id)
  const [themeId, setThemeId] = useState(DEFAULT_THEME.id)
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
      <>
        <MemorySettings
          gridSizeId={gridSizeId}
          themeId={themeId}
          onGridSizeChange={setGridSizeId}
          onThemeChange={setThemeId}
        />
        <GameLobby
          gameType="memory-game"
          initialGameState={() => createInitialMemoryState(themeId, gridSizeId)}
          onRoomReady={handleRoomReady}
        />
      </>
    )
  }

  // ---- Game phase ----
  const state = room.game_state as MemoryGameState
  const { cards, flippedIndices, matchedIndices, scoreA, scoreB, moves } = state

  // Read grid/theme from game state (synced between players), with backward compat
  const gameGridSizeId = state.gridSizeId ?? '4x3'
  const gameThemeId = state.themeId ?? 'shapes'
  const gameGridSize = getGridSizeById(gameGridSizeId)
  const cardSizeClasses = getCardSizeClasses(gameGridSize)
  const emojiSizeClasses = getEmojiSizeClasses(gameGridSize)

  const isPlayerA = room.player_a === playerId
  const isMyTurn = room.current_turn === playerId
  const totalPairs = cards.length / 2
  const isGameOver = matchedIndices.length === cards.length

  // current_turn === null means we're in a mismatch reveal phase (both locked)
  const isMismatchPhase = room.current_turn === null && !isGameOver && room.status === 'playing'

  // Determine winner
  const myScore = isPlayerA ? scoreA : scoreB
  const opponentScore = isPlayerA ? scoreB : scoreA
  let result: 'win' | 'lose' | 'draw' | null = null
  if (isGameOver) {
    if (myScore > opponentScore) result = 'win'
    else if (myScore < opponentScore) result = 'lose'
    else result = 'draw'
  }

  // Status text
  let statusText: string
  if (isGameOver) {
    statusText =
      result === 'win'
        ? t('mp.youWin')
        : result === 'lose'
          ? t('mp.opponentWins')
          : t('mp.draw')
  } else if (isMismatchPhase) {
    statusText = t('mp.memory.noMatch')
  } else if (isMyTurn) {
    statusText = t('mp.yourTurn')
  } else {
    statusText = t('mp.opponentsTurn')
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
      const isMatch = cards[first].itemId === cards[second].itemId

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
          {t('mp.you')} {myScore}
        </div>
        <div
          className={clsx(
            'rounded-md px-3 py-1 text-sm font-medium',
            !isMyTurn && !isMismatchPhase && !isGameOver
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
          )}
        >
          {t('mp.opponent')} {opponentScore}
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {t('mp.memory.moves', { count: moves })} | {t('mp.memory.pairs', { matched: matchedIndices.length / 2, total: totalPairs })}
        </div>
      </div>

      <div
        className={clsx(
          'mb-6 rounded-lg px-4 py-2 text-base font-medium',
          isGameOver
            ? result === 'win'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : result === 'draw'
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
                cardSizeClasses,
                '[perspective:1000px]',
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
                <MemoryCardFace
                  type={card.type}
                  content={card.content}
                  isMatched={isMatched}
                  emojiSizeClasses={emojiSizeClasses}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
