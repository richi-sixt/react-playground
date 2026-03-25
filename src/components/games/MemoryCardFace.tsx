import clsx from 'clsx'
import type { CardContentType } from '@/lib/memory-config'

interface MemoryCardFaceProps {
  type: CardContentType
  content: string
  isMatched: boolean
  emojiSizeClasses: string
}

export function MemoryCardFace({
  type,
  content,
  isMatched,
  emojiSizeClasses,
}: MemoryCardFaceProps) {
  return (
    <div
      className={clsx(
        'absolute inset-0 flex items-center justify-center rounded-xl',
        'border border-zinc-200 bg-white [backface-visibility:hidden] [transform:rotateY(180deg)]',
        'dark:border-zinc-700 dark:bg-zinc-800',
        isMatched && 'ring-2 ring-green-400 dark:ring-green-500',
      )}
    >
      {type === 'image' ? (
        <img
          src={content}
          alt="card"
          className="h-full w-full object-contain p-3"
          draggable={false}
        />
      ) : (
        <span className={clsx('select-none', emojiSizeClasses)}>{content}</span>
      )}
    </div>
  )
}
