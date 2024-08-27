import React from "react";
import Navbar from "@/components/NavBar";
import GradientText from "@/components/shared/GradientText";
// import {  useParams } from "react-router-dom";

// import { toast } from "sonner";
// import { AxiosError } from "axios";
// import LoadingData from "@/pages/LoadingData.tsx";
// import NoPseudoPage from "@/components/NoPseudoPage.tsx";
// import Error500Page from "@/pages/Error500Page.tsx";
// import { usePlayerInfo } from "@/stores/use-player-info-store.ts";

type LayoutProps = {
  children: React.ReactNode;
  requiredPseudo?: boolean;
}

const Layout = ({ children, requiredPseudo }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <header
        className="h-16 w-full bg-primary text-primary-foreground sticky top-0 z-10 border-b border-primary-200 backdrop-blur-md">
        <Navbar/>
      </header>
      <main className="flex-1 container py-4 pb-16 mx-auto">
        <ContentLayout requiredPseudo={requiredPseudo}>
          {children}
        </ContentLayout>
      </main>
      <footer className="p-4 bg-accent text-center w-full border">
        L&apos;application est{" "}
        <span className="font-bold">ni affiliée ni approuvée</span>{" "}
        par <GradientText>
        <a
          href="https://paladium-pvp.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-orange-700 transition-colors duration-300"
        >
          Paladium Games
        </a>
      </GradientText>.
      </footer>
    </div>
  );
}

const ContentLayout = ({ children }: LayoutProps) => {
  // const { pseudoParams } = useParams();
  // const { mutate: loadPlayerInfo, isPending, isError } = useLoadPlayerInfoMutation();
  // const { data: playerInfo } = usePlayerInfo();
  // const navigate = useNavigate();
  //
  // useEffect(() => {
  //   // load playerInfo using pseudoParams only if the username is different from the one in the store
  //   if (pseudoParams !== undefined && pseudoParams.toLowerCase() !== playerInfo?.username.toLowerCase()) {
  //     console.log(`Layout loading ${pseudoParams}`)
  //     loadPlayerInfo(pseudoParams as string, {
  //       onSuccess: () => {
  //         const endUrl = window.location.pathname.split("/").pop();
  //         navigate("/" + pseudoParams + "/" + endUrl);
  //         toast.success("Profil importé avec succès");
  //       },
  //       onError: (error) => {
  //         const message = error instanceof AxiosError ?
  //           error.response?.data.message ?? error.message :
  //           typeof error === "string" ?
  //             error :
  //             "Une erreur est survenue dans l'importation du profil";
  //         toast.error(message);
  //       }
  //     })
  //   }
  // }, []);
  //
  //
  // if (requiredPseudo && !pseudoParams) {
  //   return <NoPseudoPage/>;
  // }
  //
  // if (isPending) {
  //   return <LoadingData username={pseudoParams}/>;
  // }
  //
  // if (isError) {
  //   return <Error500Page/>;
  // }


  return <>{children}</>;
}

export default Layout;