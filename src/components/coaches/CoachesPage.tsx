import CoachCard from './CoachCard';
import type { Coach } from '../../types';

interface CoachesPageProps {
  coaches: Coach[];
}

const CoachesPage = ({ coaches }: CoachesPageProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Coachs</h1>
        <p className="text-slate-500 mt-1">{coaches.length} coach(s) dans votre équipe</p>
      </div>

      {/* Grille responsive de cartes : 1 colonne mobile, 2 tablette, 3 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </div>
  );
};

export default CoachesPage;