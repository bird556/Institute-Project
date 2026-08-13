export type EventBlockKey = 'cover_image' | 'title' | 'description' | 'embed_html'

export const DEFAULT_EVENT_LAYOUT: EventBlockKey[] = ['cover_image', 'title', 'description', 'embed_html']

export const EVENT_BLOCK_LABELS: Record<EventBlockKey, string> = {
  cover_image: 'Cover Image',
  title: 'Title & Event Info',
  description: 'Description',
  embed_html: 'Signup Form (Embed Code)',
}

/** Guards against a missing/corrupt/partial layout_order value from the DB. */
export function parseEventLayout(value: string[] | null | undefined): EventBlockKey[] {
  if (!Array.isArray(value)) return DEFAULT_EVENT_LAYOUT
  const valid = value.filter((v): v is EventBlockKey => DEFAULT_EVENT_LAYOUT.includes(v as EventBlockKey))
  const missing = DEFAULT_EVENT_LAYOUT.filter((k) => !valid.includes(k))
  return [...valid, ...missing]
}
