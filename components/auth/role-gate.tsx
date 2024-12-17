"use client";

import { UserRole } from "@prisma/client";

import { useCurrentRole } from "@/hooks/auth/use-current-role";
import { FormError } from "@/components/auth/form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({
  children,
  allowedRole,
}: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="您无权查看此内容!" />
    )
  }

  return (
    <>
      {children}
    </>
  );
};
