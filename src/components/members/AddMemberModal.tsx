import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import type { Member, MembershipType } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: Member) => void;
}

const AddMemberModal = ({ isOpen, onClose, onAddMember }: AddMemberModalProps) => {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [membershipType, setMembershipType] = useState<MembershipType>('Basic');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMembershipType('Basic');
  };

  // Soumission du formulaire.
  // "e" est typé comme un événement de formulaire HTML.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement complet de la page

    // "crypto.randomUUID()" génère un identifiant unique côté navigateur.
    const newMember: Member = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      joinDate: new Date().toISOString().split('T')[0], // format "AAAA-MM-JJ"
      membershipType,
      status: 'Active',
    };

    onAddMember(newMember);
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Ajouter un membre" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex : Amine Ben Salah"
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
            placeholder="Ex : amine@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex : +216 20 123 456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type d'abonnement</label>

          <select
            value={membershipType}
            onChange={(e) => setMembershipType(e.target.value as MembershipType)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="VIP">VIP</option>
          </select>
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
            Ajouter le membre
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemberModal;