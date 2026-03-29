'use client'

import { useTranslation } from '@/i18n'
import ContentEn from './page.en.mdx'
import ContentDe from './page.de.mdx'

export function MdxContent() {
  const { locale } = useTranslation()
  return locale === 'de' ? <ContentDe /> : <ContentEn />
}
