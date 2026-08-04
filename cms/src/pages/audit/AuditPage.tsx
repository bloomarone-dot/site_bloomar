import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/lib/api";

export function AuditPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["audit"],
    queryFn: () => apiFetch<{ data: Array<{ id: number; action: string; created_at: string }> }>("/api/v1/cms/audit?page=1&limit=25"),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-bloomar-navy dark:text-white">Audit</h2>
      <div className="card p-4 text-sm text-slate-500">
        {isLoading ? "Chargement…" : `${data?.data.length ?? 0} entrées (Sprint 0 — logging minimal à enrichir)`}
      </div>
    </div>
  );
}
