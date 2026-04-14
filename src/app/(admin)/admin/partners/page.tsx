import { getAdminPartners } from '@/actions/partners'
import PartnersClient from './PartnersClient'

export default async function PartnersPage() {
  const { data: partners = [] } = await getAdminPartners()
  return <PartnersClient partners={partners} />
}
