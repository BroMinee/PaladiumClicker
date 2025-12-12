import { Card } from "@/components/ui/card";
import { MetierKey } from "@/types";
import { JobLevel, JobProgressbar } from "./player-jobs.client";
import { prettyJobName } from "@/lib/misc";
import { constants } from "@/lib/constants";

/**
 * Display the job card
 * @param jobName - The job name we are displaying
 */
export function JobCard({ jobName }: { jobName: MetierKey }) {
  return (
    <Card>
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-lg font-semibold">{prettyJobName(jobName)}</h3>
        <span className="text-sm font-bold">
          <JobLevel jobName={jobName}/>
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2.5">
        <JobProgressbar jobName={jobName}/>
      </div>
    </Card>
  );
}

/**
 * Display all the jobs card
 */
export function JobsCard() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Métiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {constants.METIER_KEY.map(e => {
          return <JobCard jobName={e} key={e}/>;
        })}

      </div>
    </div>);
}