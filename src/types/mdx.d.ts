declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { JournalEntry } from '@/lib/journal'
  import type { App } from '@/lib/apps'

  const component: ComponentType
  export default component
  export const entry: JournalEntry
  export const app: App
}
