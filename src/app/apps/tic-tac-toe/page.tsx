import { AppDetailLayout } from '@/components/AppDetailLayout'
import { MdxContent } from './MdxContent'

const app = {
  title: 'Tic Tac Toe',
  description:
    'Classic two-player game with move history and time travel. Built following the official React tutorial.',
  tech: ['React', 'TypeScript', 'useState'],
  url: '/apps/tic-tac-toe/play/',
  date: '2025-03-02',
  category: 'games' as const,
}

export const metadata = {
  title: app.title,
  description: app.description,
}

export default async function TicTacToePage() {
  return (
    <AppDetailLayout app={app}>
      <MdxContent />
    </AppDetailLayout>
  )
}
