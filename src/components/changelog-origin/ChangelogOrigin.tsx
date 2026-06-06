import styles from './changelog-origin.module.css'
// File must be placed at /src/assets/icons/flag.svg
import FlagIcon from '@/assets/icons/flag.svg'

export function ChangelogOrigin() {
  return (
    <article className={styles.post}>
      <div className={styles.origin}>
        <FlagIcon className={styles.flag} aria-hidden="true" />
        <p className={styles.caption}>This is where version one shipped.</p>
      </div>
    </article>
  )
}
