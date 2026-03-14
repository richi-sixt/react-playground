
'use client'

import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'

interface Card {
  id: number
  imageId: number
  imageSrc: string
  isFlipped: boolean
  isMatched: boolean
}

const CARD_IMAGES = [
  '/images/memory-game/star.svg',
  '/images/memory-game/heart.svg',
  '/images/memory-game/diamond.svg',
  '/images/memory-game/circle.svg',
  '/images/memory-game/triangle.svg',
  '/images/memory-game/hexagon.svg',
]

function createDeck(): Card[] {
  return CARD_IMAGES.flatMap((src, imageId) => [
    { id: imageId * 2, imageId, imageSrc: src, isFlipped: false, isMatched: false },
    { id: imageId * 2 + 1, imageId, imageSrc: src, isFlipped: false, isMatched: false },
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
  // Start with empty deck to avoid hydration mismatch — shuffled deck
  // is only created client-side in useEffect.
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const matchedPairs = cards.filter((c) => c.isMatched).length / 2
  const isGameWon = matchedPairs === CARD_IMAGES.length
  const totalCards = CARD_IMAGES.length * 2

  useEffect(() => {
    setCards(shuffleDeck(createDeck()))
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

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

      if (newCards[first].imageId === newCards[second].imageId) {
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
    setCards(shuffleDeck(createDeck()))
    setSelectedCards([])
    setMoves(0)
    setIsChecking(false)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          Moves: {moves}
        </div>
        <div className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          Pairs: {matchedPairs} / {CARD_IMAGES.length}
        </div>
        <button
          onClick={handleNewGame}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          New Game
        </button>
      </div>

      {isGameWon && (
        <div className="mb-6 rounded-lg bg-green-50 px-6 py-3 text-lg font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
          You won in {moves} moves!
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.length === 0
          ? /* Placeholder face-down cards during SSR */
            Array.from({ length: totalCards }, (_, i) => (
              <div
                key={i}
                className="h-24 w-20 sm:h-32 sm:w-28"
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
                className="h-24 w-20 cursor-pointer [perspective:1000px] sm:h-32 sm:w-28"
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
                  <div
                    className={clsx(
                      'absolute inset-0 flex items-center justify-center rounded-xl',
                      'border border-zinc-200 bg-white p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]',
                      'dark:border-zinc-700 dark:bg-zinc-800',
                      card.isMatched &&
                        'ring-2 ring-green-400 dark:ring-green-500',
                    )}
                  >
                    <img
                      src={card.imageSrc}
                      alt="card"
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
