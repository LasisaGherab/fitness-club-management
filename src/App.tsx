import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './components/dashboard/DashboardPage';
import MembersPage from './components/members/MembersPage';
import CoachesPage from './components/coaches/CoachesPage';
import ClassesPage from './components/classes/ClassesPage';
import PaymentsPage from './components/payments/Paymentspage';
import AttendancePage from './components/attendance/AttendancePage';
import type { TabId } from './types';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'members':
        return <MembersPage />;
      case 'coaches':
        return <CoachesPage />;
      case 'classes':
        return <ClassesPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'attendance':
        return <AttendancePage />;
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