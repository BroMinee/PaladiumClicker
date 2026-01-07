"use client";
import { Role } from "@/types";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { getRoleColor } from "@/lib/misc";
import { editRoleSubmit } from "@/lib/api/api-server-action.server";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Component to edit a user role.
 * @param defaultValue - Current user role.
 * @param discord_id - Discord user id.
 */
export function EditRole({ defaultValue, discord_id }: { defaultValue: Role, discord_id: string }) {

  const [role, setRole] = useState<Role>(defaultValue);
  const [isPending, setIsPending] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const role: Role = String(formData.get("role")) as Role;

    setIsPending(true);

    editRoleSubmit(discord_id, role).then(() => {
      toast.info("Role updated");
      setIsPending(false);
    }).catch(() => {
      toast.error(`Error while updating role for ${discord_id}`);
      setIsPending(false);
    });
  }

  return (<form className="max-w-sm mx-auto flex flex-row gap-2 items-center" onSubmit={handleSubmit}>
    <select id="role"
      name="role"
      defaultValue={defaultValue}
      onChange={(event) => setRole(event.target.value as Role)}
      className={"bg-gray-50 border border-secondary-foreground text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-card-foreground dark: dark:focus:ring-blue-500 dark:focus:border-blue-500"}
      style={{ backgroundColor:  getRoleColor(role) }}
    >
      {
        ["Admin", "Bug Hunter", "Beta Tester", "Palatime", "Classic"].map((role, index) => {
          return <option key={index} value={role} selected={role === defaultValue}>{role}</option>;
        })
      }
    </select>
    <Button type="submit">Submit</Button>
    {isPending && <LoadingSpinner/>}
  </form>
  );
}