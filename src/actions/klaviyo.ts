'use server'

interface SignupPayload {
  email: string
  fullName?: string
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim()
  const spaceIndex = trimmed.indexOf(' ')
  if (spaceIndex === -1) return { firstName: trimmed, lastName: '' }
  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1).trim(),
  }
}

const KLAVIYO_HEADERS = (apiKey: string) => ({
  Authorization: `Klaviyo-API-Key ${apiKey}`,
  'Content-Type': 'application/json',
  revision: '2024-02-15',
})

// Upserts the profile name — creates if new, patches if existing
async function upsertProfileName(
  email: string,
  firstName: string,
  lastName: string,
  apiKey: string,
) {
  const attrs: Record<string, string> = { email }
  if (firstName) attrs.first_name = firstName
  if (lastName)  attrs.last_name  = lastName

  const createRes = await fetch('https://a.klaviyo.com/api/profiles/', {
    method: 'POST',
    headers: KLAVIYO_HEADERS(apiKey),
    body: JSON.stringify({ data: { type: 'profile', attributes: attrs } }),
  })

  if (createRes.status === 409) {
    const json = await createRes.json().catch(() => null)
    const existingId = json?.errors?.[0]?.meta?.duplicate_profile_id
    if (!existingId) return

    await fetch(`https://a.klaviyo.com/api/profiles/${existingId}/`, {
      method: 'PATCH',
      headers: KLAVIYO_HEADERS(apiKey),
      body: JSON.stringify({
        data: { type: 'profile', id: existingId, attributes: { first_name: firstName, last_name: lastName } },
      }),
    })
  }
}

export async function subscribeToKlaviyo(
  payload: SignupPayload,
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (!apiKey || !listId) {
    return { success: false, error: 'Newsletter service is not configured.' }
  }

  const email = payload.email.trim().toLowerCase()
  const { firstName, lastName } = payload.fullName
    ? splitName(toTitleCase(payload.fullName))
    : { firstName: '', lastName: '' }

  // Step 1: Subscribe to list (name fields not accepted by this endpoint)
  const res = await fetch(
    'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
    {
      method: 'POST',
      headers: KLAVIYO_HEADERS(apiKey),
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [{
                type: 'profile',
                attributes: {
                  email,
                  subscriptions: {
                    email: { marketing: { consent: 'SUBSCRIBED' } },
                  },
                },
              }],
            },
          },
          relationships: {
            list: { data: { type: 'list', id: listId } },
          },
        },
      }),
    },
  )

  if (res.status !== 202) {
    const json = await res.json().catch(() => null)
    const message = json?.errors?.[0]?.detail ?? `Klaviyo returned status ${res.status}`
    return { success: false, error: message }
  }

  // Step 2: Upsert profile with name (fire-and-forget, doesn't block success)
  if (firstName || lastName) {
    upsertProfileName(email, firstName, lastName, apiKey).catch(() => null)
  }

  return { success: true }
}

export async function getKlaviyoListStats(): Promise<{
  success: boolean
  name?: string
  profileCount?: number | null
  listUrl?: string
  error?: string
}> {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (!apiKey || !listId) {
    return { success: false, error: 'Newsletter service is not configured.' }
  }

  const res = await fetch(
    `https://a.klaviyo.com/api/lists/${listId}/?additional-fields[list]=profile_count`,
    {
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: '2024-02-15',
      },
      next: { revalidate: 300 },
    },
  )

  if (!res.ok) {
    return { success: false, error: `Klaviyo returned status ${res.status}` }
  }

  const json = await res.json().catch(() => null)
  const attrs = json?.data?.attributes ?? {}

  return {
    success: true,
    name: attrs.name ?? '',
    profileCount: attrs.profile_count ?? null,
    listUrl: `https://www.klaviyo.com/list/${listId}`,
  }
}
