import { NavLink } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
  permission?: string;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Principal",
    items: [{ to: "/", label: "Dashboard", end: true }],
  },
  {
    label: "Contenu",
    items: [
      { to: "/pages", label: "Pages", permission: "content.page.read" },
      { to: "/menus", label: "Menus", permission: "navigation.menu.read" },
    ],
  },
  {
    label: "Système",
    items: [
      { to: "/settings", label: "Paramètres", permission: "settings.read" },
      { to: "/media", label: "Médias", permission: "media.read" },
      { to: "/users", label: "Utilisateurs", permission: "identity.user.read" },
      { to: "/audit", label: "Audit", permission: "audit.read" },
    ],
  },
];

export function Sidebar() {
  const { user, logout, hasPermission } = useAuth();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <div className="text-xs font-bold uppercase tracking-widest text-bloomar-violet">Bloomar</div>
        <div className="text-lg font-extrabold text-bloomar-navy dark:text-white">CMS</div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{group.label}</p>
            <ul className="space-y-1">
              {group.items
                .filter((item) => !item.permission || hasPermission(item.permission))
                .map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        [
                          "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                          isActive
                            ? "bg-violet-50 text-bloomar-violet dark:bg-violet-950/40"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
                        ].join(" ")
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <p className="text-sm font-semibold text-bloomar-navy dark:text-white">{user?.full_name}</p>
        <p className="text-xs text-slate-500">{user?.roles.join(", ")}</p>
        <button className="btn-secondary mt-3 w-full" onClick={() => logout()}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
