import { GithubContributor } from "@/types";

/**
 * Get the list of contributors from the GitHub repository.
 */
export async function getGithubContributors(): Promise<GithubContributor[]> {
  const repos = [
    "https://api.github.com/repos/BroMinee/PaladiumClicker/contributors",
  ];
  const bannedLogins = new Set(["dependabot[bot]"]);

  try {
    const results = await Promise.all(
      repos.map(async (url) => {
        try {
          const res = await fetch(url);

          if (!res.ok) {
            console.warn(`[Build] Failed to fetch contributors from ${url}: ${res.status}`);
            return [];
          }

          return (await res.json()) as GithubContributor[];
        } catch (error) {
          console.warn(`[Build] Error fetching ${url}`, error);
          return [];
        }
      })
    );

    const contributorsMap = new Map<string, GithubContributor>();

    results.flat().filter((contributor) => !bannedLogins.has(contributor.login)).forEach((contributor) => {
      if (contributorsMap.has(contributor.login)) {
        const existing = contributorsMap.get(contributor.login)!;
        existing.contributions += contributor.contributions;
      } else {
        contributorsMap.set(contributor.login, { ...contributor });
      }
    });

    return Array.from(contributorsMap.values()).sort(
      (a, b) => b.contributions - a.contributions
    );
  } catch (error) {
    console.error("Critical error merging contributors", error);
    return [];
  }
}
