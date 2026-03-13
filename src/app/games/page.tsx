import { type Metadata } from 'next'

import { SimpleLayout } from '@/components/SimpleLayout'
import { Card } from '@/components/Card'
import { getAllGames } from '@/lib/games'
import { formatDate } from '@/lib/formatDate'

export const metadata: Metadata = {
  title: 'Games',
  description: 'Interactive games and experiments built with React.',
}

export default function Games() {
  let games = getAllGames()

  return (
    <SimpleLayout
      title="Games & Experiments"
      intro="Interactive demos exploring different React patterns and features."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {games.map((game) => (
            <article
              key={game.slug}
              className="md:grid md:grid-cols-4 md:items-baseline"
            >
              <Card className="md:col-span-3">
                <Card.Title href={`/games/${game.slug}`}>
                  {game.title}
                </Card.Title>
                <Card.Eyebrow
                  as="time"
                  dateTime={game.date}
                  className="md:hidden"
                  decorate
                >
                  {formatDate(game.date)}
                </Card.Eyebrow>
                <Card.Description>{game.description}</Card.Description>
                <div className="relative z-10 mt-4 flex flex-wrap gap-1">
                  {game.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Card.Cta>Play now</Card.Cta>
              </Card>
              <Card.Eyebrow
                as="time"
                dateTime={game.date}
                className="mt-1 max-md:hidden"
              >
                {formatDate(game.date)}
              </Card.Eyebrow>
            </article>
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
