import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import type { Coach } from '../../types';

interface AddCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoach: (data: {
    name: string;
    specialty: string;
    email: string;
    experienceYears: number;
  }) => Promise<void>;
}

const AddCoachModal = ({ isOpen, onClose, onAddCoach }: AddCoachModalProps) => {
  const [name, setName] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<number>(1);

  const resetForm = () => {
    setName('');
    setSpecialty('');
    setEmail('');
    setExperienceYears(1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onAddCoach({ name, specialty, email, experienceYears });
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Ajouter un coach" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex : Sarah Mansour"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Spécialité</label>
          <input
            type="text"
            required
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex : Musculation, Yoga, CrossFit..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex : sarah@fitclub.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Années d'expérience</label>
          <input
            type="number"
            required
            min={0}
            value={experienceYears}
            // "e.target.value" est toujours une chaîne de caractères en HTML :
            // on la convertit explicitement en nombre avec Number(...), pour
            // que notre état reste bien typé "number", jamais "string".
            onChange={(e) => setExperienceYears(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Ajouter le coach
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCoachModal;