'use client'

import { useState } from 'react'

export default function ExpandableText({
  text,
  maxLength = 400,
  className = '',
}: {
  text: string
  maxLength?: number
  className?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > maxLength

  if (!isLong) {
    return <p className={className}>{text}</p>
  }

  return (
    <p className={className}>
      {expanded ? text : `${text.slice(0, maxLength).trimEnd()}…`}{' '}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="font-medium text-(--color-brand-teal) dark:text-white hover:underline cursor-pointer"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </p>
  )
}
