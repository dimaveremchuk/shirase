import { posts } from '@/lib/changelog-data'
import { Markdown } from '@/components/markdown/Markdown'
import styles from './page.module.css'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export default function ChangelogPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  return (
    <main className={styles.container}>
      <div className={styles.headingContainer}>
        <div className={styles.heading}>
        Changelog
        </div>
        <div className={styles.subheading}>
        Updates from Shirase
        </div>
      </div>
      <div className={styles.posts}>
        {sorted.map((post) => (
          <article key={post.id} className={styles.post}>
            <div className={styles.left}>
              <div className={styles.sticky}>
                <time className={styles.date}>{formatDate(post.publishedAt)}</time>
                <span className={styles.dot} aria-hidden="true" />
              </div>
            </div>
            <div className={styles.right}>
              {/* shown only on mobile — date in .left is hidden */}
              <time className={styles.dateMobile}>{formatDate(post.publishedAt)}</time>
              <h1 className={styles.title}>{post.title}</h1>
              {post.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImageUrl}
                  alt=""
                  className={styles.cover}
                />
              )}
              <div className={styles.body}>
                <Markdown content={post.content} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
