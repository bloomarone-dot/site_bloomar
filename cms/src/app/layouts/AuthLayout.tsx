import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bloomar-navy via-[#151d45] to-[#2a1460]">
      <Outlet />
    </div>
  );
}
