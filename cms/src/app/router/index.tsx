import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { AppLayout } from "@/app/layouts/AppLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { PageEditorPage } from "@/pages/content/PageEditorPage";
import { PagesListPage } from "@/pages/content/PagesListPage";
import { AuditPage } from "@/pages/audit/AuditPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { MediaPage } from "@/pages/media/MediaPage";
import { MenusPage } from "@/pages/navigation/MenusPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { UsersPage } from "@/pages/users/UsersPage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorBoundary><div className="p-8">Erreur</div></ErrorBoundary>,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "pages", element: <PagesListPage /> },
          { path: "pages/:id", element: <PageEditorPage /> },
          { path: "menus", element: <MenusPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "media", element: <MediaPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "audit", element: <AuditPage /> },
          { path: "*", element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
