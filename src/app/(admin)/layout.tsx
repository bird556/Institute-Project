import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return <>{children}</>;

  const { data: nameSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'admin_name')
    .single();
  const adminInitial = nameSetting?.value?.trim().charAt(0)?.toUpperCase() || 'A';

  return <AdminShell adminInitial={adminInitial}>{children}</AdminShell>;
}
