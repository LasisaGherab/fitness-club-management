import { useState, useEffect } from 'react';
import { Clock, User, Plus } from 'lucide-react';
import AddClassModal from './AddClassModal';
import { fetchClasses, fetchCoaches, createClass } from '../../api';
import type { FitnessClass, Coach, DayOfWeek } from '../../types';

const daysOrder: DayOfWeek[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const ClassesPage = () => {
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [classesData, coachesData] = await Promise.all([fetchClasses(), fetchCoaches()]);
        setClasses(classesData);
        setCoaches(coachesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getCoachName = (coachId: string): string => {
    const coach = coaches.find((c) => c.id === coachId);
    return coach?.name ?? 'Coach inconnu';
  };

  // Ajoute un nouveau cours, en appelant l'API, puis met à jour l'état local.
  const handleAddClass = async (formData: {
    name: string;
    day: DayOfWeek;
    time: string;
    coachId: string;
    capacity: number;
  }) => {
    try {
      const newClass = await createClass(formData);
      setClasses((prev) => [...prev, newClass]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du cours");
    }
  };

  if (isLoading) {
    return <p className="text-slate-500">Chargement du planning...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Planning</h1>
          <p className="text-slate-500 mt-1">Les cours de la semaine et leurs coachs assignés</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} />
          Ajouter un cours
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {daysOrder.map((day) => {
          const classesForDay = classes.filter((fitnessClass) => fitnessClass.day === day);
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

        {classes.length === 0 && (
          <p className="text-center text-slate-400 py-10">Aucun cours au planning pour le moment.</p>
        )}
      </div>

      <AddClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coaches={coaches}
        onAddClass={handleAddClass}
      />
    </div>
  );
};

export default ClassesPage;