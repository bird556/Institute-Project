import { HeaderServer } from '@/components/layout/HeaderServer'
import { Footer } from '@/components/layout/Footer'
import { KlaviyoOnsiteScript } from '@/components/shared/KlaviyoOnsiteScript'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <KlaviyoOnsiteScript />
      <HeaderServer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
