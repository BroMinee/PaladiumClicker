import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import Layout from "@/components/shared/Layout.tsx";


const CustomFallback = ({ error }: { error: Error }) => (
  <Layout>
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl tracking-tight font-bold">Aie une erreur est survenue !</CardTitle>
        <div className="text-xl tracking-tight font-bold text-red-500">{error.message}</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <div>{error.stack?.split("\n").map((line, index) => (
            <div key={line + index} className="flex md:flex-row flex-col gap-2">
              <div>
                {line.split("@")[0]}
              </div>
              <div className="dark:text-gray-400 text-gray-500">
                {line.split("@")[1]}
              </div>
            </div>
          ))}</div>
        </div>
      </CardContent>
    </Card>
  </Layout>

)

const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={CustomFallback}>
    <Outlet/>
  </ErrorBoundary>
);

export default ErrorBoundaryLayout;