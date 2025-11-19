"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useUser from "@/components/hooks/use-user";

type AuthProviderProps = {
  children: React.ReactNode;
};

const DASHBOARD_ROUTE = "/dashboard";

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  const isDashboardRoute = pathname?.startsWith(DASHBOARD_ROUTE);

  useEffect(() => {
    if (!isDashboardRoute || isUserLoading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isDashboardRoute, isUserLoading, router, user]);

  return <>{children}</>;
};

export default AuthProvider;

