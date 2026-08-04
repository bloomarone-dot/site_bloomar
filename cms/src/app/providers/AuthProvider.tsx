import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, setAccessToken, type User } from "@/shared/lib/api";

type AuthContextValue = {
  user: User | null;
  permissions: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (code: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const refreshed = await authApi.refresh();
        setAccessToken(refreshed.access_token);
        setUser(refreshed.user);
        setPermissions(refreshed.permissions);
      } catch {
        setAccessToken(null);
        setUser(null);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      permissions,
      loading,
      login: async (email, password) => {
        const data = await authApi.login(email, password);
        setAccessToken(data.access_token);
        setUser(data.user);
        setPermissions(data.permissions);
      },
      logout: async () => {
        await authApi.logout();
        setAccessToken(null);
        setUser(null);
        setPermissions([]);
      },
      hasPermission: (code) => permissions.includes(code) || user?.roles.includes("super_admin") === true,
    }),
    [user, permissions, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
