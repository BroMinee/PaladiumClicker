"use client";
import { useState, useTransition, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GradientText } from "@/components/shared/gradient-text";
import { GenericSectionTabs, TabData } from "@/components/shared/section.client";
import {
  createProxyApiKeyAction,
  listProxyApiKeysAction,
  revokeProxyApiKeyAction,
  type ProxyApiKeyEntry,
} from "@/lib/api/proxy-api-key.server";

function BlurredKey({ value }: { value: string }) {
  return (
    <GradientText className="text-xs break-all font-mono blur-sm hover:blur-none transition-[filter] duration-300 select-all cursor-pointer">
      {value}
    </GradientText>
  );
}

function KeyManager({ keys, setKeys, isPending, startTransition }: {
  keys: ProxyApiKeyEntry[];
  setKeys: (keys: ProxyApiKeyEntry[]) => void;
  isPending: boolean;
  startTransition: (fn: () => Promise<void>) => void;
}) {
  const activeKey = keys.find(k => k.active) ?? null;

  function handleCreate() {
    startTransition(async () => {
      try {
        const result = await createProxyApiKeyAction();
        toast.info("Clé proxy créée");
        const updated = await listProxyApiKeysAction();
        setKeys(updated.map(k => k.id === result.id ? { ...k, key: result.key } : k));
      } catch {
        toast.error("Erreur lors de la création de la clé proxy");
      }
    });
  }

  function handleRevoke(id: number) {
    startTransition(async () => {
      try {
        await revokeProxyApiKeyAction(id);
        toast.info("Clé proxy révoquée");
        const updated = await listProxyApiKeysAction();
        setKeys(updated);
      } catch {
        toast.error("Erreur lors de la révocation de la clé proxy");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {activeKey ? (
        <div className="flex flex-col gap-2 p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{activeKey.owner_label}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
              active
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <BlurredKey value={activeKey.key} />
            <p className="text-xs text-muted-foreground">Survolez pour révéler la clé.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-xs flex-1"
              onClick={() => {
                navigator.clipboard.writeText(activeKey.key);
                toast.info("Clé copiée");
              }}
            >
              Copier
            </Button>
            <Button
              variant="outline"
              className="text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
              onClick={() => handleRevoke(activeKey.id)}
              disabled={isPending}
            >
              Révoquer
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            Créée le {new Date(activeKey.created_at).toLocaleDateString("fr-FR")}
            {activeKey.last_used_at && ` · Dernière utilisation : ${new Date(activeKey.last_used_at).toLocaleString("fr-FR")}`}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Aucune clé active. Générez-en une pour accéder au proxy PalaTracker.
          </p>
          <Button onClick={handleCreate} disabled={isPending}>
            Générer une clé
          </Button>
        </div>
      )}
    </div>
  );
}

type PanelTab = "guide" | "cle";

/**
 * Api key panel
 */
export function ProxyApiKeyPanel({ initialKeys, guide }: { initialKeys: ProxyApiKeyEntry[]; guide: ReactNode }) {
  const [keys, setKeys] = useState<ProxyApiKeyEntry[]>(initialKeys);
  const [isPending, startTransition] = useTransition();

  const tabs: TabData<PanelTab>[] = [
    {
      key: "guide",
      label: "Guide",
      content: () => <>{guide}</>,
    },
    {
      key: "cle",
      label: "Ma clé",
      content: () => <KeyManager keys={keys} setKeys={setKeys} isPending={isPending} startTransition={startTransition} />,
    },
  ];

  return (
    <Card>
      <CardContent>
        <GenericSectionTabs tabs={tabs} />
      </CardContent>
    </Card>
  );
}
