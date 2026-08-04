import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { settingsApi } from "@/shared/lib/api";

const GROUPS = ["company", "contact", "social", "analytics", "theme"] as const;

function SettingsGroupForm({ group }: { group: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings", group],
    queryFn: () => settingsApi.getGroup(group),
  });
  const [draft, setDraft] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (settings: Record<string, unknown>) => settingsApi.updateGroup(group, settings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings", group] }),
  });

  if (isLoading || !data) return <div className="card p-4 text-sm text-slate-500">Chargement…</div>;

  const values = { ...data.settings, ...draft };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate(values);
  }

  return (
    <form className="card p-5" onSubmit={onSubmit}>
      <h3 className="font-bold capitalize text-bloomar-navy dark:text-white">{group}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {Object.entries(values).map(([key, value]) => (
          <label key={key} className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {key}
            <input
              className="input mt-1 font-normal"
              value={String(value ?? "")}
              onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
            />
          </label>
        ))}
      </div>
      <button className="btn-primary mt-4" type="submit" disabled={mutation.isPending}>
        Enregistrer
      </button>
    </form>
  );
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-bloomar-navy dark:text-white">Paramètres</h2>
        <p className="text-sm text-slate-500">Company · Contact · Social · Analytics · Theme</p>
      </div>
      {GROUPS.map((group) => (
        <SettingsGroupForm key={group} group={group} />
      ))}
    </div>
  );
}
