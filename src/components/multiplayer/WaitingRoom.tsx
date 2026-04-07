'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/i18n'
import {
  subscribeToRoom,
  unsubscribeFromRoom,
  type Room,
} from '@/lib/multiplayer'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface WaitingRoomProps {
  room: Room
  playerId: string
  onRoomReady: (room: Room) => void
  onStartGame?: (room: Room) => void
}

export function WaitingRoom({ room, playerId, onRoomReady, onStartGame }: WaitingRoomProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(room)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const isHost = currentRoom.host_player === playerId
  const playerCount = currentRoom.players.length
  const maxPlayers = currentRoom.max_players
  const isMultiPlayer = maxPlayers > 2
  const canStart = isHost && playerCount >= 2

  useEffect(() => {
    channelRef.current = subscribeToRoom(room.id, (updatedRoom) => {
      setCurrentRoom(updatedRoom)
      if (updatedRoom.status === 'playing') {
        onRoomReady(updatedRoom)
      }
    })

    return () => {
      if (channelRef.current) {
        unsubscribeFromRoom(channelRef.current)
      }
    }
  }, [room.id, onRoomReady])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(currentRoom.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select text for manual copy
    }
  }

  function handleStart() {
    if (canStart && onStartGame) {
      onStartGame(currentRoom)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="text-center text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          {isMultiPlayer
            ? t('mp.shareCodePlayers')
            : t('mp.shareCode')}
        </h2>

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="rounded-xl bg-zinc-100 px-6 py-4 font-mono text-4xl font-bold tracking-[0.3em] text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100">
            {currentRoom.code}
          </div>
          <button
            onClick={handleCopy}
            className="rounded-lg bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400 dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            {copied ? t('mp.copied') : t('mp.copy')}
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Player count */}
          {isMultiPlayer && (
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('mp.playerCount', { current: playerCount, max: maxPlayers })}
            </div>
          )}

          {/* Player list for multi-player */}
          {isMultiPlayer && (
            <div className="flex flex-wrap justify-center gap-2">
              {currentRoom.players.map((pid, i) => {
                const pName = currentRoom.player_names?.[pid]
                const label = pName || `P${i + 1}`
                return (
                  <span
                    key={pid}
                    className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                  >
                    {pid === playerId ? `${label} (${t('mp.you').replace(':', '')})` : label}
                  </span>
                )
              })}
            </div>
          )}

          {/* Start button for host (multi-player only) */}
          {isMultiPlayer && isHost && (
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="mt-2 rounded-lg bg-green-500 px-6 py-3 text-base font-medium text-white transition hover:bg-green-400 disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-500"
            >
              {t('mp.startGame')}
            </button>
          )}

          {/* Waiting indicator */}
          {(!isMultiPlayer || !canStart || !isHost) && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-500" />
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {isMultiPlayer
                  ? t('mp.waitingForPlayers')
                  : t('mp.waitingForPlayer')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
