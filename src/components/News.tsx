// const News = () => {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           Voir les nouvelles fonctionnalités
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="px-0 pb-0 max-w-4xl">
//         <DialogHeader className="px-6">
//           <DialogTitle className="text-primary">News depuis la dernière fois</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="h-[80dvh] px-6 border-t">
//           <Discord className="mt-4"/>
//           <div className="py-2">
//             {newsJson.map((element, index) => (
//               <New
//                 date={element.date}
//                 events={element.events}
//                 key={index}
//               />
//             ))}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import React from "react";


function textFormatting(
  text: string): JSX.Element {
  const parts = text.split(
    /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~)/g
  );


  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong
            key={index}>{textFormatting(part.slice(2, -2))}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em
            key={index}>{textFormatting(part.slice(1, -1))}</em>;
        }
        if (part.startsWith("__") && part.endsWith("__")) {
          return <u
            key={index}>{textFormatting(part.slice(2, -2))}</u>;
        }
        if (part.startsWith("~~") && part.endsWith("~~")) {
          return <s
            key={index}>{textFormatting(part.slice(2, -2))}</s>;
        }
        if (part === "\n") {
          return <br key={index}/>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

type NewProps = {
  date: string,
  events: string[],
}

export default function New({ date, events }: NewProps) {
  return (
    <Card className="pb-2" id={date}>
      <CardHeader>
        <CardTitle className="text-primary font-bold">{date}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside [&>li]:pl-4">
          {events.map((event, index) => {
            return <li key={index}>{textFormatting(event)}</li>
          })}
        </ul>
      </CardContent>
    </Card>
  );
}




