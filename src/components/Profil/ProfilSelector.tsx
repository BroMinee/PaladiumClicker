'use client';
import { useState } from "react";
import { generateProfilUrl, ProfilSectionValid } from "@/lib/misc.ts";
import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils.ts";


export default function ProfilSelector() {

  const searchParams = useSearchParams();
  const [selected] = useState(0);

  const params = useParams();
  const username = params.username;
  if (username === undefined) {
    redirect("/error?message=Username is undefined");
  }

  const currentSection = searchParams.get("section") || "Home";


  const router = useRouter();

  const allSelector = ProfilSectionValid;
  const displaySelector = allSelector.slice(selected, Math.min(allSelector.length, selected + 4));

  return (
    <div className="flex flex-row w-full place-items-end overflow-x-scroll">
      <div className="flex flex-grow justify-start gap-2">
        {displaySelector.map((name, index) => (
          <div key={index}
               className={cn("flex flex-row bg-card rounded-t-md w-fit justify-center items-center mb-0 mt-3 p-2 cursor-pointer", currentSection === name ? "bg-primary border-card border-2 border-b-0" : "")}
               onClick={() => router.push(generateProfilUrl(username as string, name), { scroll: false })}
          >
            <div
              className={cn("font-mc text-primary text-3xl m-2", currentSection === name ? "text-primary-foreground" : "")}>{name}</div>
          </div>)
        )}
        {displaySelector[displaySelector.length - 1] !== ProfilSectionValid[ProfilSectionValid.length - 1] &&
          <div className="flex flex-row bg-card rounded-t-md w-52 justify-center items-center m-0 mt-3 p-2 gap-2"
               onClick={() => alert("TODO")}>
            <h1 className="text-primary text-3xl">...</h1>
          </div>}
      </div>
    </div>
  )
}
