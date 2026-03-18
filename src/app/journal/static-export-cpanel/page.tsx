import { JournalLayout } from '@/components/JournalLayout'
import { MdxContent } from './MdxContent'
import { entry as baseEntry } from './page.en.mdx'

const entry = { ...baseEntry, slug: 'static-export-cpanel' }

export const metadata = {
  title: entry.title,
  description: entry.description,
}

export default function StaticExportCpanelPage() {
  return (
    <JournalLayout entry={entry}>
      <MdxContent />
    </JournalLayout>
  )
}
