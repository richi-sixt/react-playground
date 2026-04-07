import { nanoid } from 'nanoid'

const PLAYER_ID_KEY = 'multiplayer_player_id'
const PLAYER_NAME_KEY = 'multiplayer_player_name'

export function getPlayerId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(PLAYER_ID_KEY)
  if (!id) {
    id = nanoid(12)
    localStorage.setItem(PLAYER_ID_KEY, id)
  }
  return id
}

export function getPlayerName(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(PLAYER_NAME_KEY) ?? ''
}

export function setPlayerName(name: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PLAYER_NAME_KEY, name)
}
