'use client'

import Link from 'next/link'
import { useTranslation, type TranslationKey } from '@/i18n'

export function GamePageHeader({
  titleKey,
  descriptionKey,
  multiplayerHref,
  multiplayerLabelKey,
}: {
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  multiplayerHref?: string
  multiplayerLabelKey?: TranslationKey
}) {
  let { t } = useTranslation()

  return (
    <header className="max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
        {t(titleKey)}
      </h1>
      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        {t(descriptionKey)}
      </p>
      {multiplayerHref && multiplayerLabelKey && (
        <Link
          href={multiplayerHref}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-500 transition hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
        >
          {t(multiplayerLabelKey)} →
        </Link>
      )}
    </header>
  )
}

export function MultiplayerPageHeader({
  titleKey,
  descriptionKey,
}: {
  titleKey: TranslationKey
  descriptionKey: TranslationKey
}) {
  let { t } = useTranslation()

  return (
    <header className="max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
        {t(titleKey)}{' '}
        <span className="text-violet-500 dark:text-violet-400">
          {t('mp.multiplayer')}
        </span>
      </h1>
      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        {t(descriptionKey)}
      </p>
    </header>
  )
}
