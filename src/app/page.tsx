import { Container } from '@/components/Container'
import { AppList } from '@/components/AppList'
import { getAllApps } from '@/lib/apps'

export default async function Home() {
  let apps = await getAllApps()

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            React Playground
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            A collection of apps, games, experiments, and demos built with
            React. Explore different React patterns and features.
          </p>
        </div>
      </Container>

      <Container className="mt-24 md:mt-28">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100">
          Apps
        </h2>
        <div className="mt-10">
          <AppList apps={apps} />
        </div>
      </Container>
    </>
  )
}
