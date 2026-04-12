import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import DashboardOverview from '@/components/admin/DashboardOverview';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <LoginForm />;
  }

  return <DashboardOverview />;
}
