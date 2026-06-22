import Link from "next/link";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc/patchnote";
import { Card } from "@/components/ui/card";

/**
 * Generate Metadata
 */
export function generateMetadata() {
  return {
    title: "PalaTracker | Craft Wordle",
    description: "Devine la recette de craft d'un item Paladium le plus rapidement possible.",
  };
}

/**
 * [Wordle selector](https://palatracker.bromine.fr/wordle)
 */
export default function WordlePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader>
        <PageHeaderHeading>{textFormatting("Craft °Wordle°")}</PageHeaderHeading>
        <PageHeaderDescription>
          Devine la recette de craft d&apos;un item Paladium le plus rapidement possible.
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
        <Link href="/wordle/daily" className="group">
          <Card className="relative flex flex-col gap-4 h-full overflow-hidden border border-secondary hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 cursor-pointer">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Daily</h2>
                <p className="text-xs text-gray-500">Un nouveau craft chaque jour</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              Un craft secret est révélé chaque jour à minuit. Le même pour tous les joueurs.
              Chronomètre intégré pour comparer ton temps avec les autres.
            </p>

            <ul className="flex flex-col gap-1.5 text-xs text-gray-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Craft commun à tous les joueurs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Chronomètre pour mesurer ton temps
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Uniquement des crafts Paladium
              </li>
            </ul>

            <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-widest mt-auto pt-2 border-t border-secondary group-hover:gap-3 transition-all">
              Jouer au daily
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Card>
        </Link>

        <Link href="/wordle/train" className="group">
          <Card className="relative flex flex-col gap-4 h-full overflow-hidden border border-secondary hover:border-orange-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">Entraînement</h2>
                <p className="text-xs text-gray-500">Tentatives illimitées, craft aléatoire</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              Entraîne-toi sur des crafts aléatoires.
              Change de craft à volonté et révèle la réponse quand tu veux.
            </p>

            <ul className="flex flex-col gap-1.5 text-xs text-gray-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                Craft aléatoire, changeable à tout moment
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                Option pour révéler la réponse
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                Crafts invalides autorisables
              </li>
            </ul>

            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest mt-auto pt-2 border-t border-secondary group-hover:gap-3 transition-all">
              S&apos;entraîner
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Card>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto w-full flex items-start gap-3 px-4 py-3 bg-card border border-secondary rounded-lg">
        <span className="text-gray-500 text-base mt-px shrink-0">ℹ</span>
        <p className="text-sm text-gray-400 leading-relaxed">
          Seuls les <span className="font-semibold text-gray-300">crafts moddés de Paladium</span> sont inclus, les recettes vanilla de Minecraft ne font pas partie de la liste possible des crafts.
        </p>
      </div>

      {/* <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-secondary" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Comment ça marche</span>
          <div className="h-px flex-1 bg-secondary" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 p-4 bg-card rounded-lg border border-secondary">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-700/30 border border-green-600/40 flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
              </div>
              <span className="text-sm font-semibold text-green-400">Bonne case</span>
            </div>
            <p className="text-xs text-gray-500">L&apos;item est correct et bien placé dans la grille.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-card rounded-lg border border-secondary">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-yellow-600/30 border border-yellow-500/40 flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500" />
              </div>
              <span className="text-sm font-semibold text-yellow-400">Mauvaise case</span>
            </div>
            <p className="text-xs text-gray-500">L&apos;item est dans la recette mais mal positionné.</p>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-card rounded-lg border border-secondary">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-800/60 border border-gray-600/40 flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-sm bg-gray-600" />
              </div>
              <span className="text-sm font-semibold text-gray-300">Absent</span>
            </div>
            <p className="text-xs text-gray-500">Cet item n&apos;apparaît pas dans la recette.</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
