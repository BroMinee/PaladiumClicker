import { Card, CardHeader } from "@/components/ui/card.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";

export default function LoadingData({ username }: { username: string | undefined }) {
  return (
    <div className="flex justify-center items-center" style={{ height: '70vh' }}>
      <Card className="flex flex-col gap-4 font-bold center items-center transition-all duration-300 ease-out motion-reduce:transition-none">
        <CardHeader className="flex flex-row gap-4">
          <LoadingSpinner/>
          <h1 className="transition-opacity duration-300 ease-out motion-reduce:transition-none">
            {username === undefined ? <p>Chargement des données...</p> :
              <p> Téléchargement des données pour l&apos;utilisateur : <span className="text-primary">{username}</span>
              </p>
            }
          </h1>
        </CardHeader>
      </Card>
    </div>
    
  );
};