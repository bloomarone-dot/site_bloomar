import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { apiFetch, getAccessToken } from "@/shared/lib/api";
import { MediaPickerModal } from "@/shared/components/MediaPicker";

export type MediaItem = {
  id: number;
  uuid: string;
  original_filename: string;
  mime_type: string;
  url: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  dominant_color: string | null;
  status: string;
  folder: string;
  variants: { variant_name: string; url: string }[];
  tags: { name: string; slug: string }[];
};

const mediaLibraryApi = {
  search: (params: Record<string, string>) => {
    const q = new URLSearchParams(params);
    return apiFetch<{ data: MediaItem[]; total: number }>(`/api/v1/cms/media-library?${q}`);
  },
  folders: () => apiFetch<{ id: number; name: string; path: string }[]>("/api/v1/cms/media-library/folders/tree"),
  trash: (id: number) => apiFetch(`/api/v1/cms/media-library/${id}`, { method: "DELETE" }),
  restore: (id: number) => apiFetch(`/api/v1/cms/media-library/${id}/restore`, { method: "POST" }),
};

export function MediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("active");
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["media-library", query, status],
    queryFn: () =>
      mediaLibraryApi.search({
        page: "1",
        limit: "50",
        q: query,
        status,
        sort: "created_at",
        order: "desc",
      }),
  });

  const { data: folders } = useQuery({
    queryKey: ["media-folders"],
    queryFn: () => mediaLibraryApi.folders(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => mediaLibraryApi.trash(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media-library"] }),
  });

  const restoreMut = useMutation({
    mutationFn: (id: number) => mediaLibraryApi.restore(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media-library"] }),
  });

  const onUpload = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          const form = new FormData();
          form.append("file", file);
          await fetch("/api/v1/cms/media-library/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${getAccessToken()}` },
            body: form,
            credentials: "include",
          });
        }
        await refetch();
      } finally {
        setUploading(false);
      }
    },
    [refetch]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-bloomar-navy dark:text-white">Media Library</h2>
          <p className="text-sm text-slate-500">
            Dossiers · Tags · Collections · Variantes · {folders?.length ?? 0} dossiers racine
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={() => setPickerOpen(true)}>
            Media Picker
          </button>
          <label className="btn-primary cursor-pointer">
            {uploading ? "Upload…" : "Uploader"}
            <input type="file" className="hidden" multiple onChange={(e) => onUpload(e.target.files)} />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Recherche instantanée…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Actifs</option>
          <option value="trashed">Corbeille</option>
        </select>
        <button className={`btn-secondary ${view === "grid" ? "ring-2 ring-bloomar-violet" : ""}`} onClick={() => setView("grid")}>
          Grid
        </button>
        <button className={`btn-secondary ${view === "list" ? "ring-2 ring-bloomar-violet" : ""}`} onClick={() => setView("list")}>
          List
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Chargement…</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {data?.data.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              <div
                className="aspect-square bg-slate-100 dark:bg-slate-800"
                style={{ backgroundColor: item.dominant_color ?? undefined }}
              >
                {item.mime_type.startsWith("image/") && (
                  <img src={item.url} alt={item.original_filename} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-2 text-xs">
                <p className="truncate font-semibold">{item.original_filename}</p>
                <p className="text-slate-500">{Math.round(item.size_bytes / 1024)} KB</p>
                <div className="mt-2 flex gap-1">
                  {status === "active" ? (
                    <button className="text-red-500" onClick={() => deleteMut.mutate(item.id)}>
                      Supprimer
                    </button>
                  ) : (
                    <button className="text-bloomar-violet" onClick={() => restoreMut.mutate(item.id)}>
                      Restaurer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3">Fichier</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Dossier</th>
                <th className="px-4 py-3">Taille</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium">{item.original_filename}</td>
                  <td className="px-4 py-3">{item.mime_type}</td>
                  <td className="px-4 py-3">{item.folder}</td>
                  <td className="px-4 py-3">{Math.round(item.size_bytes / 1024)} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media) => {
          alert(`Sélectionné: ${media.original_filename} (${media.url})`);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
