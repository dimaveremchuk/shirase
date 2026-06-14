'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowIcon } from '@/assets/icons/ArrowLeft'
import styles from './page.module.css'

export function BackLink() {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href="/changelog"
      className={styles.backLink}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ArrowIcon state={hovered ? 'arrow' : 'chevron'} />
      Changelog
    </Link>
  )
}
