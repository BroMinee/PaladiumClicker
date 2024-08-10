import { Card, CardHeader } from "@/components/ui/card.tsx";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import { useNavigate } from "react-router-dom";


const LoadingData = ({ username }: { username: string | undefined }) => {
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(true);
    }, 50000);

    // Cleanup function to clear the timeout if the component unmounts before the timeout finishes
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showError) {
      navigate("/error");
    }
  }, [showError]);

  return (
    <div className="flex justify-center items-center" style={{height: '70vh'}} >
      <Card className="flex flex-col gap-4 font-bold center items-center">
        <CardHeader className="flex flex-row gap-4">
          <LoadingSpinner/>
          <p> Chargement des données pour l'utilisateur : <span className="text-primary">{username}</span></p>
        </CardHeader>
      </Card>
    </div>

  );
};
export default LoadingData;