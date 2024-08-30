import { Card, CardHeader } from "@/components/ui/card.tsx";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";


export default function LoadingData({ username }: { username: string | undefined }) {
  return (
    <div className="flex justify-center items-center" style={{ height: '70vh' }}>
      <Card className="flex flex-col gap-4 font-bold center items-center">
        <CardHeader className="flex flex-row gap-4">
          <LoadingSpinner/>
          {username === undefined ? <p>Chargement des données...</p> :
            <p> Téléchargement des données pour l&aposutilisateur : <span className="text-primary">{username}</span></p>
          }
        </CardHeader>
      </Card>
    </div>

  );
};