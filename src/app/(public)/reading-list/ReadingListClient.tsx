'use client'

import { useMemo, useRef, useEffect } from 'react'
import ReadingListSection, { type ReadingListItem } from '@/components/reading-list/ReadingListSection'
import BookstoreSection from '@/components/reading-list/BookstoreSection'
import type { BookstoreRowProps } from '@/components/reading-list/BookstoreRow'

export type { ReadingListItem }

export default function ReadingListClient({
  items,
  bookstores,
  initialSection,
}: {
  items: ReadingListItem[]
  bookstores: BookstoreRowProps[]
  initialSection: 'bibliography' | 'theses' | 'bookstores' | null
}) {
  const bibliographyItems = useMemo(
    () => items.filter((i) => i.item_type !== 'thesis_ma' && i.item_type !== 'thesis_phd'),
    [items],
  )
  const thesisItems = useMemo(
    () => items.filter((i) => i.item_type === 'thesis_ma' || i.item_type === 'thesis_phd'),
    [items],
  )

  const thesesRef = useRef<HTMLDivElement>(null)
  const bookstoresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialSection === 'theses') {
      thesesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (initialSection === 'bookstores') {
      bookstoresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <ReadingListSection
        title="Bibliography"
        items={bibliographyItems}
        defaultOpen={initialSection === 'bibliography'}
        typeOptions={[
          { value: 'book', label: 'Books' },
        ]}
      />
      <div ref={thesesRef}>
        <ReadingListSection
          title="MA and PhD Theses"
          items={thesisItems}
          defaultOpen={initialSection === 'theses'}
          typeOptions={[
            { value: 'thesis_ma', label: 'M.A.' },
            { value: 'thesis_phd', label: 'Ph.D.' },
          ]}
        />
      </div>
      <div ref={bookstoresRef}>
        <BookstoreSection
          items={bookstores}
          defaultOpen={initialSection === 'bookstores'}
        />
      </div>
    </div>
  )
}
