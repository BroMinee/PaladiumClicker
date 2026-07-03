import Link from "next/link";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc/patchnote";
import { Card } from "@/components/ui/card";

/**
 *
 */
export function generateMetadata() {
  return {
    title: "PalaTracker | Craft Finder",
    description: "Trouve tous les crafts Paladium à partir d'une liste d'items donné.",
  };
}

/**
 * [Craft Finder selector](https://palatracker.bromine.fr/craft-finder)
 */
export default function CraftFinderPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader>
        <PageHeaderHeading>{textFormatting("Craft °Finder°")}</PageHeaderHeading>
        <PageHeaderDescription>
          Trouve l&apos;ensemble des crafts Paladium à partir une liste d&apos;items imposée.
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
        <Link href="/craft-finder/daily" className="group">
          <Card className="relative flex flex-col gap-4 h-full overflow-hidden border border-secondary hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 cursor-pointer">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Daily</h2>
              <p className="text-xs text-gray-500">Une nouvelle liste d&apos;items chaque jour</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Une liste d&apos;items est imposée chaque jour à minuit. La même pour tous les joueurs.
              Trouve tous les crafts possibles avant les autres.
            </p>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-500">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Liste commune à tous les joueurs</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Chronomètre pour mesurer ton temps</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Classement du jour</li>
            </ul>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-widest mt-auto pt-2 border-t border-secondary group-hover:gap-3 transition-all">
              Jouer au daily
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Card>
        </Link>

        <Link href="/craft-finder/train" className="group">
          <Card className="relative flex flex-col gap-4 h-full overflow-hidden border border-secondary hover:border-orange-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">Entraînement</h2>
              <p className="text-xs text-gray-500">Liste aléatoire, changeable à volonté</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Entraîne-toi avec des listes d&apos;items aléatoires.
              Change de liste à tout moment et révèle les réponses quand tu veux.
            </p>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-500">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />Liste aléatoire, changeable à tout moment</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />Option pour révéler les réponses</li>
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
          La plupart des crafts moddés de Paladium sont inclus, mais <span className="font-semibold text-gray-300">certains crafts vanilla ne sont pas renseignés</span>.
        </p>
      </div>
    </div>
  );
}
