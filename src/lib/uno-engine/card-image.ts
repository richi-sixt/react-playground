import type { UNOCard } from './types'

const COLOR_PREFIX: Record<string, string> = {
  red: 'r',
  blue: 'b',
  green: 'g',
  yellow: 'o',
}

/**
 * Returns the image filename for a given UNO card.
 * Files are located in /uno-cards/.
 */
export function getCardImageSrc(card: UNOCard): string {
  if (card.type === 'wild') {
    return card.value === 'draw4' ? '/uno-cards/P4.svg' : '/uno-cards/CC.svg'
  }

  const prefix = COLOR_PREFIX[card.color] ?? 'r'

  switch (card.value) {
    case 'skip':
      return `/uno-cards/${prefix}r.svg`
    case 'reverse':
      return `/uno-cards/${prefix}x.svg`
    case 'draw2':
      return `/uno-cards/${prefix}p2.svg`
    default:
      return `/uno-cards/${prefix}${card.value}.svg`
  }
}

export const CARD_BACK_SRC = '/uno-cards/back.jpeg'

/** Returns a Tailwind-compatible color for the UNO card color. */
export function getCardColorClass(color: string): string {
  switch (color) {
    case 'red':
      return 'bg-red-500'
    case 'blue':
      return 'bg-blue-500'
    case 'green':
      return 'bg-green-500'
    case 'yellow':
      return 'bg-yellow-400'
    default:
      return 'bg-zinc-600'
  }
}
