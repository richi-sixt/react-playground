import { Container } from '@/components/Container'
import { HomeHeader, AppsHeading } from '@/components/HomeHeader'
import { AppList } from '@/components/AppList'
import { getAllApps } from '@/lib/apps'

export default async function Home() {
  let apps = await getAllApps()

  return (
    <>
      <Container className="mt-9">
        <HomeHeader />
      </Container>

      <Container className="mt-24 md:mt-28">
        <AppsHeading />
        <div className="mt-10">
          <AppList apps={apps} />
        </div>
      </Container>
    </>
  )
}
