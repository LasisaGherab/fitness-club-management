import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './components/dashboard/DashboardPage';
import MembersPage from './components/members/MembersPage';
import CoachesPage from './components/coaches/CoachesPage';
import ClassesPage from './components/classes/ClassesPage'; 
import AttendancePage from './components/attendance/AttendancePage';
import PaymentsPage from './components/payments/Paymentspage';
import useLocalStorage from './hooks/useLocalStorage';
import { mockMembers, mockCoaches, mockClasses, mockPayments, mockAttendance } from './data/mockData';
import type { TabId, Member, Coach, FitnessClass, Payment, AttendanceRecord } from './types';


const App = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Nos 4 sources de données principales, initialisées avec les Mock Data.
  // Chaque useState est typé avec un tableau précis : useState<Member[]>.
  const [members, setMembers] = useLocalStorage<Member[]>('fitclub_members', mockMembers);
  const [coaches] = useLocalStorage<Coach[]>('fitclub_coaches', mockCoaches);
  const [classes] = useLocalStorage<FitnessClass[]>('fitclub_classes', mockClasses);
  const [payments] = useLocalStorage<Payment[]>('fitclub_payments', mockPayments);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>(
    'fitclub_attendance',
    mockAttendance
  );


  const handleAddMember = (newMember: Member) => {
    setMembers((prev) => [...prev, newMember]);
  };
  const handleDeleteMember = (memberId: string) => {
  setMembers((prev) => prev.filter((member) => member.id !== memberId));
  }; 
  
  // Marque (ou remplace) la présence d'un membre pour un cours et la date du jour.
  const handleMarkAttendance = (memberId: string, classId: string, present: boolean) => {
    const today = new Date().toISOString().split('T')[0];

    setAttendance((prev) => {
      // On vérifie si un enregistrement existe déjà pour ce membre, ce cours, aujourd'hui.
      const existingIndex = prev.findIndex(
        (record) => record.memberId === memberId && record.classId === classId && record.date === today
      );

      if (existingIndex !== -1) {
        // S'il existe déjà, on le met à jour (on ne duplique jamais un enregistrement).
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], present };
        return updated;
      }

      // Sinon, on crée un nouvel enregistrement.
      const newRecord: AttendanceRecord = {
        id: crypto.randomUUID(),
        memberId,
        classId,
        date: today,
        present,
      };
      return [...prev, newRecord];
    });
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
        return <CoachesPage coaches={coaches} />;
      case 'classes':
        return <ClassesPage classes={classes} coaches={coaches} />;
      case 'payments':
        return <PaymentsPage payments={payments} members={members} />;
      case 'attendance':
          return (
            <AttendancePage
              classes={classes}
              members={members}
              attendance={attendance}
              onMarkAttendance={handleMarkAttendance}
            />
          );
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