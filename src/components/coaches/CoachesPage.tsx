// src/components/coaches/CoachesPage.tsx (version connectée à l'API)

import { useState, useEffect } from 'react';
import { Mail, Award, Plus, Trash2 } from 'lucide-react';
import AddCoachModal from './AddCoachModal';
import { fetchCoaches, createCoach, deleteCoach } from '../../api';
import type { Coach } from '../../types';

const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
};

// CoachCard reçoit maintenant aussi une fonction de suppression.
interface CoachCardProps {
  coach: Coach;
  onDelete: (id: string) => void;
}

const CoachCard = ({ coach, onDelete }: CoachCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
      <button
        type="button"
        onClick={() => onDelete(coach.id)}
        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500"
        aria-label={`Supprimer ${coach.name}`}
      >
        <Trash2 size={16} />
      </button>

      <div className="flex items-center gap-4">
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

const CoachesPage = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCoaches();
        setCoaches(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    loadCoaches();
  }, []);

  const handleAddCoach = async (formData: {
    name: string;
    specialty: string;
    email: string;
    experienceYears: number;
  }) => {
    try {
      const newCoach = await createCoach(formData);
      setCoaches((prev) => [...prev, newCoach]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const handleDeleteCoach = async (id: string) => {
    try {
      await deleteCoach(id);
      setCoaches((prev) => prev.filter((coach) => coach.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return <p className="text-slate-500">Chargement des coachs...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Coachs</h1>
          <p className="text-slate-500 mt-1">{coaches.length} coach(s) dans votre équipe</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} />
          Ajouter un coach
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} onDelete={handleDeleteCoach} />
        ))}
      </div>

      {coaches.length === 0 && (
        <p className="text-center text-slate-400 py-10">Aucun coach pour le moment.</p>
      )}

      <AddCoachModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddCoach={handleAddCoach} />
    </div>
  );
};

export default CoachesPage;