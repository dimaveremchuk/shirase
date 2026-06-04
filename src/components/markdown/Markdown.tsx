import { marked } from 'marked'
import styles from './markdown.module.css'

marked.use({ gfm: true })

export function Markdown({ content }: { content: string }) {
  const html = marked(content) as string
  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
