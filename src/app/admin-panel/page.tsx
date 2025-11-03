import React from "react";
import { constants } from "@/lib/constants.ts";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
import { AdminPanelRoleDispatch } from "@/components/Admin-Panel/AdminPanelRoleDispatch.tsx";

/**
 * Generate Metadata
 */
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

/**
 * [Admin page](https://palatracker.bromine.fr/admin-panel)
 */
export default async function AdminPanelPage() {
  return (
    <AuthForceWrapper url={`${constants.adminPanelPath}/login`}>
      <AdminPanelRoleDispatch/>
    </AuthForceWrapper>
  );
};
