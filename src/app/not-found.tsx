import { safeJoinPaths } from "@/lib/misc";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";

/**
 * Page 404
 */
export default function NotFound() {

  return (
    <Card
      className="flex flex-col gap-4 font-bold center bg-no-repeat bg-center bg-cover bg-black justify-center items-center"
      style={{ height: "70vh" }}>
      <CardHeader className="flex flex-row gap-2 ">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <div className="flex flex-row justify-center items-center">
              <div
                className="mb-4 tracking-tight font-extrabold text-9xl text-primary-600 text-primary-500"
              > 4
              </div>
              <Image width={112} height={112} alt="pedro gif" src={safeJoinPaths("/pedro.gif")} unoptimized/>
              <div
                className="mb-4 tracking-tight font-extrabold text-9xl text-primary-600 text-primary-500"
              > 4
              </div>
            </div>
            <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl ">Désolé, cette page
              n&apos;existe
              pas.</p>
            <p className="mb-4 text-lg font-light text-card-foreground">Si vous êtes persuadé que cette page devrait exister,
              merci de contacter un développeur.</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}