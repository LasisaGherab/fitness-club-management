import { Clock, User } from 'lucide-react';
import type { FitnessClass, Coach, DayOfWeek } from '../../types';

interface ClassesPageProps {
  classes: FitnessClass[];
  coaches: Coach[];
}

const daysOrder: DayOfWeek[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const ClassesPage = ({ classes, coaches }: ClassesPageProps) => {

  const getCoachName = (coachId: string): string => {
    const coach = coaches.find((c) => c.id === coachId);
    return coach?.name ?? 'Coach inconnu';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Planning</h1>
        <p className="text-slate-500 mt-1">Les cours de la semaine et leurs coachs assignés</p>
      </div>

      <div className="space-y-4">
        {daysOrder.map((day) => {
          // On filtre les cours qui ont lieu ce jour-là précisément.
          const classesForDay = classes.filter((fitnessClass) => fitnessClass.day === day);

          // On n'affiche pas les jours sans aucun cours, pour ne pas alourdir la page.
          if (classesForDay.length === 0) return null;

          return (
            <div key={day} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h2 className="font-semibold text-slate-800 mb-3">{day}</h2>
              <div className="space-y-2">
                {classesForDay.map((fitnessClass) => (
                  <div
                    key={fitnessClass.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{fitnessClass.name}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {fitnessClass.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} /> {getCoachName(fitnessClass.coachId)}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">
                      {fitnessClass.enrolledMemberIds.length}/{fitnessClass.capacity} places
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassesPage;