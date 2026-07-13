import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AddMemberModal from './AddMemberModal';
import type { Member } from '../../types';

interface MembersPageProps {
  members: Member[];

  onAddMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
}

// Un petit composant interne pour afficher un badge de statut coloré.
// Il est défini dans ce même fichier car il n'est utilisé que par MembersPage.
const StatusBadge = ({ status }: { status: Member['status'] }) => {
  const isActive = status === 'Active';
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {isActive ? 'Actif' : 'Inactif'}
    </span>
  );
};

const MembersPage = ({ members, onAddMember, onDeleteMember }: MembersPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Membres</h1>
          <p className="text-slate-500 mt-1">{members.length} membre(s) enregistré(s)</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} />
          Ajouter un membre
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Abonnement</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{member.name}</td>
                <td className="px-6 py-4 text-slate-500">{member.email}</td>
                <td className="px-6 py-4 text-slate-500">{member.membershipType}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={member.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDeleteMember(member.id)}
                    className="text-rose-500 hover:text-rose-700"
                    aria-label={`Supprimer ${member.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <p className="text-center text-slate-400 py-10">Aucun membre pour le moment.</p>
        )}
      </div>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMember={onAddMember}
      />
    </div>
  );
};

export default MembersPage;