import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/admin/AdminDashboard";
import type { Certificate, ContactMessage, Profile, Project } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let supabase;
  try {
    supabase = await createServerSupabaseClient();
  } catch {
    return (
      <main className="admin-setup">
        <div className="admin-setup__card">
          <span className="mono-label">Admin workspace / setup required</span>
          <h1>Supabase belum terhubung.</h1>
          <p>
            Tambahkan <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, dan <code>SUPABASE_SERVICE_ROLE_KEY</code> ke <code>.env.local</code>, lalu jalankan migration di folder <code>supabase/migrations</code>.
          </p>
          <Link className="button button--primary" href="/admin/login">Kembali ke login <span className="button__arrow">↗</span></Link>
        </div>
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const [profileResult, projectsResult, certificatesResult, messagesResult] = await Promise.all([
    supabase.from("profile").select("*").limit(1).maybeSingle(),
    supabase.from("projects").select("*").order("display_order", { ascending: true }),
    supabase.from("certificates").select("*").order("display_order", { ascending: true }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  return (
    <AdminDashboard
      email={user.email ?? ""}
      initialProfile={(profileResult.data as Profile | null) ?? null}
      initialProjects={(projectsResult.data as Project[] | null) ?? []}
      initialCertificates={(certificatesResult.data as Certificate[] | null) ?? []}
      initialMessages={(messagesResult.data as ContactMessage[] | null) ?? []}
    />
  );
}
