import { NavBarCategory } from "@/types";

const store = {
  opened: ["Statistiques et données", "Outils", "Informations et gestion"] as NavBarCategory[],
  setToggleOpen: (_category: NavBarCategory) => {},
};

/**
 * Dummy navbar store that replace the use-navbar-store.deprecated.ts
 */
export const useNavbarStore = () => store;
