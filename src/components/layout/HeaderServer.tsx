import { getSiteSettings } from '@/actions/settings'
import { createClient } from '@/lib/supabase/server'
import { parseNavConfig } from '@/lib/nav-config'
import { Header } from './Header'

export async function HeaderServer() {
  const [{ data: settings }, supabase] = await Promise.all([
    getSiteSettings(),
    createClient(),
  ])

  const logoVisible = settings?.logo_visible !== 'false'
  const logoUrl = settings?.logo_path && logoVisible
    ? supabase.storage.from('institute-media').getPublicUrl(settings.logo_path).data.publicUrl
    : undefined
  const siteName = settings?.site_name || 'Institute'
  const navItems = parseNavConfig(settings?.nav_config)

  const showReferralAgencies          = settings?.referral_agencies_enabled          !== 'false'
  const showBlackMensGroups           = settings?.black_mens_groups_enabled          !== 'false'
  const showYouthServiceOrganizations = settings?.youth_service_organizations_enabled !== 'false'
  const showCommunityOrganizations    = settings?.community_organizations_enabled    !== 'false'
  const showResearchInstitutes        = settings?.research_institutes_enabled        !== 'false'
  const showCallForPapers             = settings?.call_for_papers_enabled            !== 'false'

  return (
    <Header
      navItems={navItems}
      logoUrl={logoUrl}
      siteName={siteName}
      showReferralAgencies={showReferralAgencies}
      showBlackMensGroups={showBlackMensGroups}
      showYouthServiceOrganizations={showYouthServiceOrganizations}
      showCommunityOrganizations={showCommunityOrganizations}
      showResearchInstitutes={showResearchInstitutes}
      showCallForPapers={showCallForPapers}
    />
  )
}
