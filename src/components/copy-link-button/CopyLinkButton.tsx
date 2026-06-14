'use client'

import { useState } from 'react'
import { TextMorph } from 'torph/react'

interface CopyLinkButtonProps {
  className?: string
}

export function CopyLinkButton({ className }: CopyLinkButtonProps) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  function handleClick() {
    navigator.clipboard.writeText(window.location.href)
    setState('copied')
    setTimeout(() => setState('idle'), 1500)
  }

  return (
    <button className={className} onClick={handleClick}>
      <TextMorph>{state === 'copied' ? 'Copied' : 'Copy link'}</TextMorph>
    </button>
  )
}
