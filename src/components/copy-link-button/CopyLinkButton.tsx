'use client'

import { useState } from 'react'
import styles from './CopyLinkButton.module.css'

interface CopyLinkButtonProps {
  className?: string
}

export function CopyLinkButton({ className }: CopyLinkButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  function handleClick() {
    navigator.clipboard.writeText(window.location.href)
    setState('copied')
    setTimeout(() => setState('idle'), 2000)
  }

  return (
    <button className={`${styles.button}${className ? ` ${className}` : ''}`} onClick={handleClick} disabled={state === 'copied'}>
      <span className={styles.labels} data-copied={state === 'copied' || undefined}>
        <span className={styles.labelDefault} aria-hidden={state === 'copied'}>Copy link</span>
        <span className={styles.labelCopied} aria-hidden={state === 'idle'}>Copied</span>
      </span>
    </button>
  )
}
