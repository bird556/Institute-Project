// TODO: Re-enable session check once Supabase is wired up
// import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Replace with real session check
  // const supabase = await createClient();
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) return <>{children}</>;

  return <AdminShell>{children}</AdminShell>;
}
