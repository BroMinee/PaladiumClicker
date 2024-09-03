'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import constants from "@/lib/constants.ts";
import { useRouter } from "next/navigation";

type ImportProfilProps = {
  username: string | undefined;
}

export default function ImportPseudoPalaAnimation({ username }: ImportProfilProps) {
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const username = String(formData.get("pseudo"));
    router.push(`${constants.palaAnimationPath}?username=${username}`);

    // clear the input
    (event.target as HTMLFormElement).reset();
  }

  return (
    <div className="flex gap-2">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <Input
            type="text"
            id="pseudo"
            name="pseudo"
            className="bg-background"
            placeholder={username ?? "Entre ton pseudo"}
          />
          <Button
            id="pseudo-submit"
            type="submit"
            className="absolute right-0 top-0 text-foreground rounded-l-none border-none shadow-none"
            variant="ghost"
            size="icon"
          >
            <FaSearch/>
          </Button>
        </div>
      </form>
    </div>
  );
}