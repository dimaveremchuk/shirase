import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { posts } from '@/lib/changelog-data'
import { Markdown } from '@/components/markdown/Markdown'
import { CopyLinkButton } from '@/components/copy-link-button/CopyLinkButton'
import { BackLink } from './BackLink'
import styles from './page.module.css'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}
  return { title: post.title }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <article className={styles.post}>
          <div className={styles.left}>
            <div className={styles.sticky}>
              <BackLink />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.meta}>
              <time className={styles.date}>{formatDate(post.publishedAt)}</time>
              <CopyLinkButton className={styles.copyButton} />
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            {post.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.coverImageUrl} alt="" className={styles.cover} />
            )}
            <div className={styles.body}>
              <Markdown content={post.content} />
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
