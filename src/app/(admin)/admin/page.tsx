import { createClient } from '@/lib/supabase/server';
import LoginForm from '@/components/admin/LoginForm';
import DashboardOverview from '@/components/admin/DashboardOverview';
import { getDashboardData } from '@/actions/dashboard';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return <LoginForm />;

  const data = await getDashboardData();
  return <DashboardOverview data={data} />;
}
