import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function PublicRoute() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === "authenticated") {
    const from =
      (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
      "/dashboard";

    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
