'use client'

import { useState } from 'react'
import { getPlayerId } from '@/lib/player'
import {
  createRoom,
  findRoomByCode,
  joinRoom,
  type Room,
  type TicTacToeState,
  type MemoryGameState,
} from '@/lib/multiplayer'
import { WaitingRoom } from './WaitingRoom'

interface GameLobbyProps {
  gameType: Room['game_type']
  initialGameState: () => TicTacToeState | MemoryGameState
  onRoomReady: (room: Room, playerId: string) => void
}

type LobbyMode = 'choice' | 'join' | 'waiting'

export function GameLobby({
  gameType,
  initialGameState,
  onRoomReady,
}: GameLobbyProps) {
  const [mode, setMode] = useState<LobbyMode>('choice')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [waitingRoom, setWaitingRoom] = useState<Room | null>(null)
  const [playerId] = useState(() => getPlayerId())

  async function handleCreateRoom() {
    setIsLoading(true)
    setError(null)
    try {
      const room = await createRoom(gameType, playerId, initialGameState())
      setWaitingRoom(room)
      setMode('waiting')
    } catch (err) {
      setError('Room could not be created. Please try again.')
      console.error('Create room error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleJoinRoom() {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code.')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const room = await findRoomByCode(code)
      if (!room) {
        setError('Room not found. Check the code.')
        setIsLoading(false)
        return
      }
      if (room.game_type !== gameType) {
        setError('This room is for a different game.')
        setIsLoading(false)
        return
      }
      if (room.status !== 'waiting') {
        setError('This room is already full or the game has started.')
        setIsLoading(false)
        return
      }

      // Player A starts (for tic-tac-toe it's X)
      const updatedRoom = await joinRoom(room.id, playerId, room.player_a)
      onRoomReady(updatedRoom, playerId)
    } catch (err) {
      setError('Failed to join. Please try again.')
      console.error('Join room error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleRoomReady(updatedRoom: Room) {
    onRoomReady(updatedRoom, playerId)
  }

  if (mode === 'waiting' && waitingRoom) {
    return (
      <WaitingRoom
        room={waitingRoom}
        playerId={playerId}
        onRoomReady={handleRoomReady}
      />
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        {mode === 'choice' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-center text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Multiplayer
            </h2>
            <button
              onClick={handleCreateRoom}
              disabled={isLoading}
              className="rounded-lg bg-violet-500 px-6 py-3 text-base font-medium text-white transition hover:bg-violet-400 disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-500"
            >
              {isLoading ? 'Creating…' : 'New Room'}
            </button>
            <button
              onClick={() => {
                setMode('join')
                setError(null)
              }}
              className="rounded-lg bg-zinc-100 px-6 py-3 text-base font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              Join room
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-center text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Join room
            </h2>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().slice(0, 6))
                setError(null)
              }}
              placeholder="Join room"
              maxLength={6}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.2em] text-zinc-900 placeholder:text-zinc-400 placeholder:tracking-normal placeholder:text-base placeholder:font-normal focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              autoFocus
            />
            <button
              onClick={handleJoinRoom}
              disabled={isLoading || code.length !== 6}
              className="rounded-lg bg-violet-500 px-6 py-3 text-base font-medium text-white transition hover:bg-violet-400 disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-500"
            >
              {isLoading ? 'Joining…' : 'Join'}
            </button>
            <button
              onClick={() => {
                setMode('choice')
                setCode('')
                setError(null)
              }}
              className="text-sm text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              ← Back
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
