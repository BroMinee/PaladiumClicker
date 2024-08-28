import { safeJoinPaths } from "@/lib/misc.ts";
import { Card, CardHeader } from "@/components/ui/card.tsx";

export default function NotFound() {

  return (
    <Card
      className="flex flex-col gap-4 font-bold center bg-no-repeat bg-center bg-cover text-white bg-black justify-center items-center"
      style={{ height: '70vh' }}>
      <CardHeader className="flex flex-row gap-2 ">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <div className="flex flex-row justify-center items-center">
              <div
                className="mb-4 tracking-tight font-extrabold text-9xl text-primary-600 text-primary-500"
              > 4
              </div>
              <img className="w-28" src={safeJoinPaths("/pedro.gif")}/>
              <div
                className="mb-4 tracking-tight font-extrabold text-9xl text-primary-600 text-primary-500"
              > 4
              </div>
            </div>
            <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">Désolé, cette page n&apos;existe
              pas.</p>
            <p className="mb-4 text-lg font-light text-gray-400">Si vous êtes persuadé que cette page devrait exister,
              merci de contacter un développeur.</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}