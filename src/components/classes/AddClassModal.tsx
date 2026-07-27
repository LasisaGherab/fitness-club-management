import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import type { Coach, DayOfWeek } from '../../types';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  coaches: Coach[]; // La liste des coachs, pour remplir le menu déroulant
  onAddClass: (data: {
    name: string;
    day: DayOfWeek;
    time: string;
    coachId: string;
    capacity: number;
  }) => Promise<void>;
}

const daysOfWeek: DayOfWeek[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const AddClassModal = ({ isOpen, onClose, coaches, onAddClass }: AddClassModalProps) => {
  const [name, setName] = useState<string>('');
  const [day, setDay] = useState<DayOfWeek>('Lundi');
  const [time, setTime] = useState<string>('08:00');
  const [coachId, setCoachId] = useState<string>(coaches[0]?.id ?? '');
  const [capacity, setCapacity] = useState<number>(10);

  const resetForm = () => {
    setName('');
    setDay('Lundi');
    setTime('08:00');
    setCoachId(coaches[0]?.id ?? '');
    setCapacity(10);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await onAddClass({ name, day, time, coachId, capacity });
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Ajouter un cours" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom du cours</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex : Yoga Matinal"
          />
        </div>

        {/* "grid-cols-2" place Jour et Heure côte à côte, pour un formulaire plus compact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jour</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as DayOfWeek)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Heure</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Coach</label>
          <select
            value={coachId}
            onChange={(e) => setCoachId(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {coaches.length === 0 && <option value="">Aucun coach disponible</option>}
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Capacité (places)</label>
          <input
            type="number"
            required
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
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
            Ajouter le cours
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClassModal;