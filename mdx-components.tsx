import Image, { type ImageProps } from 'next/image'
import { type MDXComponents } from 'mdx/types'
import { Preview } from '@/components/Preview'

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    Image: (props: ImageProps) => <Image {...props} />,
    Preview,
  }
}
