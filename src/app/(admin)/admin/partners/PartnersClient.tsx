'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreVertical, PenLine, Trash2, Plus, Building2, Search, X, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import {
  createPartner,
  deletePartner,
  togglePartnerPublished,
  updatePartnerSortOrder,
} from '@/actions/partners'
import type { Partner } from '@/types'

type VisibilityFilter = 'all' | 'visible' | 'hidden'

interface PartnersClientProps {
  partners: Partner[]
  logoUrls: Record<string, string>
}

export default function PartnersClient({ partners: initial, logoUrls }: PartnersClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [partners, setPartners] = useState(initial)
  const [query, setQuery] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const isFiltering = query !== '' || visibilityFilter !== 'all'

  const filtered = partners.filter((p) => {
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'visible' && p.published) ||
      (visibilityFilter === 'hidden' && !p.published)
    return matchesQuery && matchesVisibility
  })

  async function handleNew() {
    startTransition(async () => {
      const result = await createPartner()
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create partner.')
        return
      }
      router.push(`/admin/partners/${result.data.id}`)
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deletePartner(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Could not delete partner.')
      return
    }
    setPartners((prev) => prev.filter((p) => p.id !== deleteId))
    toast.success('Partner deleted.')
  }

  async function handleToggleVisible(id: string, current: boolean) {
    const next = !current
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: next } : p))
    )
    const result = await togglePartnerPublished(id, next)
    if (!result.success) {
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: current } : p))
      )
      toast.error(result.error ?? 'Failed to update visibility.')
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = partners.findIndex((p) => p.id === active.id)
    const newIndex = partners.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(partners, oldIndex, newIndex)

    const withOrder = reordered.map((p, i) => ({ ...p, sort_order: i + 1 }))
    setPartners(withOrder)

    const updates = withOrder.map(({ id, sort_order }) => ({ id, sort_order }))
    const result = await updatePartnerSortOrder(updates)
    if (!result.success) {
      setPartners(partners)
      toast.error(result.error ?? 'Failed to save order.')
    }
  }

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  const listItems = isFiltering ? filtered : partners

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            Partners
          </h1>
          <Button
            onClick={handleNew}
            disabled={isPending}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Partner
          </Button>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="w-full sm:w-80 pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
            {(['all', 'visible', 'hidden'] as VisibilityFilter[]).map((f) => (
              <button key={f} onClick={() => setVisibilityFilter(f)} className={filterBtnClass(visibilityFilter === f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        {isFiltering && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {filtered.length} of {partners.length} {partners.length === 1 ? 'partner' : 'partners'}
          </p>
        )}

        {/* List */}
        {listItems.length === 0 ? (
          isFiltering ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <Building2 className="h-8 w-8 text-[var(--color-text-muted)]" />
              <div>
                <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                  No results{query ? ` for "${query}"` : ''}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Try a different search or clear the filters.</p>
              </div>
              <Button variant="ghost" onClick={() => { setQuery(''); setVisibilityFilter('all') }} className="cursor-pointer text-[var(--color-brand-teal)]">
                Clear filters
              </Button>
            </div>
          ) : (
            <EmptyState onNew={handleNew} creating={isPending} />
          )
        ) : isFiltering ? (
          // Filtered view — no drag context
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
            {listItems.map((partner, i) => (
              <SortableRow
                key={partner.id}
                partner={partner}
                index={i}
                logoUrl={logoUrls[partner.id]}
                dragDisabled
                onEdit={() => router.push(`/admin/partners/${partner.id}`)}
                onDelete={() => setDeleteId(partner.id)}
                onToggleVisible={() => handleToggleVisible(partner.id, partner.published)}
              />
            ))}
          </div>
        ) : (
          // Full list with drag-to-reorder
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={partners.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                {partners.map((partner, i) => (
                  <SortableRow
                    key={partner.id}
                    partner={partner}
                    index={i}
                    logoUrl={logoUrls[partner.id]}
                    dragDisabled={false}
                    onEdit={() => router.push(`/admin/partners/${partner.id}`)}
                    onDelete={() => setDeleteId(partner.id)}
                    onToggleVisible={() => handleToggleVisible(partner.id, partner.published)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <p className="text-xs text-[var(--color-text-muted)]">
          {isFiltering
            ? 'Clear filters to reorder partners.'
            : 'Drag rows to reorder. Order is reflected on the public partners page.'}
        </p>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Partner"
        description="This action cannot be undone. The partner will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}

interface SortableRowProps {
  partner: Partner
  index: number
  logoUrl?: string
  dragDisabled: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleVisible: () => void
}

function SortableRow({ partner, index, logoUrl, dragDisabled, onEdit, onDelete, onToggleVisible }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: partner.id,
    disabled: dragDisabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        disabled={dragDisabled}
        className={`shrink-0 p-1 rounded touch-none transition-colors ${
          dragDisabled
            ? 'opacity-30 cursor-not-allowed'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] cursor-grab active:cursor-grabbing'
        }`}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Logo thumbnail */}
      <div className="h-12 w-12 rounded-md overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] shrink-0 flex items-center justify-center">
        {logoUrl ? (
          <Image src={logoUrl} alt={partner.name} width={48} height={48} className="object-cover w-full h-full" />
        ) : (
          <Building2 className="h-5 w-5 text-[var(--color-text-muted)]" />
        )}
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
          {partner.name}
        </p>
        {partner.description && (
          <p className="text-sm text-[var(--color-text-muted)] truncate">
            {partner.description}
          </p>
        )}
      </div>

      {/* Visibility toggle */}
      <button
        onClick={onToggleVisible}
        title={partner.published ? 'Click to hide' : 'Click to show'}
        className="flex items-center gap-1.5 text-xs font-medium shrink-0 cursor-pointer px-2 py-1 rounded-full transition-colors"
        style={
          partner.published
            ? { color: 'var(--color-brand-teal)', background: 'color-mix(in srgb, var(--color-brand-teal) 12%, transparent)' }
            : { color: 'var(--color-text-muted)', background: 'var(--color-surface)' }
        }
      >
        <span
          className="h-1.5 w-1.5 rounded-full shrink-0"
          style={{ background: partner.published ? 'var(--color-brand-teal)' : 'var(--color-text-muted)' }}
        />
        {partner.published ? 'Visible' : 'Hidden'}
      </button>

      {/* Actions menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer gap-2">
            <PenLine className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleVisible} className="cursor-pointer gap-2">
            {partner.published
              ? <><EyeOff className="h-4 w-4" />Hide</>
              : <><Eye className="h-4 w-4" />Show</>
            }
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}

function EmptyState({ onNew, creating }: { onNew: () => void; creating: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
      <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center">
        <Building2 className="h-6 w-6 text-[var(--color-text-muted)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">No partners yet</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Add your first partner organisation to get started.</p>
      </div>
      <Button
        onClick={onNew}
        disabled={creating}
        className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
      >
        <Plus className="h-4 w-4" />
        Add your first partner
      </Button>
    </div>
  )
}
