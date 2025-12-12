"use client";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { PlayerSearchInput } from "@/components/shared/player-search-input-client";

/**
 * Component that allows the user to add player to the ranking graph.
 */
export function RankingAddPlayerInput() {
  const [addedPlayerUsername, setAddedPlayerUsername] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log(addedPlayerUsername);
  }, [addedPlayerUsername]);

  const handleAddPlayer = (username: string) => {
    alert("handleAddPlayer is not handle yet");
    setAddedPlayerUsername(prev => new Set(prev).add(username));
  };

  return (
    <div className="lg:col-span-1 bg-card p-4 rounded-lg relative">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <IoMdSearch className="w-5 h-5" />
        Ajouter un joueur
      </h3>
      <PlayerSearchInput onClick={function (user: User | string): void {
        handleAddPlayer(typeof user === "string" ? user : user.username);
      }} />
    </div>
  );
}