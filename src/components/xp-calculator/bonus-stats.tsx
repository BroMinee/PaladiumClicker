import { cn } from "@/lib/utils";

interface BonuStatsProps {
  label: string;
  value: string;
  classNameValue: string;
  classNameLabel?: string;
}
/**
 * Display the labal and value across the entire width, used color for the value
 */
export const BonusStats = ({ label, value, classNameValue, classNameLabel }: BonuStatsProps) => (
  <div className="flex justify-between items-center py-2">
    <span className={cn("text-card-foreground", classNameLabel)}>{label}</span>
    <span className={cn("text-xl font-bold", classNameValue)}>{value}</span>
  </div>
);
