import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accentColor?: string;
}

const StatCard = ({ label, value, icon: Icon, accentColor = 'text-indigo-600' }: StatCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
      {/* Le fond de l'icône reprend la couleur d'accent, en version très claire */}
      <div className={`p-3 rounded-lg bg-slate-50 ${accentColor}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;