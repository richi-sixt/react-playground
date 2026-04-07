import type { UNOCard, UNOGameState } from './types'

/** Returns the player ID whose turn it is. */
export function getCurrentPlayerId(state: UNOGameState): string {
  return state.playerOrder[state.currentPlayerIndex]
}

/** Returns the cards a player is allowed to throw. */
export function getThrowableCards(state: UNOGameState, playerId: string): UNOCard[] {
  const hand = state.playerHands[playerId] ?? []
  const { lastThrownCard } = state

  return hand.filter(
    (card) =>
      !lastThrownCard ||
      card.color === lastThrownCard.color ||
      card.value === lastThrownCard.value ||
      card.type === 'wild',
  )
}

/** Checks whether a specific card can be thrown by the current player. */
export function canThrowCard(
  state: UNOGameState,
  playerId: string,
  cardId: string,
): boolean {
  if (getCurrentPlayerId(state) !== playerId) return false
  const throwable = getThrowableCards(state, playerId)
  return throwable.some((c) => c.id === cardId)
}
