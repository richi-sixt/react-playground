'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { useTranslation } from '@/i18n'
import { GameLobby } from './GameLobby'
import { WaitingRoom } from './WaitingRoom'
import {
  subscribeToRoom,
  unsubscribeFromRoom,
  updateGameState,
  startRoom,
  type Room,
} from '@/lib/multiplayer'
import {
  initGame,
  throwCard,
  drawCardAction,
  announceUno,
  challengeUno,
  getCurrentPlayerId,
  getThrowableCards,
  getCardImageSrc,
  CARD_BACK_SRC,
  type UNOGameState,
  type CardColor,
} from '@/lib/uno-engine'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ---- Color picker for wild cards ----

const WILD_COLORS: { color: CardColor; bg: string; ring: string }[] = [
  { color: 'red', bg: 'bg-red-500', ring: 'ring-red-400' },
  { color: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-400' },
  { color: 'green', bg: 'bg-green-500', ring: 'ring-green-400' },
  { color: 'yellow', bg: 'bg-yellow-400', ring: 'ring-yellow-300' },
]

function ColorPicker({
  onSelect,
  onCancel,
}: {
  onSelect: (color: CardColor) => void
  onCancel: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-4 text-center text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          {t('uno.chooseColor')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {WILD_COLORS.map(({ color, bg }) => (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={clsx(
                bg,
                'h-16 w-16 rounded-xl transition hover:scale-110 hover:shadow-lg',
              )}
              aria-label={color}
            />
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-4 w-full text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          {t('mp.back')}
        </button>
      </div>
    </div>
  )
}

// ---- Direction indicator ----

function DirectionIndicator({ direction }: { direction: 1 | -1 }) {
  return (
    <span className="text-xl" aria-label={direction === 1 ? 'clockwise' : 'counter-clockwise'}>
      {direction === 1 ? '↻' : '↺'}
    </span>
  )
}

// ---- Main component ----

export function MultiplayerUno() {
  const { t } = useTranslation()
  const [room, setRoom] = useState<Room | null>(null)
  const [playerId, setPlayerId] = useState<string>('')
  const [pendingWildCardId, setPendingWildCardId] = useState<string | null>(null)
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

  /** Apply a new game state: update UI immediately, then persist to Supabase. */
  async function applyNewState(newState: UNOGameState) {
    if (!room) return

    const nextTurn = newState.status === 'FINISHED' ? null : getCurrentPlayerId(newState)
    const winnerId = newState.status === 'FINISHED'
      ? newState.playerOrder.find((pid) => (newState.playerHands[pid]?.length ?? 0) === 0) ?? null
      : null

    // Optimistic local update — UI responds instantly
    setRoom({
      ...room,
      game_state: newState,
      current_turn: nextTurn,
      winner: winnerId,
      status: newState.status === 'FINISHED' ? 'finished' : room.status,
    })

    // Persist to Supabase (other players receive via Realtime subscription)
    try {
      await updateGameState(
        room.id,
        newState,
        nextTurn,
        winnerId,
        newState.status === 'FINISHED' ? 'finished' : undefined,
      )
    } catch (err) {
      console.error('[UNO] updateGameState failed:', err)
    }
  }

  async function handleStartGame(currentRoom: Room) {
    const gameState = initGame(currentRoom.players)
    const started = await startRoom(
      currentRoom.id,
      gameState,
      currentRoom.players[0],
    )
    setRoom(started)
  }

  // ---- Lobby phase (no room yet) ----
  if (!room) {
    return (
      <GameLobby
        gameType="uno"
        maxPlayers={4}
        initialGameState={() => ({} as UNOGameState)}
        onRoomReady={handleRoomReady}
      />
    )
  }

  // ---- Waiting phase (room exists, waiting for more players / host to start) ----
  if (room.status === 'waiting') {
    return (
      <WaitingRoom
        room={room}
        playerId={playerId}
        onRoomReady={(r) => setRoom(r)}
        onStartGame={handleStartGame}
      />
    )
  }

  // ---- Game phase ----
  const state = room.game_state as UNOGameState
  if (!state || !state.playerOrder) {
    return (
      <div className="text-center text-zinc-500 dark:text-zinc-400">
        {t('mp.waitingForPlayers')}
      </div>
    )
  }

  const currentTurnId = getCurrentPlayerId(state)
  const isMyTurn = currentTurnId === playerId
  const isGameOver = state.status === 'FINISHED'
  const myHand = state.playerHands[playerId] ?? []
  const throwable = isMyTurn ? getThrowableCards(state, playerId) : []
  const throwableIds = new Set(throwable.map((c) => c.id))
  const names = room.player_names ?? {}

  /** Resolve a player ID to their display name, falling back to P1/P2/… */
  function displayName(pid: string): string {
    return names[pid] || `P${state.playerOrder.indexOf(pid) + 1}`
  }

  // Opponents (everyone except me, in order)
  const myIndex = state.playerOrder.indexOf(playerId)
  const opponents = state.playerOrder
    .map((pid, i) => ({ pid, index: i }))
    .filter(({ pid }) => pid !== playerId)

  // Find winner
  const winnerId = isGameOver
    ? state.playerOrder.find((pid) => (state.playerHands[pid]?.length ?? 0) === 0) ?? null
    : null

  // Can announce UNO?
  const canAnnounce =
    !isGameOver &&
    (myHand.length === 1 || (myHand.length === 2 && throwable.length > 0)) &&
    state.runningEvents.hasAnnouncedUNO !== playerId

  // Can challenge someone?
  const vulnerablePlayer = state.runningEvents.vulnerableToUNO
  const canChallenge = !isGameOver && vulnerablePlayer !== null && vulnerablePlayer !== playerId

  // Status text
  let statusText: string
  if (isGameOver) {
    statusText = winnerId === playerId ? t('uno.youWin') : t('uno.playerWins', { name: displayName(winnerId!) })
  } else if (isMyTurn) {
    statusText = t('uno.yourTurn')
  } else {
    statusText = t('uno.opponentsTurn', { name: displayName(currentTurnId) })
  }

  // ---- Handlers ----

  async function handleCardClick(cardId: string) {
    if (!isMyTurn || isGameOver || !room) return
    if (!throwableIds.has(cardId)) return

    const card = myHand.find((c) => c.id === cardId)
    if (!card) return

    // Wild card → show color picker
    if (card.type === 'wild') {
      setPendingWildCardId(cardId)
      return
    }

    const newState = throwCard(state, playerId, cardId)
    if (newState === state) return

    await applyNewState(newState)
  }

  async function handleWildColorSelect(color: CardColor) {
    if (!pendingWildCardId || !room) return

    const newState = throwCard(state, playerId, pendingWildCardId, color)
    setPendingWildCardId(null)
    if (newState === state) return

    await applyNewState(newState)
  }

  async function handleDraw() {
    if (!isMyTurn || isGameOver || !room) return

    const newState = drawCardAction(state, playerId)
    await applyNewState(newState)
  }

  async function handleAnnounceUno() {
    if (!room) return
    const newState = announceUno(state, playerId)
    await updateGameState(room.id, newState, room.current_turn)
  }

  async function handleChallengeUno() {
    if (!room || !vulnerablePlayer) return
    const newState = challengeUno(state, playerId, vulnerablePlayer)
    await updateGameState(room.id, newState, room.current_turn)
  }

  // ---- Color indicator for last thrown card ----
  const lastCardColor = state.lastThrownCard?.color ?? 'wild'
  const colorBorderClass =
    lastCardColor === 'red'
      ? 'ring-red-500'
      : lastCardColor === 'blue'
        ? 'ring-blue-500'
        : lastCardColor === 'green'
          ? 'ring-green-500'
          : lastCardColor === 'yellow'
            ? 'ring-yellow-400'
            : 'ring-zinc-400'

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wild card color picker overlay */}
      {pendingWildCardId && (
        <ColorPicker
          onSelect={handleWildColorSelect}
          onCancel={() => setPendingWildCardId(null)}
        />
      )}

      {/* Status bar */}
      <div
        className={clsx(
          'rounded-lg px-4 py-2 text-lg font-medium',
          isGameOver
            ? winnerId === playerId
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            : isMyTurn
              ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
        )}
      >
        {statusText}
      </div>

      {/* Opponents */}
      <div className="flex flex-wrap justify-center gap-4">
        {opponents.map(({ pid, index }) => {
          const hand = state.playerHands[pid] ?? []
          const isTurn = currentTurnId === pid
          return (
            <div
              key={pid}
              className={clsx(
                'flex flex-col items-center gap-1 rounded-xl border px-4 py-3 transition',
                isTurn
                  ? 'border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-900/20'
                  : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50',
              )}
            >
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {displayName(pid)}
                {pid === room.host_player && ' ★'}
              </span>
              <div className="flex -space-x-3">
                {hand.slice(0, 7).map((_, i) => (
                  <Image
                    key={i}
                    src={CARD_BACK_SRC}
                    alt="card"
                    width={28}
                    height={40}
                    className="rounded-sm border border-zinc-300 dark:border-zinc-600"
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {t('uno.cardsLeft', { count: hand.length })}
              </span>
            </div>
          )
        })}
      </div>

      {/* Center: discard pile + draw pile + direction */}
      <div className="flex items-center gap-6">
        {/* Draw pile */}
        <button
          onClick={handleDraw}
          disabled={!isMyTurn || isGameOver}
          className={clsx(
            'rounded-lg transition',
            isMyTurn && !isGameOver
              ? 'cursor-pointer hover:scale-105 hover:shadow-lg'
              : 'cursor-not-allowed opacity-60',
          )}
          aria-label={t('uno.drawCard')}
        >
          <Image
            src={CARD_BACK_SRC}
            alt="Draw pile"
            width={80}
            height={120}
            className="rounded-lg border-2 border-zinc-300 dark:border-zinc-600"
          />
          <span className="mt-1 block text-center text-xs text-zinc-500 dark:text-zinc-400">
            {t('uno.drawCard')}
          </span>
        </button>

        {/* Discard pile */}
        <div className="flex flex-col items-center">
          {state.lastThrownCard ? (
            <Image
              src={getCardImageSrc(state.lastThrownCard)}
              alt="Last played card"
              width={80}
              height={120}
              className={clsx('rounded-lg ring-4', colorBorderClass)}
            />
          ) : (
            <div className="flex h-[120px] w-[80px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600">
              <span className="text-zinc-400">?</span>
            </div>
          )}
        </div>

        {/* Direction indicator */}
        <div className="flex flex-col items-center gap-1">
          <DirectionIndicator direction={state.direction} />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {state.direction === 1
              ? t('uno.direction.clockwise')
              : t('uno.direction.counterclockwise')}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {canAnnounce && (
          <button
            onClick={handleAnnounceUno}
            className="animate-pulse rounded-lg bg-purple-600 px-5 py-2.5 text-base font-bold text-white shadow-lg transition hover:bg-purple-500 hover:shadow-xl"
          >
            {t('uno.announceUno')}
          </button>
        )}
        {canChallenge && (
          <button
            onClick={handleChallengeUno}
            className="rounded-lg bg-red-500 px-5 py-2.5 text-base font-bold text-white shadow-lg transition hover:bg-red-400 hover:shadow-xl"
          >
            {t('uno.challengeUno')}
          </button>
        )}
      </div>

      {/* My hand */}
      <div className="w-full max-w-2xl">
        <div className="mb-2 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {displayName(playerId)} ({t('mp.you').replace(':', '')}) — {t('uno.cardsLeft', { count: myHand.length })}
        </div>
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {myHand.map((card) => {
            const isPlayable = isMyTurn && throwableIds.has(card.id)
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={!isPlayable || isGameOver}
                className={clsx(
                  'rounded-lg transition-all',
                  isPlayable
                    ? 'cursor-pointer ring-2 ring-violet-400 hover:-translate-y-2 hover:scale-105 hover:shadow-lg dark:ring-violet-500'
                    : 'cursor-default opacity-70',
                  isGameOver && 'opacity-50',
                )}
              >
                <Image
                  src={getCardImageSrc(card)}
                  alt={`${card.color} ${card.value}`}
                  width={64}
                  height={96}
                  className="rounded-lg"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
