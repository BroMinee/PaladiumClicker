import { JobCard } from "./player-jobs.client";
import { constants } from "@/lib/constants";

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