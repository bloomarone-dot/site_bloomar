/**
 * Bloomar Public Content Loader — Sprint 1
 * Charge le contenu publié depuis l'API CMS. Fallback HTML statique si 404.
 */
(function () {
  const API_BASE =
    document.querySelector('meta[name="api-base"]')?.getAttribute("content")?.trim() ||
    (window.location.port === "5173" ? "http://127.0.0.1:8000" : "");

  function getLocale() {
    return document.documentElement.lang?.slice(0, 2) || "fr";
  }

  function getSlug() {
    const mount = document.getElementById("cms-page-content");
    if (mount?.dataset.cmsSlug) return mount.dataset.cmsSlug;
    return document.body.dataset.page || "";
  }

  function renderHero(section) {
    const c = section.content || {};
    return `
      <section class="page-hero page-hero--image page-hero--about text-white">
        <div class="page-hero__overlay page-hero__overlay--dark" aria-hidden="true"></div>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          ${c.badge ? `<span class="section-badge">${c.badge}</span>` : ""}
          ${c.title ? `<h1 class="page-hero__title mt-4 mb-4 text-white">${c.title}</h1>` : ""}
          ${c.subtitle ? `<p class="text-slate-200 leading-relaxed max-w-2xl mx-auto">${c.subtitle}</p>` : ""}
        </div>
      </section>`;
  }

  function renderRichText(section) {
    const html = section.content?.html || "";
    return `
      <section class="section-shell bg-white">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 text-sm text-slate-600 leading-relaxed cms-rich-text">
          ${html}
        </div>
      </section>`;
  }

  function renderSection(section) {
    switch (section.section_type_slug) {
      case "hero":
        return renderHero(section);
      case "rich_text":
        return renderRichText(section);
      default:
        return `<section class="section-shell"><pre class="text-xs">${JSON.stringify(section.content)}</pre></section>`;
    }
  }

  function renderPage(page) {
    if (page.meta_title) document.title = page.meta_title;
    const mount = document.getElementById("cms-page-content");
    if (!mount) return;
    mount.innerHTML = page.sections.map(renderSection).join("");
    const fallback = document.getElementById("cms-static-fallback");
    if (fallback) fallback.style.display = "none";
    mount.style.display = "block";
    document.dispatchEvent(new CustomEvent("cmsContentLoaded", { detail: page }));
  }

  async function loadPage() {
    const slug = getSlug();
    const mount = document.getElementById("cms-page-content");
    if (!slug || !mount) return;

    const locale = getLocale();
    const url = `${API_BASE}/api/v1/public/pages/${encodeURIComponent(slug)}?locale=${locale}`;

    try {
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (response.status === 304 || !response.ok) return;
      const page = await response.json();
      if (page && page.sections) renderPage(page);
    } catch (err) {
      console.warn("[Bloomar CMS] Contenu statique conservé:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPage);
  } else {
    loadPage();
  }

  window.BloomarPublicContent = { loadPage, renderPage };
})();
