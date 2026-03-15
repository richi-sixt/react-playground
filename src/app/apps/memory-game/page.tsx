import { AppDetailLayout } from '@/components/AppDetailLayout'
import { MdxContent } from './MdxContent'

const app = {
  title: 'Memory Game',
  description:
    'A card-matching memory game with flip animations. Find all 6 matching pairs in as few moves as possible.',
  tech: ['React', 'TypeScript', 'useState', 'useEffect'],
  url: '/apps/memory-game/play/',
  date: '2025-03-14',
  category: 'games' as const,
}

export const metadata = {
  title: app.title,
  description: app.description,
}

export default async function MemoryGamePage() {
  return (
    <AppDetailLayout app={app}>
      <MdxContent />
    </AppDetailLayout>
  )
}
