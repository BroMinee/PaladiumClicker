import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeLogs, ChangeLogsChanges } from "@/types";
import { textFormatting } from "@/lib/misc";

type ChangeCategoryProps = {
  title: string,
  changes?: Array<string>,
  events?: Array<string>
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

/**
 * Component used in the patchnote to display a single patchnote
 * @param update - Patchnote Information
 */
export const News = ({ update }: NewsProps) => {
  return (
    <Update
      date={update.date}
      changes={update.changes}
    />
  );
};
