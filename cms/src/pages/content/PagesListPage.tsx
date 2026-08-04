import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import { contentApi } from "@/shared/lib/api";

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  review: "En revue",
  published: "Publié",
  archived: "Archivé",
};

export function PagesListPage() {
  const [locale, setLocale] = useState("fr");
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pages", locale, status],
    queryFn: () => contentApi.listPages({ locale, status: status || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      contentApi.createPage({
        slug: `page-${Date.now()}`,
        locale,
        title: "Nouvelle page",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pages"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-bloomar-navy dark:text-white">Pages</h2>
          <p className="text-sm text-slate-500">Gestion du contenu éditorial</p>
        </div>
        <button className="btn-primary" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
          + Nouvelle page
        </button>
      </div>

      <div className="flex gap-3">
        <select className="input w-auto" value={locale} onChange={(e) => setLocale(e.target.value)}>
          <option value="fr">FR</option>
          <option value="en">EN</option>
        </select>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Titre</th>
                <th className="px-4 py-3 text-left font-bold">Slug</th>
                <th className="px-4 py-3 text-left font-bold">Locale</th>
                <th className="px-4 py-3 text-left font-bold">Statut</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((page) => (
                <tr key={page.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold">{page.title}</td>
                  <td className="px-4 py-3 text-slate-500">{page.slug}</td>
                  <td className="px-4 py-3 uppercase">{page.locale}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-bold text-bloomar-violet dark:bg-violet-950/40">
                      {STATUS_LABELS[page.status] ?? page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link className="text-bloomar-violet font-semibold hover:underline" to={`/pages/${page.id}`}>
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
