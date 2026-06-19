export type NavBarCategory = "Statistiques et données" | "Outils" | "Informations et gestion" | "Jeux";

export interface GithubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}