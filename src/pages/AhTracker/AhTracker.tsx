import Layout from "@/components/shared/Layout.tsx";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaBoxOpen, FaHeart } from "react-icons/fa";
import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { getAhItemData, getPaladiumAhItemFullHistory, getPaladiumAhItemStats } from "@/lib/apiPala.ts";
import { AhItemHistory, AhPaladium } from "@/types";
import Selector from "@/components/shared/Selector.tsx";
import { LuCalendarClock } from "react-icons/lu";
import { formatPrice, levensteinDistance } from "@/lib/misc.ts";
import { GetAllFileNameInFolder } from "@/pages/Profil/Profil.tsx";

type itemHoverType = {
  quantityAvailable: number,
  averagePrice: number,
  date: string,
  price: number,
  pricePb: number,
  quantitySold: number,
  sells: number,
  sellsPb: number,
}

const itemHoverTypeInit = {
  quantityAvailable: 0,
  averagePrice: 0,
  date: new Date(0).toISOString().split("T")[0],
  price: 0,
  pricePb: 0,
  quantitySold: 0,
  sells: 0,
  sellsPb: 0,
}

const ProfilPage = () => {
  return (
    <>
      <Layout>
        <AhInfo/>
      </Layout>
    </>
  );
}


const AhInfo = () => {
  const [itemHover, setItemHover] = useState(itemHoverTypeInit as itemHoverType);
  const [itemAvailable, setItemAvailable] = useState<Awaited<ReturnType<typeof getAhItemData>>>([]);
  const [inputValue, setInputValue] = useState("");
  const [x, setX] = useState([] as string[]);
  const [y, setY] = useState([] as AhItemHistory[]);


  useEffect(() => {
    const fetchData = async () => {
      const data = await getAhItemData();
      setItemAvailable(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (inputValue.length === 0)
      return;

    getPaladiumAhItemFullHistory(inputValue).then((data) => {
      const listX = [] as string[];
      const listY = [] as AhItemHistory[];
      data.map((item) => {
        listX.push(item.date);
        listY.push(item);
      });

      getPaladiumAhItemStats(inputValue).then((data) => {
        setItemHover({
          ...itemHover,
          quantityAvailable: data.quantityAvailable,
          averagePrice: Math.round((data.priceSum / (data.countListings === 0 ? 1 : data.countListings)) * 100) / 100,
        });
      });

      setX(listX);
      setY(listY);

    });
  }, [inputValue]);


  return <div className="flex flex-col gap-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Bienvenue sur{" "}
          <GradientText className="font-extrabold">l'AH Tracker</GradientText>
        </CardTitle>
        <CardDescription>
          Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
        </CardDescription>
      </CardHeader>
    </Card>
    <Card className="bg-red-700">
      <CardHeader>
        <CardTitle className="text-primary-foreground">
          Le prix de vente en $ journalier est inexact, il est calculé en divisant la somme des prix de vente
          en $ par
          le nombre de ventes journalières, or le nombre de ventes journalières contient aussi les ventes en pbs.
          Il y a
          donc une surévaluation du vrai prix.
          Cela sera corrigé après une mise à jour de l'API de Paladium.
        </CardTitle>
      </CardHeader>
    </Card>
    <div className="grid md:grid-cols-4 md:grid-rows-3 gap-4 grid-cols-1 grid-rows-6">
      <MarketSelector itemAvailable={itemAvailable} setInputValue={setInputValue} itemHover={itemHover}
                      inputValue={inputValue}/>
      <AhInfoSelected itemHover={itemHover}/>
    </div>
    <div className="w-full">
      {x.length === 0 ? <Card className="col-start-1 col-span-4 w-full">
          <CardHeader>
            <CardTitle>
              Veuillez sélectionner un item
            </CardTitle>
          </CardHeader>
        </Card>
        :
        <GraphItem x={x} y={y} itemHover={itemHover} setItemHover={setItemHover} inputValue={inputValue}/>}

    </div>

  </div>
}


const AhInfoSelected = ({ itemHover }: CurrentAhInfoProps) => {
  return [
    <Card key="Info-selected" className="md:col-start-3 md:col-span-2 md:row-start-1 ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Information sélectionnée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Passe ta souris sur le graphique pour voir les informations détaillées du jour.
        </CardDescription>
      </CardContent>

    </Card>,
    <Card key="Selected-prix">
      <SmallCardInfo title="Prix"
                     value={`${formatPrice(Math.round(itemHover.price / (itemHover.sells === 0 ? 1 : itemHover.sells) * 100) / 100)} $`}
                     img="dollar.png"/>
    </Card>,
    <Card key="Selected-date">
      <SmallCardInfo title="Date" value={itemHover.date} img="clock.gif"/>
    </Card>,

    <Card key="Selected-prix-pb">
      <SmallCardInfo title="Prix en pb"
                     value={`${formatPrice(Math.round(itemHover.pricePb / (itemHover.sellsPb === 0 ? 1 : itemHover.sellsPb) * 100) / 100)} pbs`}
                     img="pbs.png"/>
    </Card>,
    <Card key="Selected-daily">
      <CardContent className="h-full pt-6 flex items-center gap-4">
        <LuCalendarClock className="size-12 mr-2"/>
        <div className="flex flex-col gap-2">
          <span className="font-semibold">Lots vendus ce jour</span>
          <div className="flex gap-2 items-center">
            <GradientText className="font-bold">
              {formatPrice(itemHover.sells + itemHover.sellsPb)}
            </GradientText>
          </div>
        </div>
      </CardContent>
    </Card>]
}

type MarketSelectorProps = {
  itemAvailable: AhPaladium[]
  setInputValue: (value: string) => void,
  itemHover: itemHoverType,
  inputValue: string
}

const MarketSelector = ({ itemAvailable, setInputValue, itemHover, inputValue }: MarketSelectorProps) => {

  const closestItemName = inputValue.length === 0 ? "" : GetAllFileNameInFolder().reduce((acc, curr) => {
    if (levensteinDistance(curr, inputValue) < levensteinDistance(acc, inputValue)) {
      return curr;
    } else {
      return acc;
    }
  });


  return <Card className="md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-3 row-span-3">
    <CardContent className="gap-2 flex flex-col pt-4">
      <Selector options={itemAvailable} setInputValue={setInputValue}/>
      {inputValue.length === 0 ? "" :
        [<Card key="nameItem">
          <SmallCardInfo title={inputValue} value="Image non contractuelle"
                         img={`AH_img/${closestItemName}.png`}/>
        </Card>, <Card key="quantity">
          <CardContent className="h-full pt-6 flex items-center gap-4">
            <FaBoxOpen className="size-12 mr-2"/>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Quantité en vente actuellement</span>
              <div className="flex gap-2 items-center">
                <GradientText className="font-bold">
                  {`x${formatPrice(itemHover.quantityAvailable)}`}
                </GradientText>
              </div>
            </div>
          </CardContent>
        </Card>, <Card key="avgPrice">
          <SmallCardInfo title="Prix moyen actuellement en vente"
                         value={`${formatPrice(itemHover.averagePrice)} $`}
                         img="dollar.png"/>
        </Card>]
      }
    </CardContent>
  </Card>
}

type GraphItemProps = {
  x: string[],
  y: AhItemHistory[],
  itemHover: itemHoverType,
  setItemHover: (itemHover: itemHoverType) => void,
  inputValue: string
}

type CurrentAhInfoProps = {
  itemHover: itemHoverType
}

const GraphItem = ({ x, y, itemHover, setItemHover, inputValue }: GraphItemProps) => {
  return <Plot
    onHover={(data) => setItemHover(
      {
        ...itemHover,
        ...y[data.points[0].pointIndex],
      })
    }
    className="w-full col-start-1 col-span-4"
    data={
      [
        {
          x: x,
          y: y.map((item) => item.price / item.sells),
          type: 'scatter',
          mode: 'lines',
          fill: "tozeroy",
          marker: { color: '#FF5C00' },
          name: "Prix en $",
        },
        {
          x: x,
          y: y.map((item) => item.quantity),
          type: 'scatter',
          fill: "tozeroy",
          mode: 'lines',
          marker: { color: '#007aff' },
          name: "Nombre de ventes par jour",
          yaxis: 'y2',
        },
      ]
    }
    layout={{
      title: `Historique du prix - ${inputValue}`,
      autosize: true,
      yaxis: { title: 'Prix en $', type: 'linear' },
      yaxis2: {
        title: 'Nombre de ventes par jour',
        titlefont: { color: '#007aff' },
        tickfont: { color: '#007aff' },
        overlaying: 'y',
        side: 'right',
      }
    }}
  />
}


export default ProfilPage;