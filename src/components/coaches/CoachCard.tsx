import { Mail, Award } from 'lucide-react';
import type { Coach } from '../../types';

// Ici, la Prop s'appelle directement "coach" et son type est notre
// interface "Coach" définie dans types.ts. C'est la méthode la plus simple
// et la plus lisible : un composant qui affiche une entité reçoit
// souvent cette entité complète en une seule Prop nommée comme elle.
interface CoachCardProps {
  coach: Coach;
}

// Calcule les initiales d'un nom, utilisées comme avatar par défaut
// (si le champ optionnel "photoUrl" n'est pas fourni).
const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
};

const CoachCard = ({ coach }: CoachCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Avatar : cercle indigo avec les initiales du coach en majuscules */}
        <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-lg shrink-0">
          {getInitials(coach.name)}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{coach.name}</h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
            {coach.specialty}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Mail size={14} />
          {coach.email}
        </div>
        <div className="flex items-center gap-2">
          <Award size={14} />
          {coach.experienceYears} an(s) d'expérience
        </div>
      </div>
    </div>
  );
};

export default CoachCard;