import type {
  CardColor,
  CardNumber,
  CardType,
  CardValue,
  SpecialCardName,
  UNOCard,
} from './types'

const COLORS: CardColor[] = ['red', 'yellow', 'green', 'blue', 'wild']
const NUM_VALUES: CardNumber[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const SPECIAL_VALUES: SpecialCardName[] = ['skip', 'reverse', 'draw2']
const WILD_VALUES: SpecialCardName[] = ['colchange', 'draw4']

function makeCard(
  type: CardType,
  color: CardColor,
  value: CardValue,
  counter: Record<string, number>,
): UNOCard {
  const baseId = `card-${type}-${color}-${value}`
  counter[baseId] = (counter[baseId] ?? 0) + 1
  return { type, color, value, id: `${baseId}-${counter[baseId]}` }
}

/** Fisher-Yates shuffle (in-place). */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Creates a standard 108-card UNO deck, shuffled.
 *
 * Per color (red, yellow, green, blue):
 *   - One '0', two each of '1'–'9' = 19 number cards
 *   - Two each of skip, reverse, draw2 = 6 special cards
 *   → 25 cards × 4 colors = 100
 *
 * Wild cards: 4 colchange + 4 draw4 = 8
 * Total: 108
 */
export function getShuffledCardDeck(): UNOCard[] {
  const deck: UNOCard[] = []
  const counter: Record<string, number> = {}

  for (const color of COLORS) {
    if (color === 'wild') {
      for (const value of WILD_VALUES) {
        for (let i = 0; i < 4; i++) {
          deck.push(makeCard('wild', color, value, counter))
        }
      }
    } else {
      for (const value of NUM_VALUES) {
        deck.push(makeCard('number', color, value, counter))
        if (value !== '0') {
          deck.push(makeCard('number', color, value, counter))
        }
      }
      for (const value of SPECIAL_VALUES) {
        deck.push(makeCard('special', color, value, counter))
        deck.push(makeCard('special', color, value, counter))
      }
    }
  }

  shuffle(deck)
  return deck
}
