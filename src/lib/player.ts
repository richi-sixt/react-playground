import { nanoid } from 'nanoid'

const PLAYER_ID_KEY = 'multiplayer_player_id'

export function getPlayerId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(PLAYER_ID_KEY)
  if (!id) {
    id = nanoid(12)
    localStorage.setItem(PLAYER_ID_KEY, id)
  }
  return id
}
