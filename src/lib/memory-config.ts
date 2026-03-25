// ---- Grid sizes ----

export interface GridSize {
  id: string
  rows: number
  cols: number
  pairs: number
  labelKey: string
}

export const GRID_SIZES: GridSize[] = [
  { id: '4x3', rows: 3, cols: 4, pairs: 6, labelKey: 'memory.grid.4x3' },
  { id: '4x4', rows: 4, cols: 4, pairs: 8, labelKey: 'memory.grid.4x4' },
  { id: '4x5', rows: 5, cols: 4, pairs: 10, labelKey: 'memory.grid.4x5' },
  { id: '4x6', rows: 6, cols: 4, pairs: 12, labelKey: 'memory.grid.4x6' },
]

export const DEFAULT_GRID_SIZE = GRID_SIZES[0]

// ---- Themes ----

export type CardContentType = 'image' | 'emoji'

export interface ThemeItem {
  id: string
  type: CardContentType
  content: string
}

export interface Theme {
  id: string
  labelKey: string
  items: ThemeItem[]
}

export const THEMES: Theme[] = [
  {
    id: 'shapes',
    labelKey: 'memory.theme.shapes',
    items: [
      { id: 'star', type: 'image', content: '/images/memory-game/star.svg' },
      { id: 'heart', type: 'image', content: '/images/memory-game/heart.svg' },
      { id: 'diamond', type: 'image', content: '/images/memory-game/diamond.svg' },
      { id: 'circle', type: 'image', content: '/images/memory-game/circle.svg' },
      { id: 'triangle', type: 'image', content: '/images/memory-game/triangle.svg' },
      { id: 'hexagon', type: 'image', content: '/images/memory-game/hexagon.svg' },
      { id: 'pentagon', type: 'image', content: '/images/memory-game/pentagon.svg' },
      { id: 'cross', type: 'image', content: '/images/memory-game/cross.svg' },
      { id: 'arrow', type: 'image', content: '/images/memory-game/arrow.svg' },
      { id: 'crescent', type: 'image', content: '/images/memory-game/crescent.svg' },
      { id: 'square', type: 'image', content: '/images/memory-game/square.svg' },
      { id: 'oval', type: 'image', content: '/images/memory-game/oval.svg' },
    ],
  },
  {
    id: 'animals',
    labelKey: 'memory.theme.animals',
    items: [
      { id: 'dog', type: 'emoji', content: '🐶' },
      { id: 'cat', type: 'emoji', content: '🐱' },
      { id: 'bear', type: 'emoji', content: '🐻' },
      { id: 'fox', type: 'emoji', content: '🦊' },
      { id: 'lion', type: 'emoji', content: '🦁' },
      { id: 'owl', type: 'emoji', content: '🦉' },
      { id: 'dolphin', type: 'emoji', content: '🐬' },
      { id: 'butterfly', type: 'emoji', content: '🦋' },
      { id: 'turtle', type: 'emoji', content: '🐢' },
      { id: 'penguin', type: 'emoji', content: '🐧' },
      { id: 'octopus', type: 'emoji', content: '🐙' },
      { id: 'rabbit', type: 'emoji', content: '🐰' },
    ],
  },
  {
    id: 'emoji',
    labelKey: 'memory.theme.emoji',
    items: [
      { id: 'sun', type: 'emoji', content: '☀️' },
      { id: 'fire', type: 'emoji', content: '🔥' },
      { id: 'rocket', type: 'emoji', content: '🚀' },
      { id: 'rainbow', type: 'emoji', content: '🌈' },
      { id: 'star', type: 'emoji', content: '⭐' },
      { id: 'lightning', type: 'emoji', content: '⚡' },
      { id: 'snowflake', type: 'emoji', content: '❄️' },
      { id: 'moon', type: 'emoji', content: '🌙' },
      { id: 'gem', type: 'emoji', content: '💎' },
      { id: 'mushroom', type: 'emoji', content: '🍄' },
      { id: 'clover', type: 'emoji', content: '🍀' },
      { id: 'crown', type: 'emoji', content: '👑' },
    ],
  },
  {
    id: 'vehicles',
    labelKey: 'memory.theme.vehicles',
    items: [
      { id: 'car', type: 'emoji', content: '🚗' },
      { id: 'bus', type: 'emoji', content: '🚌' },
      { id: 'train', type: 'emoji', content: '🚂' },
      { id: 'airplane', type: 'emoji', content: '✈️' },
      { id: 'helicopter', type: 'emoji', content: '🚁' },
      { id: 'sailboat', type: 'emoji', content: '⛵' },
      { id: 'rocket', type: 'emoji', content: '🚀' },
      { id: 'bicycle', type: 'emoji', content: '🚲' },
      { id: 'motorcycle', type: 'emoji', content: '🏍️' },
      { id: 'tractor', type: 'emoji', content: '🚜' },
      { id: 'ambulance', type: 'emoji', content: '🚑' },
      { id: 'firetruck', type: 'emoji', content: '🚒' },
    ],
  },
]

export const DEFAULT_THEME = THEMES[0]

// ---- Helpers ----

export function getThemeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? DEFAULT_THEME
}

export function getGridSizeById(id: string): GridSize {
  return GRID_SIZES.find((g) => g.id === id) ?? DEFAULT_GRID_SIZE
}

export function getItemsForGrid(theme: Theme, pairs: number): ThemeItem[] {
  return theme.items.slice(0, pairs)
}

export function getAvailableGridSizes(theme: Theme): GridSize[] {
  return GRID_SIZES.filter((g) => g.pairs <= theme.items.length)
}

export function getCardSizeClasses(gridSize: GridSize): string {
  if (gridSize.pairs <= 8) return 'h-24 w-20 sm:h-32 sm:w-28'
  if (gridSize.pairs <= 10) return 'h-20 w-16 sm:h-28 sm:w-24'
  return 'h-18 w-14 sm:h-24 sm:w-20'
}

export function getEmojiSizeClasses(gridSize: GridSize): string {
  if (gridSize.pairs <= 8) return 'text-4xl sm:text-5xl'
  if (gridSize.pairs <= 10) return 'text-3xl sm:text-4xl'
  return 'text-2xl sm:text-3xl'
}
