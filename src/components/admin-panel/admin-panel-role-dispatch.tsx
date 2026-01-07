import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllUsersLinked, getRole } from "@/lib/api/api-pala-tracker.server";
import { EditRole } from "@/components/admin-panel/admin-panel-role-edition.client";
import { Role } from "@/types";
import React from "react";
import { DiscordProfilPicture } from "../account/discord-profil-picture.client";

const mapPermission = new Map<Role, React.FC[]>(
  [
    ["Admin", [EditRolePanel, PalaAnimationPanel, ReportBugPanel, AccessBetaPanel]],
    ["Moderator", [PalaAnimationPanel]],
    ["Bug Hunter", [ReportBugPanel]],
    ["Beta Tester", [AccessBetaPanel]],
    ["Classic", [NotPermissionPanel]]
  ]);

/**
  * Renders the appropriate admin panel sections based on the current user's role.
  *
  * This function retrieves the user's role, determines which admin panel components
  * they are authorized to access, and displays them. If the role does not match any
  * known permissions, a fallback "no permission" panel is shown.
  *
  * Obviously to anyone wandering they are backend verification on every request :)
  */
export async function AdminPanelRoleDispatch() {
  const role = await getRole();

  const page = mapPermission.get(role) ?? [NotPermissionPanel];
  return <div className="flex flex-col gap-2">
    {page.map((Component, i) => <Component key={i}/>)}
  </div>;
}

async function EditRolePanel() {
  const allUsers = await getAllUsersLinked();

  return (
    <Card>
      <CardHeader>
        <p>Liste des utilisateurs</p>
      </CardHeader>
      <CardContent className="flex flex-col justify-start items-start gap-2">
        {allUsers.map((user, i) => {
          return (
            <div key={`user-${i}`} className="flex justify-center items-center space-x-2 w-grow">
              <DiscordProfilPicture/>
              <div className="flex justify-start flex-row items-start gap-2">
                <p className="text-sm leading-5">{user.global_name ?? user.username}</p>
                {/*  <p style={{ backgroundColor:  getRoleColor(user.role)}}>{user.role}</p>*/}
              </div>
              <div className="w-fit">
                <EditRole defaultValue={user.role} discord_id={user.user_id}/>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function PalaAnimationPanel() {
  return (
    <Card>
      <CardHeader>
        <p>PalaAnimation panel</p>
      </CardHeader>
      <CardContent>
        <p>Remove PalaAnimation individualy of all the answer of a user. Ask twice in both case</p>
      </CardContent>
    </Card>
  );
}

function ReportBugPanel() {
  return (
    <Card>
      <CardHeader>
        <p>Bug Hunter</p>
      </CardHeader>
      <CardContent>
        <p>Report a bug</p>
      </CardContent>
    </Card>
  );
}

function AccessBetaPanel() {
  return (
    <Card>
      <CardHeader>
        <p>Beta Panel</p>
      </CardHeader>
      <CardContent>
        <p>Link to the beta url</p>
      </CardContent>
    </Card>
  );
}

function NotPermissionPanel() {
  // TODO auto redirect to home page
  return (
    <Card>
      <CardHeader>
        <p>Your are not allowed to acces this page</p>
      </CardHeader>
    </Card>
  );
}
