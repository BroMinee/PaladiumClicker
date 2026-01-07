import React from "react";
import { constants } from "@/lib/constants";
import { AuthForceWrapper } from "@/components/auth/auth-force-wrapper.server";
import { AdminPanelRoleDispatch } from "@/components/admin-panel/admin-panel-role-dispatch";

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
