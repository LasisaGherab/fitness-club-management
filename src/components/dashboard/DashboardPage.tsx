import { Users, Dumbbell, CalendarDays, Wallet } from 'lucide-react';
import StatCard from '../ui/StatCard';
import type { Member, Coach, FitnessClass, Payment } from '../../types';

interface DashboardPageProps {
  members: Member[];
  coaches: Coach[];
  classes: FitnessClass[];
  payments: Payment[];
}

const DashboardPage = ({ members, coaches, classes, payments }: DashboardPageProps) => {

  const activeMembers = members.filter((member) => member.status === 'Active').length;

  const pendingPayments = payments.filter((payment) => payment.status === 'Pending').length;

  const totalRevenue = payments
    .filter((payment) => payment.status === 'Paid')
    .reduce((total, payment) => total + payment.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble de votre salle de sport</p>
      </div>

      {/* Grille responsive : 1 colonne sur mobile, 2 sur tablette, 4 sur desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Membres actifs" value={activeMembers} icon={Users} accentColor="text-indigo-600" />
        <StatCard label="Coachs" value={coaches.length} icon={Dumbbell} accentColor="text-emerald-600" />
        <StatCard label="Cours au planning" value={classes.length} icon={CalendarDays} accentColor="text-amber-600" />
        <StatCard label="Paiements en attente" value={pendingPayments} icon={Wallet} accentColor="text-rose-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Revenus encaissés</h2>
        <p className="text-3xl font-bold text-indigo-600">{totalRevenue} DT</p>
        <p className="text-sm text-slate-500 mt-1">Somme de tous les paiements marqués comme "Payé"</p>
      </div>
    </div>
  );
};

export default DashboardPage;