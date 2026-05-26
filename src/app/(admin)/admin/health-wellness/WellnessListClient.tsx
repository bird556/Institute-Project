'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, Heart, Search, X } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createWellnessPost, deleteWellnessPost, toggleWellnessPublished } from '@/actions/wellness'
import { formatDate } from '@/lib/utils'
import { WELLNESS_TAGS } from '@/types'
import type { WellnessPost, WellnessTag } from '@/types'

type StatusFilter = 'all' | 'published' | 'drafts'
type TagFilter    = 'all' | WellnessTag

interface WellnessListItem extends WellnessPost {
  cover_url: string | null
}

interface WellnessListClientProps {
  posts: WellnessListItem[]
}

export default function WellnessListClient({ posts: initial }: WellnessListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [posts, setPosts] = useState(initial)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [tagFilter, setTagFilter] = useState<TagFilter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const filtered = posts.filter((p) => {
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? '').toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && p.published) ||
      (statusFilter === 'drafts' && !p.published)
    const matchesTag =
      tagFilter === 'all' || p.tags.includes(tagFilter)
    return matchesQuery && matchesStatus && matchesTag
  })

  const isFiltering = query !== '' || statusFilter !== 'all' || tagFilter !== 'all'

  async function handleNew() {
    startTransition(async () => {
      const result = await createWellnessPost()
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create post.')
        return
      }
      router.push(`/admin/health-wellness/${result.data.id}`)
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteWellnessPost(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Could not delete post.')
      return
    }
    setPosts((prev) => prev.filter((p) => p.id !== deleteId))
    toast.success('Wellness post deleted.')
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id)
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: !current } : p))
    const result = await toggleWellnessPublished(id, !current)
    setTogglingId(null)
    if (!result.success) {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: current } : p))
      toast.error(result.error ?? 'Failed to update status.')
    }
  }

  function clearFilters() {
    setQuery('')
    setStatusFilter('all')
    setTagFilter('all')
  }

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            Health &amp; Wellness
          </h1>
          <Button onClick={handleNew} disabled={isPending} className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5">
            <Plus size={16} /> New Post
          </Button>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or excerpt…"
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
            {(['all', 'published', 'drafts'] as StatusFilter[]).map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)} className={filterBtnClass(statusFilter === f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value as TagFilter)}
            className="h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors cursor-pointer"
          >
            <option value="all">All Tags</option>
            {WELLNESS_TAGS.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Result count */}
        {isFiltering && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {filtered.length} of {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <Heart size={32} className="text-[var(--color-text-muted)]" />
            <div>
              <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                {isFiltering ? `No results${query ? ` for "${query}"` : ''}` : 'No posts yet'}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {isFiltering ? 'Try a different search or clear the filters.' : 'Create your first wellness post to get started.'}
              </p>
            </div>
            {isFiltering ? (
              <Button variant="ghost" onClick={clearFilters} className="cursor-pointer text-[var(--color-brand-teal)]">
                Clear filters
              </Button>
            ) : (
              <button onClick={handleNew} className="text-sm text-[var(--color-brand-teal)] hover:underline cursor-pointer">
                Create your first post →
              </button>
            )}
          </div>
        ) : (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-2"
          >
            {filtered.map((post) => (
              <motion.li
                key={post.id}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] px-4 py-3"
              >
                {/* Thumbnail */}
                {post.cover_url ? (
                  <div className="h-10 w-10 rounded-md overflow-hidden relative shrink-0">
                    <Image src={post.cover_url} alt={post.title} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-md bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
                    <Heart className="h-5 w-5 text-[var(--color-text-muted)]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--color-text-primary)] dark:text-white truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-[var(--color-text-muted)]">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {formatDate(post.updated_at)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(post.id, post.published)}
                  disabled={togglingId === post.id}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-colors shrink-0 ${
                    post.published
                      ? 'bg-[var(--color-brand-teal)] text-white hover:opacity-80'
                      : 'bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  {togglingId === post.id ? '…' : post.published ? 'Published' : 'Draft'}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1.5 rounded-md hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors cursor-pointer shrink-0">
                    <MoreVertical size={16} className="text-[var(--color-text-muted)]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => router.push(`/admin/health-wellness/${post.id}`)}
                    >
                      <PenLine size={14} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                      onClick={() => setDeleteId(post.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
        title="Delete wellness post?"
        description="This action cannot be undone. The post will be permanently removed."
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
