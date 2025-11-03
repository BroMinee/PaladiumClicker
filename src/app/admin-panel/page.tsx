import React from "react";
import { constants } from "@/lib/constants.ts";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
import { AdminPanelRoleDispatch } from "@/components/Admin-Panel/AdminPanelRoleDispatch.tsx";

export async function generateMetadata() {
  const title = "PalaTracker | Admin Panel";
  const description = "Admin Panel";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

export default async function AdminPanelPage() {
  return (
    <AuthForceWrapper url={`${constants.adminPanelPath}/login`}>
      <AdminPanelRoleDispatch/>
    </AuthForceWrapper>
  );
};
