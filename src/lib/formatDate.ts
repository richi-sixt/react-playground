const localeMap: Record<string, string> = { en: 'en-US', de: 'de-DE' }

export function formatDate(dateString: string, locale: string = 'en') {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString(
    localeMap[locale] || locale,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    },
  )
}
