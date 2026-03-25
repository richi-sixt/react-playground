
'use client'

import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useTranslation } from '@/i18n'
import { MemoryCardFace } from './MemoryCardFace'
import { MemorySettings } from './MemorySettings'
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_THEME,
  getGridSizeById,
  getThemeById,
  getItemsForGrid,
  getCardSizeClasses,
  getEmojiSizeClasses,
  type GridSize,
  type Theme,
  type CardContentType,
} from '@/lib/memory-config'

interface Card {
  id: number
  itemId: string
  type: CardContentType
  content: string
  isFlipped: boolean
  isMatched: boolean
}

function createDeck(theme: Theme, gridSize: GridSize): Card[] {
  const items = getItemsForGrid(theme, gridSize.pairs)
  return items.flatMap((item, idx) => [
    { id: idx * 2, itemId: item.id, type: item.type, content: item.content, isFlipped: false, isMatched: false },
    { id: idx * 2 + 1, itemId: item.id, type: item.type, content: item.content, isFlipped: false, isMatched: false },
  ])
}

function shuffleDeck(cards: Card[]): Card[] {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function MemoryGame() {
  let { t } = useTranslation()
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULT_GRID_SIZE)
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)
  // Start with empty deck to avoid hydration mismatch — shuffled deck
  // is only created client-side in useEffect.
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const matchedPairs = cards.filter((c) => c.isMatched).length / 2
  const isGameWon = cards.length > 0 && matchedPairs === gridSize.pairs
  const totalCards = gridSize.rows * gridSize.cols
  const cardSizeClasses = getCardSizeClasses(gridSize)
  const emojiSizeClasses = getEmojiSizeClasses(gridSize)

  useEffect(() => {
    setCards(shuffleDeck(createDeck(theme, gridSize)))
    setSelectedCards([])
    setMoves(0)
    setIsChecking(false)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [gridSize, theme])

  function handleCardClick(index: number) {
    if (isChecking) return
    if (cards[index].isFlipped || cards[index].isMatched) return
    if (selectedCards.length >= 2) return

    const newCards = cards.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card,
    )
    const newSelected = [...selectedCards, index]

    setCards(newCards)
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setMoves((m) => m + 1)
      const [first, second] = newSelected

      if (newCards[first].itemId === newCards[second].itemId) {
        setCards(
          newCards.map((card, i) =>
            i === first || i === second ? { ...card, isMatched: true } : card,
          ),
        )
        setSelectedCards([])
      } else {
        setIsChecking(true)
        timeoutRef.current = setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === first || i === second
                ? { ...card, isFlipped: false }
                : card,
            ),
          )
          setSelectedCards([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }

  function handleNewGame() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCards(shuffleDeck(createDeck(theme, gridSize)))
    setSelectedCards([])
    setMoves(0)
    setIsChecking(false)
  }

  return (
    <div className="flex flex-col items-center">
      <MemorySettings
        gridSizeId={gridSize.id}
        themeId={theme.id}
        onGridSizeChange={(id) => setGridSize(getGridSizeById(id))}
        onThemeChange={(id) => setTheme(getThemeById(id))}
      />

      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          {t('memory.moves', { count: moves })}
        </div>
        <div className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          {t('memory.pairs', { matched: matchedPairs, total: gridSize.pairs })}
        </div>
        <button
          onClick={handleNewGame}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          {t('memory.newGame')}
        </button>
      </div>

      {isGameWon && (
        <div className="mb-6 rounded-lg bg-green-50 px-6 py-3 text-lg font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {t('memory.youWon', { moves })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.length === 0
          ? /* Placeholder face-down cards during SSR */
            Array.from({ length: totalCards }, (_, i) => (
              <div
                key={i}
                className={cardSizeClasses}
              >
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-violet-500 text-3xl font-bold text-white dark:bg-violet-600">
                    ?
                  </div>
                </div>
              </div>
            ))
          : cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={clsx(cardSizeClasses, 'cursor-pointer [perspective:1000px]')}
              >
                <div
                  className={clsx(
                    'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
                    (card.isFlipped || card.isMatched) &&
                      '[transform:rotateY(180deg)]',
                  )}
                >
                  {/* Back face — visible when card is face-down */}
                  <div
                    className={clsx(
                      'absolute inset-0 flex items-center justify-center rounded-xl',
                      'bg-violet-500 text-3xl font-bold text-white [backface-visibility:hidden]',
                      'transition-colors hover:bg-violet-400',
                      'dark:bg-violet-600 dark:hover:bg-violet-500',
                      card.isMatched &&
                        'ring-2 ring-green-400 dark:ring-green-500',
                    )}
                  >
                    ?
                  </div>
                  {/* Front face — visible when card is flipped */}
                  <MemoryCardFace
                    type={card.type}
                    content={card.content}
                    isMatched={card.isMatched}
                    emojiSizeClasses={emojiSizeClasses}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
