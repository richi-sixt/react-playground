import glob from 'fast-glob'

interface App {
  title: string
  description: string
  tech: string[]
  url?: string
  github?: string
  date: string
  category: 'games' | 'misc'
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
    slug: appFilename.replace(/(\/page)?\.mdx$/, ''),
    ...app,
  }
}

export async function getAllApps() {
  let appFilenames = await glob('*/page.mdx', {
    cwd: './src/app/apps',
  })

  let apps = await Promise.all(appFilenames.map(importApp))

  return apps.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
