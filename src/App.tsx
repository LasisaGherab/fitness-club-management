import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './components/dashboard/DashboardPage';
import MembersPage from './components/members/MembersPage';
import { mockMembers, mockCoaches, mockClasses, mockPayments } from './data/mockData';
import type { TabId, Member, Coach, FitnessClass, Payment } from './types';


const App = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Nos 4 sources de données principales, initialisées avec les Mock Data.
  // Chaque useState est typé avec un tableau précis : useState<Member[]>.
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [coaches] = useState<Coach[]>(mockCoaches);
  const [classes] = useState<FitnessClass[]>(mockClasses);
  const [payments] = useState<Payment[]>(mockPayments);

  const handleAddMember = (newMember: Member) => {
    setMembers((prev) => [...prev, newMember]);
  };
  const handleDeleteMember = (memberId: string) => {
  setMembers((prev) => prev.filter((member) => member.id !== memberId));
  };  

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            members={members}
            coaches={coaches}
            classes={classes}
            payments={payments}
          />
        );
      case 'members':
        return (
          <MembersPage
            members={members}
            onAddMember={handleAddMember}
            onDeleteMember={handleDeleteMember}
          />
        );
      case 'coaches':
        return <p className="text-slate-500">Page Coachs (Chapitre 4)</p>;
      case 'classes':
        return <p className="text-slate-500">Page Planning (Chapitre 5)</p>;
      case 'payments':
        return <p className="text-slate-500">Page Paiements (Chapitre 6)</p>;
      case 'attendance':
        return <p className="text-slate-500">Page Présences (Chapitre 5)</p>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-64 p-8">{renderPage()}</main>
    </div>
  );
};

export default App;