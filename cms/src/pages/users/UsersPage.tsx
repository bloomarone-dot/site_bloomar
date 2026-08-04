import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/lib/api";

type UserItem = { id: number; email: string; full_name: string; roles: string[]; is_active: boolean };

export function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiFetch<UserItem[]>("/api/v1/cms/users"),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-bloomar-navy dark:text-white">Utilisateurs</h2>
      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôles</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="px-4 py-6" colSpan={3}>Chargement…</td></tr>
            ) : (
              data?.map((user) => (
                <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{user.full_name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.roles.join(", ")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
