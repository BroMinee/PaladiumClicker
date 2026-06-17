import { ExternalLink, GitCommitHorizontal } from "lucide-react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { constants } from "@/lib/constants";
import { getGithubContributors } from "@/lib/api/api-pala.server";
import { GithubContributor } from "@/types";

/**
 * Maps a GitHub login to the list of features they contributed to.
 * Update this when new contributors join or work on new features.
 */
const CONTRIBUTOR_FEATURES: Record<string, string[]> = {
  "BroMinee": ["Créateur et mainteneur du projet", "Algorithme du clicker",  "Développeur frontend et backend"],
  "riveur": ["Première grosse refonte visuelle", "Réecriture de Javascript en TypeScript", "Intégration de TailwindCSS"],
  "berchbrown": ["Contributeur backend"],
  "omega7711": ["Amélioration du responsive"]
};

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | A propos";
  const description = "Le site qui te permet de suivre ton profil Paladium, d'optimiser ton PalaClicker, de suivre les historiques de vente de l'AH et bien plus encore !";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

/**
 * [About Page](https://palatracker.bromine.fr/about)
 */
const AboutPage = async () => {
  const contributors: GithubContributor[] = (await getGithubContributors()).toSorted((a, b) => {
    if (a.contributions === b.contributions) {
      return (CONTRIBUTOR_FEATURES[a.login] ?? []).length > (CONTRIBUTOR_FEATURES[b.login] ?? []).length ? -1 : 1;
    }
    return b.contributions - a.contributions;
  });

  return (
    <div className="flex flex-col gap-12">

      <div>
        <div className="flex items-center gap-4 mb-3">
          <div className="h-[2px] w-8 sm:w-12 bg-primary rounded-full shrink-0" />
          <h3 className="font-bold uppercase tracking-widest text-xs sm:text-sm">
            À propos
          </h3>
        </div>

        <Card className="w-full overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6 w-full">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {"Développement de PalaTracker"}
                </h2>
                <p className="leading-relaxed text-sm sm:text-base">
                  {"PalaTracker est un projet indépendant, gratuit et sans publicité, développé bénévolement pour la communauté de Paladium. Son objectif est de proposer des outils pratiques pour faciliter la progression des joueurs, que ce soit pour optimiser leur clicker, calculer l'expérience nécessaire pour monter en niveau, ou encore suivre leur profil."}<br/><br/>
                  {"Le code source du frontend est disponible publiquement sur GitHub. Les contributions et suggestions sont les bienvenues."}<br/>
                  {"Pour signaler un bug ou proposer une amélioration, le Discord ou les issues GitHub sont les canaux privilégiés."}
                </p>
              </div>

              <div className="border border-yellow-500/40 bg-yellow-500/10 rounded-lg p-4 space-y-2">
                <h3 className="font-bold text-yellow-400 text-sm sm:text-base">⚠ Arrêt de l&apos;API Paladium</h3>
                <p className="text-sm leading-relaxed">
                  {"Paladium a décidé de couper l'accès à son API publique. La majorité des fonctionnalités reposaient sur ces données en temps réel, ce qui explique leurs disparitions soudaine."}<br/>
                  {"Malgré cela, plusieurs outils continuent de fonctionner de manière 100% hors-ligne et restent pleinement utilisables."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={constants.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded bg-[#24292e] hover:bg-[#2f363d] text-white font-bold border border-[#444c56] hover:border-gray-400 shadow-lg active:translate-y-px transition-all text-sm sm:text-base"
                >
                  <FaGithub size={20} />
                  <span>Repository</span>
                  <ExternalLink size={14} className="opacity-50" />
                </a>

                <a
                  href={constants.discord.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold border border-[#5865F2] hover:border-[#4752C4] shadow-lg active:translate-y-px transition-all text-sm sm:text-base"
                >
                  <FaDiscord size={20} />
                  <span>Discord</span>
                  <ExternalLink size={14} className="opacity-50" />
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center gap-4 mb-3">
          <div className="h-[2px] w-8 sm:w-12 bg-primary rounded-full shrink-0" />
          <h3 className="font-bold uppercase tracking-widest text-xs sm:text-sm">
            Contributeurs
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contributors.map((contributor) => {
            const features = CONTRIBUTOR_FEATURES[contributor.login] ?? [];
            return (
              <a
                key={contributor.login}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="h-full transition-all duration-300 group-hover:border-primary group-hover:-translate-y-0.5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors shrink-0">
                        <UnOptimizedImage
                          src={contributor.avatar_url}
                          alt={contributor.login}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-lg text-primary truncate">{contributor.login}</div>
                        <div className="flex items-center gap-1 text-sm text-secondary-foreground mt-1">
                          <GitCommitHorizontal size={13} />
                          {contributor.contributions.toLocaleString()} commits
                        </div>
                      </div>
                    </div>

                    {features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
