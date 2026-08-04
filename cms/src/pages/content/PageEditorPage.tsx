import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { contentApi, localizationApi, type Section } from "@/shared/lib/api";

function SectionEditor({ section, onChanged }: { section: Section; onChanged: () => void }) {
  const [contentJson, setContentJson] = useState(JSON.stringify(section.content, null, 2));

  const mutation = useMutation({
    mutationFn: () => {
      const parsed = JSON.parse(contentJson) as Record<string, unknown>;
      return contentApi.updateSection(section.id, { content: parsed });
    },
    onSuccess: onChanged,
  });

  const deleteMutation = useMutation({
    mutationFn: () => contentApi.deleteSection(section.id),
    onSuccess: onChanged,
  });

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-bloomar-violet">{section.section_type_slug}</span>
        <button className="text-xs text-red-500" onClick={() => deleteMutation.mutate()}>
          Supprimer
        </button>
      </div>
      <textarea
        className="input min-h-[120px] font-mono text-xs"
        value={contentJson}
        onChange={(e) => setContentJson(e.target.value)}
      />
      <button className="btn-secondary mt-2" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Enregistrer section
      </button>
    </div>
  );
}

export function PageEditorPage() {
  const { id } = useParams<{ id: string }>();
  const pageId = Number(id);
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transLocale, setTransLocale] = useState("en");
  const [transTitle, setTransTitle] = useState("");

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", pageId],
    queryFn: () => contentApi.getPage(pageId),
    enabled: Number.isFinite(pageId),
  });

  const { data: sectionTypes } = useQuery({
    queryKey: ["section-types"],
    queryFn: () => contentApi.sectionTypes(),
  });

  const { data: versions } = useQuery({
    queryKey: ["page-versions", pageId],
    queryFn: () => contentApi.versions(pageId),
    enabled: Number.isFinite(pageId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    queryClient.invalidateQueries({ queryKey: ["page-versions", pageId] });
    queryClient.invalidateQueries({ queryKey: ["pages"] });
  };

  const reviewMut = useMutation({ mutationFn: () => contentApi.submitReview(pageId), onSuccess: invalidate });
  const publishMut = useMutation({ mutationFn: () => contentApi.publish(pageId), onSuccess: invalidate });
  const archiveMut = useMutation({ mutationFn: () => contentApi.archive(pageId), onSuccess: invalidate });
  const draftMut = useMutation({ mutationFn: () => contentApi.returnDraft(pageId), onSuccess: invalidate });

  const addSectionMut = useMutation({
    mutationFn: (slug: string) => contentApi.createSection(pageId, { section_type_slug: slug, content: {} }),
    onSuccess: invalidate,
  });

  const previewMut = useMutation({
    mutationFn: () => contentApi.preview(pageId),
    onSuccess: (res) => setPreviewUrl(res.preview_url),
  });

  const rollbackMut = useMutation({
    mutationFn: (versionId: number) => contentApi.rollback(pageId, versionId),
    onSuccess: invalidate,
  });

  const transMut = useMutation({
    mutationFn: () =>
      localizationApi.upsertTranslations("page", pageId, [
        { field_key: "title", locale: transLocale, value: transTitle },
      ]),
  });

  function onMetaSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    contentApi
      .updatePage(pageId, {
        title: fd.get("title"),
        slug: fd.get("slug"),
        meta_title: fd.get("meta_title"),
        meta_description: fd.get("meta_description"),
      })
      .then(invalidate);
  }

  if (isLoading || !page) return <p className="text-sm text-slate-500">Chargement…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/pages" className="text-sm text-slate-500 hover:text-bloomar-violet">
          ← Pages
        </Link>
        <h2 className="text-2xl font-black text-bloomar-navy dark:text-white">{page.title}</h2>
        <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-bold text-bloomar-violet">{page.status}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={() => reviewMut.mutate()} disabled={page.status !== "draft"}>
          Soumettre en revue
        </button>
        <button className="btn-primary" onClick={() => publishMut.mutate()} disabled={page.status === "published"}>
          Publier
        </button>
        <button className="btn-secondary" onClick={() => draftMut.mutate()}>
          Repasser brouillon
        </button>
        <button className="btn-secondary" onClick={() => archiveMut.mutate()}>
          Archiver
        </button>
        <button className="btn-secondary" onClick={() => previewMut.mutate()}>
          Preview
        </button>
      </div>

      {previewUrl && (
        <div className="card p-4 text-sm">
          <p className="font-bold">Lien preview (brouillon uniquement)</p>
          <a className="break-all text-bloomar-violet hover:underline" href={previewUrl} target="_blank" rel="noreferrer">
            {previewUrl}
          </a>
        </div>
      )}

      <form className="card grid gap-3 p-5 md:grid-cols-2" onSubmit={onMetaSubmit}>
        <label className="text-sm font-semibold">
          Titre
          <input className="input mt-1" name="title" defaultValue={page.title} />
        </label>
        <label className="text-sm font-semibold">
          Slug
          <input className="input mt-1" name="slug" defaultValue={page.slug} />
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Meta title
          <input className="input mt-1" name="meta_title" defaultValue={page.meta_title ?? ""} />
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Meta description
          <textarea className="input mt-1" name="meta_description" defaultValue={page.meta_description ?? ""} />
        </label>
        <button className="btn-primary md:col-span-2" type="submit">
          Enregistrer métadonnées
        </button>
      </form>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-bloomar-navy dark:text-white">Sections</h3>
          <div className="flex flex-wrap gap-2">
            {sectionTypes?.map((st) => (
              <button key={st.slug} className="btn-secondary text-xs" onClick={() => addSectionMut.mutate(st.slug)}>
                + {st.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {page.sections.map((s) => (
            <SectionEditor key={s.id} section={s} onChanged={invalidate} />
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h3 className="mb-3 font-bold">Traductions</h3>
        <div className="flex flex-wrap gap-3">
          <select className="input w-auto" value={transLocale} onChange={(e) => setTransLocale(e.target.value)}>
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
          <input
            className="input flex-1"
            placeholder="Titre traduit"
            value={transTitle}
            onChange={(e) => setTransTitle(e.target.value)}
          />
          <button className="btn-primary" onClick={() => transMut.mutate()}>
            Enregistrer traduction
          </button>
        </div>
      </section>

      <section className="card p-5">
        <h3 className="mb-3 font-bold">Historique des versions</h3>
        <ul className="space-y-2 text-sm">
          {versions?.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800"
            >
              <span>
                v{v.version_number} — {v.status_at_creation} — {v.change_note ?? "—"}
              </span>
              <button className="text-xs font-bold text-bloomar-violet" onClick={() => rollbackMut.mutate(v.id)}>
                Rollback
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
