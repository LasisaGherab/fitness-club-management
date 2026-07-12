import React from 'react';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarDays,
  CreditCard,
  ClipboardCheck,
} from 'lucide-react';
import type { TabId } from '../../types';

// On décrit précisément ce que le composant Sidebar attend de son parent.
interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

// On définit ici, une seule fois, la liste des onglets à afficher.
// Chaque entrée associe un identifiant (TabId), un libellé et une icône.
// Ce tableau est typé grâce à "id: TabId", ce qui garantit que l'on ne peut
// pas ajouter par erreur un onglet qui n'existe pas dans notre type union.
const navItems: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'members', label: 'Membres', icon: Users },
  { id: 'coaches', label: 'Coachs', icon: Dumbbell },
  { id: 'classes', label: 'Planning', icon: CalendarDays },
  { id: 'payments', label: 'Paiements', icon: CreditCard },
  { id: 'attendance', label: 'Présences', icon: ClipboardCheck },
];

// Composant fonctionnel : on déstructure directement les Props reçues.
// Le typage ": SidebarProps" garantit que si "activeTab" ou "onTabChange"
// venait à manquer lors de l'utilisation du composant, une erreur apparaîtrait.
const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    // Barre latérale fixe, hauteur pleine écran, fond blanc, bordure à droite
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      {/* En-tête de la Sidebar : logo / nom de l'application */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
        <Dumbbell className="text-indigo-600" size={24} />
        <span className="font-semibold text-slate-800 text-lg">FitClub</span>
      </div>

      {/* Liste de navigation : on affiche un bouton par entrée de navItems */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Pied de la Sidebar */}
      <div className="px-6 py-4 border-t border-slate-200 text-xs text-slate-400">
        Fitness Club Management
      </div>
    </aside>
  );
};

export default Sidebar;