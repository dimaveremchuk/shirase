import { marked } from 'marked'
import styles from './markdown.module.css'

marked.use({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      const level = Math.min(depth + 1, 6)
      return `<h${level}>${text}</h${level}>\n`
    },
  },
})

export function Markdown({ content }: { content: string }) {
  const html = marked(content) as string
  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
