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
}

export function WaitingRoom({ room, playerId, onRoomReady }: WaitingRoomProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    channelRef.current = subscribeToRoom(room.id, (updatedRoom) => {
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
      await navigator.clipboard.writeText(room.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select text for manual copy
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="text-center text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          {t('mp.shareCode')}
        </h2>

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="rounded-xl bg-zinc-100 px-6 py-4 font-mono text-4xl font-bold tracking-[0.3em] text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100">
            {room.code}
          </div>
          <button
            onClick={handleCopy}
            className="rounded-lg bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400 dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            {copied ? t('mp.copied') : t('mp.copy')}
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-500" />
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {t('mp.waitingForPlayer')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
