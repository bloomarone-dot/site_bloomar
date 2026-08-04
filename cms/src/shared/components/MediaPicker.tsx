import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/lib/api";
import type { MediaItem } from "@/pages/media/MediaPage";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  mimeFilter?: string;
};

export function MediaPickerModal({ open, onClose, onSelect, mimeFilter }: Props) {
  const { data } = useQuery({
    queryKey: ["media-picker"],
    queryFn: () =>
      apiFetch<{ data: MediaItem[] }>("/api/v1/cms/media-library?page=1&limit=50&sort=created_at&order=desc"),
    enabled: open,
  });

  if (!open) return null;

  const items = (data?.data ?? []).filter((m) => !mimeFilter || m.mime_type.startsWith(mimeFilter));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <h3 className="font-bold text-bloomar-navy dark:text-white">Media Picker</h3>
          <button className="btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto p-4 md:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="overflow-hidden rounded-lg border border-slate-200 text-left hover:ring-2 hover:ring-bloomar-violet dark:border-slate-700"
              onClick={() => onSelect(item)}
            >
              {item.mime_type.startsWith("image/") ? (
                <img src={item.url} alt="" className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-slate-100 text-xs dark:bg-slate-800">
                  {item.mime_type}
                </div>
              )}
              <p className="truncate p-2 text-xs font-semibold">{item.original_filename}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediaPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      {value ? (
        <div className="flex items-center gap-3">
          {value.mime_type.startsWith("image/") && (
            <img src={value.url} alt="" className="h-16 w-16 rounded object-cover" />
          )}
          <span className="text-sm">{value.original_filename}</span>
          <button className="btn-secondary text-xs" onClick={() => onChange(null)}>
            Retirer
          </button>
          <button className="btn-secondary text-xs" onClick={() => setOpen(true)}>
            Changer
          </button>
        </div>
      ) : (
        <button className="btn-secondary" onClick={() => setOpen(true)}>
          Choisir un média
        </button>
      )}
      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(m) => {
          onChange(m);
          setOpen(false);
        }}
      />
    </div>
  );
}
