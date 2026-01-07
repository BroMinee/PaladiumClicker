"use client";

import React, { useState, useMemo, useId } from "react";
import debounce from "debounce";
import { getSimilareUsernames } from "@/lib/api/api-server-action.server";
import { User } from "@/types";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { levenshteinDistance } from "@/lib/misc";
import { IoMdSearch } from "react-icons/io";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button-v2";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSettingsStore } from "@/stores/use-settings-store";
import { LoadingSpinner } from "../ui/loading-spinner";

interface PlayerSearchInputProps {
  onClick: (user: User | string) => void;
  // Renommage des variantes
  variant?: "default" | "homepage" | "navbar";
  className?: string;
  placeholder?: string;
  submitLabel?: string;
  fetching?: boolean;
}

/**
 * Player search input component with autocompletion.
 *
 * @param onClick Callback function when a player is selected or searched.
 * @param variant The variant of the search input, either "default", "homepage", or "navbar".
 * @param className Additional CSS classes for styling.
 * @param placeholder Placeholder text for the input field.
 * @param submitLabel Label for the submit button (used in "navbar" variant).
 * @param fetching Indicates if a fetch operation is in progress.
 */
export const PlayerSearchInput = ({
  onClick,
  variant = "default",
  className,
  fetching,
  placeholder = "Pseudo du joueur...",
  submitLabel = "Mettre à jour"
}: PlayerSearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettingsStore();

  const formId = useId();

  const fetchPlayers = async (username: string) => {
    try {
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
    } catch (error) {
      console.error("Failed to fetch players", error);
      setSearchResults([]);
    }
  };

  const debouncedSearch = useMemo(() => {
    return debounce((query) => {
      if (query.length > 2 && query.length <= 16) {
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

  const handleInputClick = () => {
    if (searchResults.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSelectPlayer = (user: User | string) => {
    if (typeof user === "string" && user.trim() === "") {
      return;
    }
    if (settings.defaultProfile) {
      toast.error("Impossible d'importer un pseudo car vous avez activé dans les paramètres l'option : \"profil vide\".");
      // TODO popup in case the user want to remove the default profil
      return;
    }
    onClick(user);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSelectPlayer(searchTerm);
  };

  const PopoverResults = () => (
    <PopoverContent
      className="z-[200] w-[var(--radix-popover-trigger-width)] bg-card border rounded-lg overflow-y-auto mt-1 p-0 max-h-[50vh]"
      align="start"
      sideOffset={5}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <ul className="py-1">
        {searchResults.map((player) => (
          <li
            key={player.uuid}
            onClick={() => handleSelectPlayer(player)}
            className="flex items-center px-4 py-2 hover:bg-primary cursor-pointer transition-colors gap-3 rounded-lg"
          >
            <UnOptimizedImage
              src={`https://mineskin.eu/helm/${player.uuid}`}
              alt={`Skin de ${player.username}`}
              className="w-8 h-8 rounded pixelated"
              width={32} height={32}
            />
            <span className="font-medium truncate text-foreground">{player.username}</span>
          </li>
        ))}
        {searchResults.length === 0 && (
          <div className="p-3 text-center text-foreground">
            <span>Le profil de </span>
            <span className="text-sm font-medium text-primary">{searchTerm}</span>
            <span> n&apos;a jamais été chargé</span>
          </div>
        )}
      </ul>
    </PopoverContent>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>

      {variant === "homepage" && (
        <PopoverAnchor asChild>
          <div className={cn("w-full max-w-xl relative group pointer-events-auto", className)}>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <form onSubmit={handleFormSubmit} className="relative flex bg-card p-2 rounded-xl shadow-2xl shadow-[0_0_140px_#ff6f00b3]">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={handleInputClick}
                  className="w-full h-10 pl-4 pr-4 bg-transparent border-none outline-none text-xl font-minecraft placeholder:text-card-foreground focus:ring-0"
                />
              </div>
              {fetching === true ?
                <LoadingSpinner />
                :
                <Button type="submit" variant="primary" disabled={!searchTerm} className="px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <IoMdSearch />
                </Button>
              }
            </form>
          </div>
        </PopoverAnchor>
      )}

      {variant === "navbar" && (
        <div className={cn("flex gap-2 flex-col", className)}>
          <PopoverAnchor asChild>
            <form id={formId} onSubmit={handleFormSubmit}>
              <div className="relative">
                <input
                  type="text"
                  className="text-card-foreground flex h-9 w-full rounded-sm border border-input px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-background"
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={handleInputClick}
                  autoComplete="off"
                />
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-300 ease-out motion-reduce:transition-none rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary hover:text-accent-foreground h-9 w-9 absolute right-0 top-0 text-foreground rounded-l-none border-none"
                  type="submit"
                >
                  <IoMdSearch className="w-4 h-4" />
                </button>
              </div>
            </form>
          </PopoverAnchor>

          <button
            className="items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-300 ease-out motion-reduce:transition-none rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 flex flex-row gap-2"
            type="submit"
            form={formId}
          >
            <span>{submitLabel}</span>
          </button>
        </div>
      )}

      {/* 3. Variante DEFAULT */}
      {variant === "default" && (
        <PopoverAnchor asChild>
          <div className={cn("relative w-full", className)}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleInputClick}
              placeholder={placeholder}
              onKeyDown={(e) => e.key === "Enter" && handleFormSubmit(e)}
              className="w-full bg-secondary border border-gray-600 rounded-lg py-2 pl-3 pr-10 placeholder-gray-500 focus:outline-none focus:border-primary"
            />
            <Button
              onClick={() => handleSelectPlayer(searchTerm)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border-none h-auto bg-transparent hover:bg-transparent text-foreground"
              variant="ghost"
            >
              <IoMdSearch className="w-5 h-5" />
            </Button>
          </div>
        </PopoverAnchor>
      )}

      <PopoverResults />
    </Popover>
  );
};