'use client'

import { useTranslation } from '@/i18n'

export function HomeHeader() {
  let { t } = useTranslation()

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
        {t('home.title')}
      </h1>
      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        {t('home.description')}
      </p>
    </div>
  )
}

export function AppsHeading() {
  let { t } = useTranslation()

  return (
    <h2 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100">
      {t('home.apps')}
    </h2>
  )
}
