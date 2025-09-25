import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ChangeLogs, ChangeLogsChanges } from "@/types";

export function textFormatting(
  text: string): React.JSX.Element {
  const parts = text.split(
    /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~|°.*?°|\[.*?\]\(.*?\)|\n)/g
  );


  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong
            key={index}>{textFormatting(part.slice(2, -2))}</strong>;
        }
        if (part.startsWith("°") && part.endsWith("°")) {
          return <span key={index + "orange"} className="text-primary">
            {textFormatting(part.slice(1, -1))}
          </span>
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

        const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          return (
            <strong key={index + "strong"}><a key={index + "href"} href={linkUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
               className="text-primary hover:text-orange-700 transition-colors duration-300"
            >
              {linkText}
            </a>
            </strong>
          );
        }
        if (part === "\n") {
          return <br key={index}/>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

type ChangeCategoryProps = {
  title: string,
  changes?: Array<string>,
  events? : Array<string>
}

function ChangeCategory({ title, changes, events }: ChangeCategoryProps) {
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-2">{capitalizedTitle}</h3>
      <ul className="list-disc list-inside [&>li]:pl-4">
        {changes && changes.map((change, index) => (
          <li key={"changes-"+index}>
            {textFormatting(change)}
          </li>
        ))}
        { events && events.map((event, index) => (
          <li key={"event-"+index}>
            {textFormatting(event)}
          </li>
        ))}
      </ul>
    </div>
  );
}

type UpdateProps = {
  date: string,
  changes?: ChangeLogsChanges,
}

function Update({ date, changes }: UpdateProps) {
  return (
    <Card className="pb-2" id={date}>
      <CardHeader>
        <CardTitle className="text-primary font-bold">{date}</CardTitle>
      </CardHeader>
      <CardContent>
        {changes &&
          Object.entries(changes).map(([key, items]) =>
            items && items.length > 0 ? (
              <ChangeCategory key={date + key} title={key} changes={items} />
            ) : null
          )}
      </CardContent>
    </Card>
  );
}

interface NewsProps {
  update: ChangeLogs,
}

export const News = ({ update }: NewsProps) => {
  return (
    <Update
      date={update.date}
      changes={update.changes}
    />
  );
}
