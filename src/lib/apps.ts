import fs from 'node:fs'
import path from 'node:path'

interface App {
  title: string
  description: string
  tech: string[]
  url?: string
  github?: string
  date: string
  category: 'games' | 'tools' | 'web' | 'misc'
}

export interface AppWithSlug extends App {
  slug: string
}

async function importApp(appFilename: string): Promise<AppWithSlug> {
  let { app } = (await import(`../app/apps/${appFilename}`)) as {
    default: React.ComponentType
    app: App
  }

  return {
    slug: appFilename.replace(/(\/page)?\.en\.mdx$/, ''),
    ...app,
  }
}

export async function getAllApps() {
  let appsDir = path.join(process.cwd(), 'src/app/apps')
  let entries = fs.readdirSync(appsDir, { withFileTypes: true })
  let appFilenames = entries
    .filter(
      (e) =>
        e.isDirectory() &&
        fs.existsSync(path.join(appsDir, e.name, 'page.en.mdx')),
    )
    .map((e) => `${e.name}/page.en.mdx`)

  let apps = await Promise.all(appFilenames.map(importApp))

  return apps.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
