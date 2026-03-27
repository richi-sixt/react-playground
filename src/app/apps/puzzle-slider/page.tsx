import { AppDetailLayout } from '@/components/AppDetailLayout'
import { MdxContent } from './MdxContent'
import { app as baseApp } from './page.en.mdx'

const app = { ...baseApp, slug: 'puzzle-slider' }

export const metadata = {
  title: app.title,
  description: app.description,
}

export default async function PuzzleSliderPage() {
  return (
    <AppDetailLayout app={app}>
      <MdxContent />
    </AppDetailLayout>
  )
}
