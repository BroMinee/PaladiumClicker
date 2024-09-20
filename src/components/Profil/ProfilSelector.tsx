'use client';
import { useState } from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { generateProfilUrl, ProfilSectionValid } from "@/lib/misc.ts";
import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils.ts";


export default function ProfilSelector() {

  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(0);

  const params = useParams();
  const username = params.username;
  if (username === undefined) {
    redirect("/error?message=Username is undefined");
  }

  const router = useRouter();

  const allSelector = ProfilSectionValid;
  const displaySelector = allSelector.slice(selected, Math.min(allSelector.length, selected + 4));

  return (
    <div className="flex flex-row w-full place-items-end">
      <div className="flex flex-grow justify-start gap-2">
        {displaySelector.map((name, index) => (
          <div key={index}
               className={cn("flex flex-row bg-card rounded-t-md w-52 justify-center items-center mb-0 mt-3 p-2 ", searchParams.get("section") === name ? "bg-primary" : "")}
               onClick={() => router.push(generateProfilUrl(username as string, name), { scroll: false })}
          >
            <div
              className={cn("text-primary text-3xl", searchParams.get("section") === name ? "text-primary-foreground" : "")}>{name}</div>
          </div>)
        )}
        {displaySelector[displaySelector.length - 1] !== ProfilSectionValid[ProfilSectionValid.length - 1] &&
          <div className="flex flex-row bg-card rounded-t-md w-52 justify-center items-center m-0 mt-3 p-2 gap-2"
               onClick={() => alert("TODO")}>
            <h1 className="text-primary text-3xl">...</h1>
          </div>}
      </div>
      <div className="flex flex-row gap-2 bg-primary rounded-md">
        <IoMdArrowDropleft size={48} className="hover:text-gray-400 text-secondary"
                           onClick={() => setSelected(Math.max(0, selected - 1))}
        />
        <div className="w-1 bg-secondary"></div>
        <IoMdArrowDropright size={48} className="hover:text-gray-400 text-secondary"
                            onClick={() => setSelected(Math.min(allSelector.length - 4, selected + 1))}
        />
      </div>
    </div>
  )
}
