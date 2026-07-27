import { useState, useEffect } from 'react';
import { fetchMembers, fetchPayments, updatePaymentStatus, createPayment } from '../../api';
import type { Member, Payment, PaymentStatus, MembershipType } from '../../types';

type StatusFilter = PaymentStatus | 'All';

// Le tarif fixe associé à chaque type d'abonnement.
// Modifiez librement ces montants selon votre grille tarifaire réelle.
const MEMBERSHIP_PRICES: Record<MembershipType, number> = {
  Basic: 50,
  Premium: 90,
  VIP: 150,
};

// Retrouve le tarif attendu pour un membre, selon son abonnement.
const getExpectedAmount = (member: Member): number => {
  return MEMBERSHIP_PRICES[member.membershipType];
};

// Une "ligne" de la page : un membre, associé (ou non) à son paiement le plus récent.
interface MemberPaymentRow {
  member: Member;
  payment: Payment | undefined;
}

const PaymentsPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      // IMPORTANT : les deux appels sont volontairement INDÉPENDANTS l'un de
      // l'autre (chacun son propre .catch()), plutôt qu'un seul Promise.all.
      // Avec Promise.all, la moindre erreur sur l'un des deux appels aurait
      // fait échouer TOUTE la Promise, laissant "members" ET "payments" à
      // leur valeur initiale ([]) — c'est ce qui provoquait la page vide.
      const membersResult = await fetchMembers().catch((err) => {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des membres');
        return [] as Member[];
      });

      const paymentsResult = await fetchPayments().catch((err) => {
        setError((prev) => prev ?? (err instanceof Error ? err.message : 'Erreur lors du chargement des paiements'));
        return [] as Payment[];
      });

      setMembers(membersResult);
      setPayments(paymentsResult);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Retrouve le paiement le PLUS RÉCENT d'un membre (s'il en a plusieurs),
  // ou "undefined" s'il n'a encore jamais payé.
  const getLatestPaymentForMember = (memberId: string): Payment | undefined => {
    const memberPayments = payments.filter((payment) => payment.memberId === memberId);
    if (memberPayments.length === 0) return undefined;
    return [...memberPayments].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  };

  // La page est maintenant PILOTÉE PAR LES MEMBRES : on construit une ligne
  // pour CHAQUE membre (la "liste globale"), qu'il ait déjà payé ou non.
  const rows: MemberPaymentRow[] = members.map((member) => ({
    member,
    payment: getLatestPaymentForMember(member.id),
  }));

  // Un membre sans aucun paiement est considéré "En attente" par défaut pour le filtre.
  const filteredRows = rows.filter((row) => {
    if (statusFilter === 'All') return true;
    const effectiveStatus: PaymentStatus = row.payment?.status ?? 'Pending';
    return effectiveStatus === statusFilter;
  });

  const handleToggleStatus = async (row: MemberPaymentRow) => {
    try {
      if (row.payment) {
        // Un paiement existe déjà : on bascule simplement son statut.
        const newStatus: PaymentStatus = row.payment.status === 'Paid' ? 'Pending' : 'Paid';
        const updated = await updatePaymentStatus(row.payment.id, newStatus);
        setPayments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        // Aucun paiement n'existe encore pour ce membre : on en crée un premier avec le tarif de son abonnement.
        const created = await createPayment({
          memberId: row.member.id,
          amount: getExpectedAmount(row.member),
          date: new Date().toISOString().split('T')[0],
          status: 'Paid',
        });
        setPayments((prev) => [...prev, created]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du paiement');
    }
  };

  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'All', label: 'Tous' },
    { value: 'Paid', label: 'Payé' },
    { value: 'Pending', label: 'En attente' },
  ];

  if (isLoading) {
    return <p className="text-slate-500">Chargement des paiements...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Paiements</h1>
        <p className="text-slate-500 mt-1">Suivi des statuts de paiement des membres</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

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
            {filteredRows.map((row) => (
              <tr key={row.member.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{row.member.name}</td>
                <td className="px-6 py-4 text-slate-500">
                  {row.payment ? `${row.payment.amount} DT` : `${getExpectedAmount(row.member)} DT`}
                </td>
                <td className="px-6 py-4 text-slate-500">{row.payment?.date ?? '—'}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(row)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      !row.payment
                        ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        : row.payment.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                    title={row.payment ? 'Cliquer pour changer le statut' : 'Cliquer pour enregistrer un premier paiement'}
                  >
                    {!row.payment ? 'Sans paiement' : row.payment.status === 'Paid' ? 'Payé' : 'En attente'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRows.length === 0 && (
          <p className="text-center text-slate-400 py-10">Aucun membre pour ce filtre.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;