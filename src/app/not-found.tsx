import { HeaderServer } from '@/components/layout/HeaderServer'
import { Footer } from '@/components/layout/Footer'
import { NotFoundContent } from '@/components/shared/NotFoundContent'

// Root-level fallback for URLs that don't match any route at all (typos,
// dead links). Route-group layouts (e.g. (public)/layout.tsx) don't wrap
// this file, so the header/footer are included directly to match.
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderServer />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </div>
  )
}
