import { textFormatting } from "@/lib/misc/patchnote";
import patchNotesData from "@/public/news.json";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { ChangeLogs } from "@/types";

/**
 * [patchnote page](https://palatracker.bromine.fr/patchnote)
 */
export default function PatchNotesPage() {
  const notes: ChangeLogs[] = patchNotesData;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-5xl mx-auto space-y-12">
        <PageHeader>
          <PageHeaderHeading>
            {textFormatting("°Patch Notes°")}
          </PageHeaderHeading>
          <PageHeaderDescription>
            {"Historique des mises à jour, ajouts et corrections."}
          </PageHeaderDescription>
        </PageHeader>

        <main className="space-y-8 relative sm:before:absolute sm:before:top-0 sm:before:bottom-0 sm:before:left-5 sm:before:w-0.5 sm:before:bg-primary">
          {notes.map((note, index) => (
            <article
              key={`${note.date}-${index}`}
              id={note.date}
              className="relative flex items-start gap-6 animate-fade-in"
            >
              <div className="hidden sm:block shrink-0 z-10 mt-2">
                <UnOptimizedImage
                  src="/coin.png"
                  alt=""
                  width={40}
                  height={40}
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              <div className="flex-1 bg-card border border-border p-6 rounded-lg transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-border/50">
                  <h2 className="text-2xl font-bold text-foreground tracking-wide">
                    {note.date}
                  </h2>
                  {index === 0 && (
                    <span className="px-2.5 py-1 text-[10px] bg-primary text-primary-foreground rounded-sm animate-blink-orange uppercase tracking-wider">
                      Dernière mise à jour
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {Object.entries(note.changes).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-lg font-bold text-primary-darker capitalize mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                        {category}
                      </h3>
                      <ul className="space-y-3">
                        {items?.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-card-foreground flex items-start gap-2">
                            <span className="text-secondary-foreground mt-1.5 text-xs shrink-0">
                              {" - "}
                            </span>
                            <div className="leading-relaxed flex-1">
                              {textFormatting(item)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}