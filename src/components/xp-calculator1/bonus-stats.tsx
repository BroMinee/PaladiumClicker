interface BonuStatsProps {
  label: string;
  value: string;
  color: string;
}
/**
 * Display the labal and value across the entire width, used color for the value
 */
export const BonusStats = ({ label, value, color }: BonuStatsProps) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-gray-400">{label}</span>
    <span className={`text-xl font-bold ${color}`}>{value}</span>
  </div>
);
