"use client";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { computeTimePlayed, convertEpochToDateUTC2, formatPrice } from "@/lib/misc";
import { Card } from "@/components/ui/card";

const IconMoney = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5v-.008Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.25-2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Z" />
  </svg>
);

/**
 * Display profile stats of the player
 * Those stats are :
 * - Money
 * - Time played
 * - First connection to the server
 */
export function PlayerStats() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        icon={<IconMoney />}
        label="Argent"
        value={`${formatPrice(Math.round(playerInfo.money))} $`}
      />
      <StatCard
        icon={<IconClock />}
        label="Temps de jeu"
        value={computeTimePlayed(playerInfo.timePlayed)}
      />
      <StatCard
        icon={<IconCalendar />}
        label="Première connexion"
        value={convertEpochToDateUTC2(playerInfo.firstSeen)}
      />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.JSX.Element, label: string, value: number | string }) {
  return (
    <Card className="flex items-center shadow">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="text-sm text-card-foreground">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </Card>
  );
}