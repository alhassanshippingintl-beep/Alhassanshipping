import { createFileRoute, Link, Navigate, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, MessageSquare, PackagePlus } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { setStaffToken } from "@/lib/staff";
import { getStaffSession, staffLogout } from "@/lib/staff.fn";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const LINKS = [
  { to: "/admin", label: "الشحنات", icon: LayoutDashboard },
  { to: "/admin/new", label: "شحنة جديدة", icon: PackagePlus },
  { to: "/admin/inquiries", label: "الطلبات", icon: MessageSquare },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = useQuery({
    queryKey: ["staff-session"],
    queryFn: () => getStaffSession(),
    retry: false,
  });

  if (session.isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-line" />
      </div>
    );
  }
  if (!session.data?.ok) return <Navigate to="/login" />;

  async function onLogout() {
    try {
      await staffLogout();
    } catch {
      /* still clear */
    }
    setStaffToken(null);
    await navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Logo compact />
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {LINKS.map((l) => {
              const active = l.to === "/admin" ? pathname === "/admin" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold whitespace-nowrap",
                    active ? "bg-brand text-on-navy" : "text-navy hover:bg-paper",
                  )}
                >
                  <l.icon className="size-4" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden text-xs font-bold text-muted hover:text-brand sm:inline">
              عرض الموقع
            </Link>
            <span className="hidden text-sm font-bold sm:inline">{session.data.user}</span>
            <Button type="button" size="sm" variant="ghost" onClick={() => void onLogout()}>
              خروج
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
