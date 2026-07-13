import { useState } from 'react';
import type { Payment, Member, PaymentStatus } from '../../types';

interface PaymentsPageProps {
  payments: Payment[];
  members: Member[];
}

// Le filtre peut valoir soit un statut précis, soit 'All' pour "tout afficher".
// On définit ce type localement, car il n'est utile qu'à ce composant.
type StatusFilter = PaymentStatus | 'All';

const PaymentsPage = ({ payments, members }: PaymentsPageProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const getMemberName = (memberId: string): string => {
    const member = members.find((m) => m.id === memberId);
    return member?.name ?? 'Membre inconnu';
  };

  // Le filtrage : si "All" est sélectionné, on garde tout ; sinon, on ne garde
  // que les paiements dont le statut correspond exactement au filtre choisi.
  const filteredPayments =
    statusFilter === 'All' ? payments : payments.filter((payment) => payment.status === statusFilter);

  // Les boutons de filtre sont générés depuis un tableau typé, pour éviter
  // de dupliquer 3 fois le même bouton avec seulement le texte qui change.
  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'All', label: 'Tous' },
    { value: 'Paid', label: 'Payé' },
    { value: 'Pending', label: 'En attente' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Paiements</h1>
        <p className="text-slate-500 mt-1">Suivi des statuts de paiement des membres</p>
      </div>

      {/* Boutons de filtre */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              statusFilter === filter.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Membre</th>
              <th className="px-6 py-3">Montant</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{getMemberName(payment.memberId)}</td>
                <td className="px-6 py-4 text-slate-500">{payment.amount} DT</td>
                <td className="px-6 py-4 text-slate-500">{payment.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {payment.status === 'Paid' ? 'Payé' : 'En attente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <p className="text-center text-slate-400 py-10">Aucun paiement pour ce filtre.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;