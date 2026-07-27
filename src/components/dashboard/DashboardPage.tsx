import { useState, useEffect } from 'react';
import { Users, Dumbbell, CalendarDays, Wallet } from 'lucide-react';
import StatCard from '../ui/StatCard';
import { fetchDashboardStats } from '../../api';
import type { DashboardStats } from '../../api';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement unique, au montage du composant.
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return <p className="text-slate-500">Chargement du dashboard...</p>;
  }

  if (error || !stats) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
        {error ?? 'Impossible de charger les statistiques.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble de votre salle de sport</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Membres actifs" value={stats.activeMembers} icon={Users} accentColor="text-indigo-600" />
        <StatCard label="Coachs" value={stats.totalCoaches} icon={Dumbbell} accentColor="text-emerald-600" />
        <StatCard label="Cours au planning" value={stats.totalClasses} icon={CalendarDays} accentColor="text-amber-600" />
        <StatCard label="Paiements en attente" value={stats.pendingPayments} icon={Wallet} accentColor="text-rose-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Revenus encaissés</h2>
        <p className="text-3xl font-bold text-indigo-600">{stats.totalRevenue} DT</p>
        <p className="text-sm text-slate-500 mt-1">Somme de tous les paiements marqués comme "Payé"</p>
      </div>
    </div>
  );
};

export default DashboardPage;