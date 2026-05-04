'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, FileText, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createBlog, deleteBlog } from '@/actions/blogs'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'

type StatusFilter = 'all' | 'published' | 'drafts'

interface BlogListClientProps {
  blogs: BlogPost[]
}

export default function BlogListClient({ blogs: initial }: BlogListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [blogs, setBlogs] = useState(initial)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = blogs.filter((b) => {
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      b.title.toLowerCase().includes(q) ||
      (b.excerpt ?? '').toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && b.published) ||
      (statusFilter === 'drafts' && !b.published)
    return matchesQuery && matchesStatus
  })

  const isFiltering = query !== '' || statusFilter !== 'all'

  async function handleNew() {
    startTransition(async () => {
      const result = await createBlog()
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create post.')
        return
      }
      router.push(`/admin/blogs/${result.data.id}`)
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteBlog(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Could not delete post.')
      return
    }
    setBlogs((prev) => prev.filter((b) => b.id !== deleteId))
    toast.success('Blog post deleted.')
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
            Blog Posts
          </h1>
          <Button
            onClick={handleNew}
            disabled={isPending}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Post
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
        </div>

        {/* Result count */}
        {isFiltering && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {filtered.length} of {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
          </p>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState isFiltering={isFiltering} query={query} onClear={() => { setQuery(''); setStatusFilter('all') }} onNew={handleNew} creating={isPending} />
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
              >
                <div className="h-10 w-10 rounded-md bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-[var(--color-text-muted)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
                    {post.title}
                  </p>
                  {post.excerpt && (
                    <p className="text-sm text-[var(--color-text-muted)] truncate mt-0.5">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <Badge
                  variant={post.published ? 'default' : 'secondary'}
                  className={post.published ? 'bg-[var(--color-brand-teal)] text-white shrink-0' : 'shrink-0'}
                >
                  {post.published ? 'Published' : 'Draft'}
                </Badge>

                <span className="text-sm text-[var(--color-text-muted)] shrink-0 hidden sm:block">
                  {formatDate(post.published_at || post.created_at)}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/blogs/${post.id}`)} className="cursor-pointer gap-2">
                      <PenLine className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteId(post.id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Blog Post"
        description="This action cannot be undone. The post will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}

function EmptyState({
  isFiltering,
  query,
  onClear,
  onNew,
  creating,
}: {
  isFiltering: boolean
  query: string
  onClear: () => void
  onNew: () => void
  creating: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
      <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center">
        <FileText className="h-6 w-6 text-[var(--color-text-muted)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
          {isFiltering ? `No results${query ? ` for "${query}"` : ''}` : 'No blog posts yet'}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {isFiltering ? 'Try a different search or clear the filters.' : 'Create your first post to get started.'}
        </p>
      </div>
      {isFiltering ? (
        <Button variant="ghost" onClick={onClear} className="cursor-pointer text-[var(--color-brand-teal)]">
          Clear filters
        </Button>
      ) : (
        <Button
          onClick={onNew}
          disabled={creating}
          className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create your first post
        </Button>
      )}
    </div>
  )
}
