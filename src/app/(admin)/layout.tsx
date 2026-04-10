export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark-background">
      {children}
    </div>
  )
}
