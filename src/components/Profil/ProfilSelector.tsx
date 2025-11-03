"use client";
import { generateProfilUrl, ProfilSectionValid } from "@/lib/misc.ts";
import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";

/**
 * Displays a horizontal selector for profile sections and updates the URL when a section is chosen.
 */
export default function ProfilSelector() {

  const searchParams = useSearchParams();

  const params = useParams();
  const username = params.username;
  if (username === undefined) {
    redirect("/error?message=Username is undefined");
  }

  const currentSection = searchParams.get("section") ?? "Home";

  const router = useRouter();

  return (
    <ScrollArea className="flex flex-row w-full place-items-end">
      <div className="flex flex-grow justify-start gap-2" id="profil-selector">
        {ProfilSectionValid.map((name, index) => (
          <div key={index}
            className={cn("flex flex-row bg-card rounded-t-md w-fit justify-center items-center mb-0 mt-3 p-2 cursor-pointer", currentSection === name ? "bg-primary border-card border-2 border-b-0" : "")}
            onClick={() => router.push(generateProfilUrl(username as string, name), { scroll: false })}
          >
            <div
              className={cn("font-mc text-primary text-3xl m-2 select-none", currentSection === name ? "text-primary-foreground" : "")}>{name}</div>
          </div>)
        )}
      </div>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  );
}
