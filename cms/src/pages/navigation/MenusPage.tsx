import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { navigationApi, type MenuItem } from "@/shared/lib/api";

const MENU_SLUGS = [
  { slug: "header", label: "Header" },
  { slug: "footer", label: "Footer" },
  { slug: "mobile", label: "Menu mobile" },
];

function flattenItems(items: MenuItem[]): MenuItem[] {
  const out: MenuItem[] = [];
  for (const item of items) {
    out.push(item);
    if (item.children?.length) out.push(...flattenItems(item.children));
  }
  return out;
}

export function MenusPage() {
  const [locale, setLocale] = useState("fr");
  const [activeSlug, setActiveSlug] = useState("header");
  const [dragId, setDragId] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: menus } = useQuery({
    queryKey: ["menus", locale],
    queryFn: () => navigationApi.listMenus(locale),
  });

  const activeMenu = menus?.find((m) => m.slug === activeSlug);
  const flatItems = activeMenu ? flattenItems(activeMenu.items) : [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["menus", locale] });

  const createMut = useMutation({
    mutationFn: () =>
      navigationApi.createItem(activeMenu!.id, { label: newLabel, url: newUrl, is_external: false }),
    onSuccess: () => {
      setNewLabel("");
      setNewUrl("");
      invalidate();
    },
  });

  const reorderMut = useMutation({
    mutationFn: (ordered_ids: number[]) => navigationApi.reorderItems(activeMenu!.id, ordered_ids),
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => navigationApi.deleteItem(id),
    onSuccess: invalidate,
  });

  function onDrop(targetId: number) {
    if (dragId === null || dragId === targetId) return;
    const ids = flatItems.map((i) => i.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(from, 1);
    ids.splice(to, 0, dragId);
    reorderMut.mutate(ids);
    setDragId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-bloomar-navy dark:text-white">Menus</h2>
        <p className="text-sm text-slate-500">Header · Footer · Mobile</p>
      </div>

      <select className="input w-auto" value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="fr">FR</option>
        <option value="en">EN</option>
      </select>

      <div className="flex gap-2">
        {MENU_SLUGS.map((m) => (
          <button
            key={m.slug}
            className={activeSlug === m.slug ? "btn-primary" : "btn-secondary"}
            onClick={() => setActiveSlug(m.slug)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="card p-5">
        <ul className="space-y-2">
          {flatItems.map((item) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => setDragId(item.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(item.id)}
              className="flex cursor-grab items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
            >
              <span>
                {item.label} — <span className="text-slate-500">{item.url}</span>
              </span>
              <button className="text-xs text-red-500" onClick={() => deleteMut.mutate(item.id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          <input className="input flex-1" placeholder="Label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <input className="input flex-1" placeholder="/url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
          <button className="btn-primary" onClick={() => createMut.mutate()} disabled={!newLabel || !newUrl}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
