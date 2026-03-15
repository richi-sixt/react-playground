import { supabase } from './supabase'
import { type RealtimeChannel } from '@supabase/supabase-js'

// ---- Types ----

export interface Room {
  id: string
  code: string
  game_type: 'tic-tac-toe' | 'memory-game'
  status: 'waiting' | 'playing' | 'finished'
  player_a: string
  player_b: string | null
  game_state: TicTacToeState | MemoryGameState
  current_turn: string | null
  winner: string | null
  created_at: string
}

export interface TicTacToeState {
  squares: (string | null)[]
}

export interface MemoryGameState {
  cards: { id: number; imageId: number; imageSrc: string }[]
  flippedIndices: number[]
  matchedIndices: number[]
  scoreA: number
  scoreB: number
  moves: number
}

// ---- Room code generation ----

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// ---- Room CRUD ----

export async function createRoom(
  gameType: Room['game_type'],
  playerId: string,
  initialState: TicTacToeState | MemoryGameState,
): Promise<Room> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateRoomCode()
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        code,
        game_type: gameType,
        player_a: playerId,
        game_state: initialState,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505' && attempt < 2) continue
      throw error
    }
    return data as Room
  }
  throw new Error('Failed to generate unique room code')
}

export async function findRoomByCode(code: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select()
    .eq('code', code.toUpperCase())
    .single()

  if (error) return null
  return data as Room
}

export async function joinRoom(
  roomId: string,
  playerId: string,
  currentTurn: string,
): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .update({
      player_b: playerId,
      status: 'playing',
      current_turn: currentTurn,
    })
    .eq('id', roomId)
    .select()
    .single()

  if (error) throw error
  return data as Room
}

export async function updateGameState(
  roomId: string,
  gameState: TicTacToeState | MemoryGameState,
  currentTurn: string | null,
  winner: string | null = null,
  status?: Room['status'],
): Promise<void> {
  const update: Record<string, unknown> = {
    game_state: gameState,
    current_turn: currentTurn,
  }
  if (winner !== null) update.winner = winner
  if (status) update.status = status

  const { error } = await supabase
    .from('rooms')
    .update(update)
    .eq('id', roomId)

  if (error) throw error
}

// ---- Realtime subscription ----

export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: Room) => void,
): RealtimeChannel {
  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        onUpdate(payload.new as Room)
      },
    )
    .subscribe()

  return channel
}

export function unsubscribeFromRoom(channel: RealtimeChannel): void {
  supabase.removeChannel(channel)
}
