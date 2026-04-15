import { HeaderServer } from '@/components/layout/HeaderServer'
import { Footer } from '@/components/layout/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderServer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
