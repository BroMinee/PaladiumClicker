import Link from "next/link";
import { Package } from "lucide-react";
import { GiStoneCrafting } from "react-icons/gi";
import { QDF } from "@/types/qdf";
import { formatPrice } from "@/lib/misc";
import { generateCraftUrl } from "@/lib/misc/navbar";
import { CraftSectionEnum } from "@/types";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { Card } from "@/components/ui/card";
import { QdfCountdown } from "@/components/qdf/qdf-countdown.client";
import { QdfHistoryGrid } from "@/components/qdf/qdf-history-grid.client";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { textFormatting } from "@/lib/misc";

function formatDate(timestamp: number, withTime = false): string {
  return new Date(timestamp * 1000).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  });
}

function getItemName(data: QDF | QDF): string | null {
  return data.item?.item_name ?? ("itemName" in data ? data.itemName : null);
}

function QdfHistoryCard({ data }: { data: QDF }) {
  const itemName = getItemName(data);
  const displayNameUs = data.item?.us_trad ?? itemName;
  const displayNameFr = data.item?.fr_trad ?? null;

  return (
    <Link
      href={generateCraftUrl(itemName, data.quantity, CraftSectionEnum.recipe)}
      className="group block h-full"
    >
      <div className="h-full flex flex-col rounded-xl border border-border bg-background/50 hover:border-primary transition-all duration-200 hover:shadow-md hover:shadow-primary/10 overflow-hidden">
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="relative shrink-0 h-12 w-12">
            <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {data.item?.img ? (
              <UnOptimizedImage
                src={`/AH_img/${data.item.img}`}
                alt={itemName ?? "item"}
                width={0}
                height={0}
                className="object-contain pixelated relative z-10 group-hover:scale-110 transition-transform duration-300 w-12 h-12"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground text-[10px] text-center px-1 relative z-10">
                {itemName}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate text-foreground group-hover:text-primary transition-colors">
              {displayNameUs}
            </p>
            {displayNameFr && (
              <p className="text-[10px] text-secondary-foreground truncate">{displayNameFr}</p>
            )}
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-baseline justify-center gap-1.5 py-2 rounded-lg bg-primary/5 border border-primary/15">
            <span className="text-xs text-primary/60 font-semibold">x</span>
            <span className="text-xl font-black text-primary font-mono">{formatPrice(data.quantity)}</span>
          </div>
        </div>

        <div className="mt-auto px-4 pb-4 space-y-2 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="text-center py-1.5 rounded-md bg-card/60 border border-secondary">
              <p className="text-[9px] text-secondary-foreground uppercase tracking-wide">XP</p>
              <p className="text-xs font-bold font-mono text-foreground">{formatPrice(data.earningXp)}</p>
            </div>
            <div className="text-center py-1.5 rounded-md bg-card/60 border border-secondary">
              <p className="text-[9px] text-secondary-foreground uppercase tracking-wide">Récompense</p>
              <p className="text-xs font-bold font-mono text-foreground">{formatPrice(data.earningMoney)} $</p>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-secondary-foreground">
            <span>{formatDate(data.start)}</span>
            <span>→</span>
            <span>{formatDate(data.end)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * [QDF page](https://palatracker.bromine.fr/qdf)
 */
export async function QdfDisplay({
  current,
  history
}: {
  current: QDF | null;
  history: QDF[];
}) {
  const pastHistory = history
    .filter((q) => !current || q.start !== current.start)
    .sort((a, b) => b.start - a.start);

  const currentItemName = current ? getItemName(current) : null;
  const currentDisplayNameUs = current?.item?.us_trad ?? currentItemName;
  const currentDisplayNameFr = current?.item?.fr_trad ?? null;

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("°Quête de Faction°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          Consultez la quête de faction actuelle et l&apos;historique des semaines passées.
        </PageHeaderDescription>
      </PageHeader>

      <Card>
        <>
          {current && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="lg:col-span-1 bg-background/50 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4">
                <div className="w-32 h-32 bg-card/50 rounded-full flex items-center justify-center border-2 border-secondary mb-2 relative overflow-hidden shadow-lg shadow-orange-900/10">
                  {current.item?.img ? (
                    <UnOptimizedImage
                      src={`/AH_img/${current.item.img}`}
                      alt={currentItemName ?? "item"}
                      width={0}
                      height={0}
                      className="w-20 h-20 pixelated object-contain"
                    />
                  ) : (
                    <span className="text-secondary-foreground text-xs text-center px-2">
                      {currentItemName}
                    </span>
                  )}
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold">{currentDisplayNameUs}</h2>
                  {currentDisplayNameFr && (
                    <span className="text-xs text-secondary-foreground bg-card px-2 py-1 rounded mt-1 inline-block">
                      {currentDisplayNameFr}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full text-white bg-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  En cours
                </span>

                <Link
                  href={generateCraftUrl(currentItemName, current.quantity, CraftSectionEnum.recipe)}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 group/btn text-sm"
                >
                  <GiStoneCrafting size={20} className="group-hover/btn:rotate-12 transition-transform" />
                  Voir le Craft
                </Link>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-4">

                <div className="bg-background/50 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 text-secondary-foreground text-xs uppercase tracking-widest font-semibold">
                    <Package size={14} />
                    Quantité à farmer
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black text-primary font-mono tracking-tight">
                      <span className="text-4xl text-primary/60 font-semibold">x{" "}</span>
                      {formatPrice(current.quantity)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-[10px] text-secondary-foreground uppercase tracking-wide mb-1">XP Faction</p>
                    <p className="text-2xl font-black font-mono text-foreground">{formatPrice(current.earningXp)}</p>
                  </div>
                  <div className="bg-background/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-[10px] text-secondary-foreground uppercase tracking-wide mb-1">Récompense</p>
                    <p className="text-2xl font-black font-mono text-emerald-500">{formatPrice(current.earningMoney)} $</p>
                  </div>
                </div>

                <div className="bg-background/50 border border-gray-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-secondary-foreground">Début</span>
                    <span className="text-sm font-mono font-semibold text-foreground">{formatDate(current.start, true)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-secondary-foreground">Fin</span>
                    <span className="text-sm font-mono font-semibold text-foreground">{formatDate(current.end, true)}</span>
                  </div>
                </div>

                <div className="bg-background/50 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
                  <QdfCountdown endTimestamp={current.end} />
                </div>
              </div>
            </section>
          )}

          {pastHistory.length > 0 && (
            <>
              <div className="border-t border-gray-800 my-8" />
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Historique</h3>
                    <p className="text-sm text-secondary-foreground mt-1">Quêtes des semaines passées</p>
                  </div>
                  <span className="text-sm text-secondary-foreground bg-background px-3 py-1 rounded border">
                    {pastHistory.length} quêtes
                  </span>
                </div>
                <QdfHistoryGrid>
                  {pastHistory.map((qdf) => (
                    <QdfHistoryCard key={qdf.start} data={qdf} />
                  ))}
                </QdfHistoryGrid>
              </section>
            </>
          )}

          {!current && pastHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-secondary-foreground">
              <p className="text-lg font-medium">Aucune donnée disponible.</p>
            </div>
          )}
        </>
      </Card>
    </>
  );
}
