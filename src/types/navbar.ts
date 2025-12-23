export type NavBarCategory = "Statistiques et données" | "Outils" | "Informations et gestion";

export interface GithubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}