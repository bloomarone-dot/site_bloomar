const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code = "ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.error?.message ?? `HTTP ${response.status}`;
    const code = payload?.error?.code ?? "HTTP_ERROR";
    throw new ApiError(message, response.status, code);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type User = {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: string[];
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
  permissions: string[];
};

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => apiFetch<{ user: User; permissions: string[] }>("/api/v1/auth/me"),
  logout: () => apiFetch<{ success: boolean }>("/api/v1/auth/logout", { method: "POST" }),
  refresh: () => apiFetch<AuthResponse>("/api/v1/auth/refresh", { method: "POST" }),
};

export const settingsApi = {
  groups: () => apiFetch<string[]>("/api/v1/cms/settings"),
  getGroup: (group: string) =>
    apiFetch<{ group: string; settings: Record<string, unknown> }>(`/api/v1/cms/settings/${group}`),
  updateGroup: (group: string, settings: Record<string, unknown>) =>
    apiFetch<{ group: string; settings: Record<string, unknown> }>(`/api/v1/cms/settings/${group}`, {
      method: "PATCH",
      body: JSON.stringify({ settings }),
    }),
};

export type PageSummary = {
  id: number;
  slug: string;
  locale: string;
  title: string;
  status: string;
  template: string;
  updated_at: string | null;
};

export type Section = {
  id: number;
  section_type_slug: string;
  sort_order: number;
  content: Record<string, unknown>;
  is_visible: boolean;
  locale: string;
};

export type PageDetail = PageSummary & {
  meta_title: string | null;
  meta_description: string | null;
  published_version_id: number | null;
  sections: Section[];
};

export type Paginated<T> = { data: T[]; page: number; limit: number; total: number };

export const contentApi = {
  listPages: (params?: { locale?: string; status?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.locale) q.set("locale", params.locale);
    if (params?.status) q.set("status", params.status);
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    return apiFetch<Paginated<PageSummary>>(`/api/v1/cms/content/pages?${q}`);
  },
  getPage: (id: number) => apiFetch<PageDetail>(`/api/v1/cms/content/pages/${id}`),
  createPage: (body: { slug: string; locale: string; title: string; template?: string }) =>
    apiFetch<PageDetail>("/api/v1/cms/content/pages", { method: "POST", body: JSON.stringify(body) }),
  updatePage: (id: number, body: Record<string, unknown>) =>
    apiFetch<PageDetail>(`/api/v1/cms/content/pages/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deletePage: (id: number) =>
    apiFetch<{ success: boolean }>(`/api/v1/cms/content/pages/${id}`, { method: "DELETE" }),
  sectionTypes: () => apiFetch<{ slug: string; name: string; description: string | null; icon: string | null }[]>(
    "/api/v1/cms/content/section-types"
  ),
  createSection: (pageId: number, body: Record<string, unknown>) =>
    apiFetch<Section>(`/api/v1/cms/content/pages/${pageId}/sections`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateSection: (sectionId: number, body: Record<string, unknown>) =>
    apiFetch<Section>(`/api/v1/cms/content/sections/${sectionId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteSection: (sectionId: number) =>
    apiFetch<{ success: boolean }>(`/api/v1/cms/content/sections/${sectionId}`, { method: "DELETE" }),
  reorderSections: (pageId: number, ordered_ids: number[]) =>
    apiFetch<Section[]>(`/api/v1/cms/content/pages/${pageId}/sections/reorder`, {
      method: "PUT",
      body: JSON.stringify({ ordered_ids }),
    }),
  submitReview: (pageId: number, note?: string) =>
    apiFetch<PageDetail>(`/api/v1/cms/content/pages/${pageId}/submit-review`, {
      method: "POST",
      body: JSON.stringify({ note }),
    }),
  publish: (pageId: number, note?: string) =>
    apiFetch<PageDetail>(`/api/v1/cms/content/pages/${pageId}/publish`, {
      method: "POST",
      body: JSON.stringify({ note }),
    }),
  archive: (pageId: number) =>
    apiFetch<PageDetail>(`/api/v1/cms/content/pages/${pageId}/archive`, { method: "POST" }),
  returnDraft: (pageId: number) =>
    apiFetch<PageDetail>(`/api/v1/cms/content/pages/${pageId}/draft`, { method: "POST" }),
  rollback: (pageId: number, versionId: number) =>
    apiFetch<PageDetail>(`/api/v1/cms/content/pages/${pageId}/rollback/${versionId}`, { method: "POST" }),
  versions: (pageId: number) =>
    apiFetch<
      {
        id: number;
        version_number: number;
        status_at_creation: string;
        change_note: string | null;
        created_at: string;
      }[]
    >(`/api/v1/cms/content/pages/${pageId}/versions`),
  preview: (pageId: number) =>
    apiFetch<{ token: string; expires_at: string; preview_url: string }>(
      `/api/v1/cms/content/pages/${pageId}/preview`,
      { method: "POST", body: JSON.stringify({}) }
    ),
};

export type MenuItem = {
  id: number;
  label: string;
  url: string;
  sort_order: number;
  is_external: boolean;
  children?: MenuItem[];
};

export type Menu = {
  id: number;
  slug: string;
  name: string;
  locale: string;
  items: MenuItem[];
};

export const navigationApi = {
  listMenus: (locale?: string) => {
    const q = locale ? `?locale=${locale}` : "";
    return apiFetch<Menu[]>(`/api/v1/cms/navigation/menus${q}`);
  },
  getMenu: (slug: string, locale = "fr") =>
    apiFetch<Menu>(`/api/v1/cms/navigation/menus/${slug}?locale=${locale}`),
  createItem: (menuId: number, body: Record<string, unknown>) =>
    apiFetch<MenuItem>(`/api/v1/cms/navigation/menus/${menuId}/items`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateItem: (itemId: number, body: Record<string, unknown>) =>
    apiFetch<MenuItem>(`/api/v1/cms/navigation/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteItem: (itemId: number) =>
    apiFetch<{ success: boolean }>(`/api/v1/cms/navigation/items/${itemId}`, { method: "DELETE" }),
  reorderItems: (menuId: number, ordered_ids: number[]) =>
    apiFetch<MenuItem[]>(`/api/v1/cms/navigation/menus/${menuId}/items/reorder`, {
      method: "PUT",
      body: JSON.stringify({ ordered_ids }),
    }),
};

export const localizationApi = {
  locales: () => apiFetch<{ code: string; name: string; is_default: boolean }[]>("/api/v1/cms/localization/locales"),
  getTranslations: (entityType: string, entityId: number, locale?: string) => {
    const q = locale ? `?locale=${locale}` : "";
    return apiFetch<{ field_key: string; locale: string; value: string }[]>(
      `/api/v1/cms/localization/translations/${entityType}/${entityId}${q}`
    );
  },
  upsertTranslations: (
    entityType: string,
    entityId: number,
    translations: { field_key: string; locale: string; value: string }[]
  ) =>
    apiFetch(`/api/v1/cms/localization/translations/${entityType}/${entityId}`, {
      method: "PUT",
      body: JSON.stringify({ translations }),
    }),
};
