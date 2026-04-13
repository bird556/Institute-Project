// TODO: Re-enable auth check once Supabase is wired up
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import LoginForm from '@/components/admin/LoginForm';
import DashboardOverview from '@/components/admin/DashboardOverview';

export default async function AdminPage() {
  // TODO: Replace with real session check
  // const cookieStore = await cookies();
  // const supabase = createServerClient(...)
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) return <LoginForm />;

  return <DashboardOverview />;
}
