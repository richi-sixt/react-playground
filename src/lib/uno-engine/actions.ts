import type { CardColor, UNOCard, UNOGameState } from './types'
import { NUM_CARDS_PER_PLAYER } from './types'
import { getShuffledCardDeck, shuffle } from './deck'
import { canThrowCard, getCurrentPlayerId, getThrowableCards } from './helpers'

// ---- Internal helpers (pure, return new state) ----

/** Advance to the next player in the current direction. */
function nextPlayerIndex(state: UNOGameState): number {
  const len = state.playerOrder.length
  return (len + state.currentPlayerIndex + state.direction) % len
}

/** Draw `numCards` from the deck into a player's hand, reshuffling thrown cards if needed. */
function drawCards(
  state: UNOGameState,
  playerId: string,
  numCards: number,
): UNOGameState {
  let deck = [...state.cardDeck]
  let thrown = [...state.thrownCards]

  // Reshuffle if deck is too small
  if (deck.length < numCards) {
    deck = [...deck, ...shuffle([...thrown])]
    thrown = []
  }

  const drawn = deck.splice(-numCards, numCards)
  const hand = [...(state.playerHands[playerId] ?? []), ...drawn]

  return {
    ...state,
    cardDeck: deck,
    thrownCards: thrown,
    playerHands: { ...state.playerHands, [playerId]: hand },
    runningEvents: {
      ...state.runningEvents,
      vulnerableToUNO: null,
    },
  }
}

// ---- Public actions ----

/**
 * Initialize a new UNO game for the given players.
 * Deals 7 cards each and places the first card on the discard pile.
 */
export function initGame(playerIds: string[]): UNOGameState {
  const deck = getShuffledCardDeck()
  const playerHands: Record<string, UNOCard[]> = {}

  for (const id of playerIds) {
    playerHands[id] = deck.splice(0, NUM_CARDS_PER_PLAYER)
  }

  // Find first non-wild card for the initial discard
  let firstCardIndex = deck.findIndex((c) => c.type !== 'wild')
  if (firstCardIndex === -1) firstCardIndex = 0
  const [firstCard] = deck.splice(firstCardIndex, 1)

  return {
    cardDeck: deck,
    thrownCards: [],
    playerHands,
    playerOrder: playerIds,
    currentPlayerIndex: 0,
    lastThrownCard: firstCard,
    direction: 1,
    status: 'STARTED',
    runningEvents: {
      vulnerableToUNO: null,
      hasAnnouncedUNO: null,
    },
  }
}

/**
 * Play a card from the player's hand.
 * For wild cards, `chosenColor` must be provided.
 */
export function throwCard(
  state: UNOGameState,
  playerId: string,
  cardId: string,
  chosenColor?: CardColor,
): UNOGameState {
  if (!canThrowCard(state, playerId, cardId)) return state

  const hand = state.playerHands[playerId]
  const card = hand.find((c) => c.id === cardId)
  if (!card) return state

  // Remove card from hand
  const newHand = hand.filter((c) => c.id !== cardId)

  // Determine the effective card on the discard pile
  const effectiveCard: UNOCard =
    card.type === 'wild' && chosenColor
      ? { ...card, color: chosenColor }
      : card

  let newState: UNOGameState = {
    ...state,
    playerHands: { ...state.playerHands, [playerId]: newHand },
    thrownCards: [...state.thrownCards, card],
    lastThrownCard: effectiveCard,
    runningEvents: {
      vulnerableToUNO: null,
      hasAnnouncedUNO: null,
    },
  }

  // Check if player forgot to announce UNO (down to 1 card without announcing)
  if (newHand.length === 1 && state.runningEvents.hasAnnouncedUNO !== playerId) {
    newState = {
      ...newState,
      runningEvents: {
        ...newState.runningEvents,
        vulnerableToUNO: playerId,
      },
    }
  }

  // Check win condition
  if (newHand.length === 0) {
    return {
      ...newState,
      status: 'FINISHED',
      currentPlayerIndex: state.currentPlayerIndex,
    }
  }

  // Handle special / wild card effects
  newState = handleCardEffect(newState, card)

  // Advance to next player
  return {
    ...newState,
    currentPlayerIndex: nextPlayerIndex(newState),
  }
}

function handleCardEffect(state: UNOGameState, card: UNOCard): UNOGameState {
  const len = state.playerOrder.length
  const nextIdx = (len + state.currentPlayerIndex + state.direction) % len
  const nextPlayerId = state.playerOrder[nextIdx]

  switch (card.value) {
    case 'skip':
      // Skip = advance once extra (so nextPlayer() later skips them)
      return { ...state, currentPlayerIndex: nextPlayerIndex(state) }

    case 'reverse': {
      const newDirection = (state.direction * -1) as 1 | -1
      // In 2-player, reverse acts as skip
      if (len === 2) {
        return {
          ...state,
          direction: newDirection,
          currentPlayerIndex: nextPlayerIndex({ ...state, direction: newDirection }),
        }
      }
      return { ...state, direction: newDirection }
    }

    case 'draw2':
      return drawCards(state, nextPlayerId, 2)

    case 'draw4':
      return drawCards(state, nextPlayerId, 4)

    default:
      return state
  }
}

/**
 * Draw a card from the deck. If it's playable, auto-play it.
 * Otherwise advance to the next player.
 */
export function drawCardAction(
  state: UNOGameState,
  playerId: string,
): UNOGameState {
  if (getCurrentPlayerId(state) !== playerId) return state

  let newState = drawCards(state, playerId, 1)

  // Reset UNO state if player now has 2 cards (drew back up)
  const hand = newState.playerHands[playerId]
  if (hand.length === 2) {
    newState = {
      ...newState,
      runningEvents: { vulnerableToUNO: null, hasAnnouncedUNO: null },
    }
  }

  // Check if drawn card can be auto-played
  const drawnCard = hand[hand.length - 1]
  const throwable = getThrowableCards(newState, playerId)
  const canAutoPlay = throwable.some((c) => c.id === drawnCard.id)

  if (canAutoPlay && drawnCard.type !== 'wild') {
    // Auto-play non-wild drawn cards (wild needs color choice from UI)
    return throwCard(newState, playerId, drawnCard.id)
  }

  if (!canAutoPlay) {
    // Can't play — advance turn
    return {
      ...newState,
      currentPlayerIndex: nextPlayerIndex(newState),
    }
  }

  // Drew a playable wild card — return state and let UI handle color choice
  return newState
}

/**
 * Announce UNO. Player must have 1-2 cards and throwable cards if 2.
 */
export function announceUno(state: UNOGameState, playerId: string): UNOGameState {
  const hand = state.playerHands[playerId] ?? []
  const throwable = getThrowableCards(state, playerId)

  if (hand.length > 2 || (hand.length === 2 && throwable.length === 0)) {
    return state // Can't announce
  }

  return {
    ...state,
    runningEvents: {
      vulnerableToUNO: null,
      hasAnnouncedUNO: playerId,
    },
  }
}

/**
 * Challenge a player who forgot to announce UNO.
 * Penalizes the target with 2 extra cards.
 */
export function challengeUno(
  state: UNOGameState,
  _challengerId: string,
  targetId: string,
): UNOGameState {
  if (state.runningEvents.vulnerableToUNO !== targetId) {
    return state // Target is not vulnerable
  }

  return drawCards(state, targetId, 2)
}
