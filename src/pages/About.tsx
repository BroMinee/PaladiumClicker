import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {FaGithub} from "react-icons/fa";
import Contributors from "@/components/Contributors.tsx";
import Layout from "@/components/shared/Layout.tsx";
import Discord from "@/components/Discord.tsx";

const AboutPage = () => {
  return (
      <Layout>
        <div className="flex flex-col gap-4 ">
          <Card className="flex flex-col gap-4 font-bold center">
            <CardHeader className="flex flex-row">
              <p>
                Ce site a été entièrement développé par{" "}
                <span className="text-primary">BroMine__</span>

              </p>
            </CardHeader>
            <CardContent>
              <p className="p-2">
                Le site est open-source, plus d'informations sur ce que vous pouvez faire pour contribuer à partir du
                code dans le README du git.
              </p>
            </CardContent>

          </Card>
          <Card className="hover:scale-105 duration-300" onClick={() => {
            window.open("https://github.com/BroMinee/PaladiumClicker", "_blank");
          }}>
            <CardContent className="h-full pt-6 flex items-center gap-4">
              <FaGithub className="w-14 h-14 p-2 rounded-md"/>
              <div className="flex flex-col gap-2">
                <div className="font-bold text-primary">
                  Code source
                </div>
              </div>
            </CardContent>
          </Card>

          <Discord/>
          <Contributors/>

        </div>
      </Layout>
  )
      ;
};
export default AboutPage;