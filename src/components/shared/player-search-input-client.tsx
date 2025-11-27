"use client";

import React, { useState, useMemo } from "react";
import debounce from "debounce";
import { getSimilareUsernames } from "@/lib/api/apiServerAction";
import { User } from "@/types";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { levenshteinDistance } from "@/lib/misc";
import { IoMdSearch } from "react-icons/io";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

/**
 * Input to search a player by his username.
 * Auto fetch the list of player using a debounce of 250ms.
 * Display the list of player using the skin and the username.
 * @param onClick - callback when click or Enter is pressed
 */
export const PlayerSearchInput = ({ onClick }: { onClick: (user: User | string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPlayers = async (username: string) => {
    const users = await getSimilareUsernames(username);
    const lowerSearch = username.toLowerCase();

    const processedUsers = users
      .map((user) => {
        const lowerName = user.username.toLowerCase();
        const dist = levenshteinDistance(lowerName, lowerSearch);
        const includes = lowerName.includes(lowerSearch);
        return { ...user, dist, includes };
      })
      .filter((user) => {
        return user.includes || user.dist <= 3;
      })
      .sort((a, b) => {
        return a.dist - b.dist;
      });

    setSearchResults(processedUsers);
    setIsOpen(true);
  };

  const debouncedSearch = useMemo(() => {
    return debounce((query) => {
      if (2 < query.length && query.length <= 16) {
        fetchPlayers(query);
      } else {
        setSearchResults([]);
        setIsOpen(false);
      }
    }, 250);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleAddPlayer = (user: User | string) => {
    if (typeof user === "string" && user.trim() === "") {
      return;
    }
    onClick(user);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Pseudo du joueur..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (searchResults.length > 0) {
                  handleAddPlayer(searchResults[0]);
                } else {
                  handleAddPlayer(searchTerm);
                }
              }
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() => handleAddPlayer(searchTerm)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Rechercher"
          >
            <IoMdSearch className="w-5 h-5" />
          </button>
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="z-50 w-[var(--radix-popover-trigger-width)] bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1 p-0"
        align="start"
        sideOffset={5}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ul className="py-1">
          {searchResults.map((player) => (
            <li
              key={player.uuid}
              onClick={() => handleAddPlayer(player)}
              className="flex items-center px-4 py-2 text-white hover:bg-blue-600 cursor-pointer transition-colors gap-3 rounded-lg"
            >
              <UnOptimizedImage
                src={`https://mineskin.eu/helm/${player.uuid}`}
                alt={`Skin de ${player.username}`}
                className="w-8 h-8 rounded pixelated"
                width={0} height={0} />

              <span className="font-medium truncate">
                {player.username}
              </span>
            </li>
          ))}
          {searchResults.length === 0 && <div className="p-3 text-center text-gray-300">
            <span>Le profil de </span>
            <span className="text-sm font-medium text-primary">{searchTerm}</span>
            <span> n&apos;a jamais été chargé</span>
            <p className="text-xs text-gray-400 mt-1">
              Appuyez sur <span className="font-bold text-white border border-gray-500 rounded px-1">Entrée</span> ou la loupe pour charger le pseudo tout de même.
            </p>
          </div>}
        </ul>
      </PopoverContent>
    </Popover>
  );
};