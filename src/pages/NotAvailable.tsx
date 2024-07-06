import { buttonVariants } from "@/components/ui/button";
import { FaDizzy } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotAvailablePage = () => {
  return (
    <div className="flex items-center justify-center w-full h-dvh">
      <div className="flex flex-col items-center justify-end gap-4">
        <FaDizzy className="w-16 h-16 animate-bounce"/>
        <p>Cette page est en refonte, revenez plus tard</p>
        <Link to="/" className={buttonVariants({ variant: "outline" })}>Retour à l'accueil</Link>
      </div>
    </div>
  );
}

export default NotAvailablePage;