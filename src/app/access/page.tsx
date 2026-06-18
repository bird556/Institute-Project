import AccessGateForm from '@/components/shared/AccessGateForm'

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  return <AccessGateForm next={next} />
}
