'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, Heart } from 'lucide-react'
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
import { createWellnessPost, deleteWellnessPost } from '@/actions/wellness'
import { formatDate } from '@/lib/utils'
import type { WellnessPost } from '@/types'

type Filter = 'all' | 'published' | 'drafts'

interface WellnessListClientProps {
  posts: WellnessPost[]
}

export default function WellnessListClient({ posts: initial }: WellnessListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [posts, setPosts] = useState(initial)
  const [filter, setFilter] = useState<Filter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = posts.filter((p) => {
    if (filter === 'published') return p.published
    if (filter === 'drafts')    return !p.published
    return true
  })

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
          <Button onClick={handleNew} disabled={isPending} className="cursor-pointer gap-1.5">
            <Plus size={16} /> New Post
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {(['all', 'published', 'drafts'] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={filterBtnClass(filter === f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <Heart size={32} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
            <p className="text-[var(--color-text-muted)]">No posts yet.</p>
            <button onClick={handleNew} className="mt-3 text-sm text-[var(--color-brand-teal)] hover:underline cursor-pointer">
              Create your first post →
            </button>
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
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] px-4 py-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[var(--color-text-primary)] dark:text-white truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant={post.published ? 'default' : 'secondary'} className="text-xs">
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
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
                </div>

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
