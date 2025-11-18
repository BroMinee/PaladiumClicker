import { Card } from "../ui/card-v2";
import { MetierKey } from "@/types";
import { JobLevel, JobProgressbar } from "./player-jobs.client";
import { prettyJobName } from "@/lib/misc";

/**
 * Display the job card
 * @param jobName - The job name we are displaying
 */
export function JobCard({ jobName }: { jobName: MetierKey }) {
  return (
    <Card>
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-lg font-semibold">{prettyJobName(jobName)}</h3>
        <span className="text-sm font-bold text-gray-300">
          <JobLevel jobName={jobName}/>
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <JobProgressbar jobName={jobName}/>
      </div>
    </Card>
  );
}