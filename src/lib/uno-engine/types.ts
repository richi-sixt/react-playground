// ---- Card types ----

export type CardType = 'number' | 'special' | 'wild'

export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild'

export type SpecialCardName = 'skip' | 'reverse' | 'draw2' | 'draw4' | 'colchange'

export type CardNumber = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type CardValue = SpecialCardName | CardNumber

export interface UNOCard {
  type: CardType
  color: CardColor
  value: CardValue
  id: string
}

// ---- Game state ----

export type GameStatus = 'WAITING' | 'STARTED' | 'FINISHED'

export interface UNOGameState {
  cardDeck: UNOCard[]
  thrownCards: UNOCard[]
  playerHands: Record<string, UNOCard[]>
  playerOrder: string[]
  currentPlayerIndex: number
  lastThrownCard: UNOCard | null
  direction: 1 | -1
  status: GameStatus
  runningEvents: {
    vulnerableToUNO: string | null
    hasAnnouncedUNO: string | null
  }
}

export const NUM_CARDS_PER_PLAYER = 7
