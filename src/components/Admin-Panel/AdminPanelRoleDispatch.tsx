import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { getAllUsersLinked, getRole } from "@/lib/api/apiPalaTracker.ts";
import Image from "next/image";
import EditRole from "@/components/Admin-Panel/AdminPanelRoleEdition.tsx";

export async function AdminPanelRoleDispatch() {
  const role = await getRole();

  switch (role) {
    case "Admin":
      return <AdminPanelRoleAdmin/>;
    case "Moderator":
      return <AdminPanelRoleModerator/>;
    case "Bug Hunter":
      return <AdminPanelBugHunter/>;
    case "Beta Tester":
      return <AdminPanelBetaTester/>;
    case "Palatime":
      return <AdminPanelPalatime/>;
    default:
      return <AdminPanelRoleDefault/>;

  }
}

async function AdminPanelRoleAdmin() {
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
              <Image src={user.avatar} alt="profile picture" width={32} height={32} className="rounded-full"
                     unoptimized/>
              <div className="flex justify-start flex-row items-start gap-2">
                <p className="text-sm leading-5">{user.global_name || user.username}</p>
                {/*  <p style={{ backgroundColor:  getRoleColor(user.role)}}>{user.role}</p>*/}
              </div>
              <div className="w-fit">
                <EditRole defaultValue={user.role} discord_id={user.user_id}/>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function AdminPanelRoleModerator() {
  return (
    <Card>
      <CardHeader>
        <p>Moderator</p>
      </CardHeader>
      <CardContent>
        <p>Moderator content</p>
      </CardContent>
    </Card>
  )
}

function AdminPanelBugHunter() {
  return (
    <Card>
      <CardHeader>
        <p>Bug Hunter</p>
      </CardHeader>
      <CardContent>
        <p>Bug Hunter content</p>
      </CardContent>
    </Card>
  )
}

function AdminPanelBetaTester() {
  return (
    <Card>
      <CardHeader>
        <p>Beta Tester</p>
      </CardHeader>
      <CardContent>
        <p>Beta Tester content</p>
      </CardContent>
    </Card>
  )
}

function AdminPanelPalatime() {
  return (
    <Card>
      <CardHeader>
        <p>Palatime</p>
      </CardHeader>
      <CardContent>
        <p>Palatime content</p>
      </CardContent>
    </Card>
  )
}

function AdminPanelRoleDefault() {
  return (
    <Card>
      <CardHeader>
        <p>Your are not allowed to acces this page</p>
      </CardHeader>
    </Card>
  )
}

