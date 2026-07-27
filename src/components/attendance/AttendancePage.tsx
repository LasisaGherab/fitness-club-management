import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { fetchClasses, fetchMembers, fetchAttendance, markAttendance } from '../../api';
import type { FitnessClass, Member, AttendanceRecord } from '../../types';

const today = new Date().toISOString().split('T')[0];

const AttendancePage = () => {
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial des 3 ressources dont cette page a besoin.
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [classesData, membersData, attendanceData] = await Promise.all([
          fetchClasses(),
          fetchMembers(),
          fetchAttendance(),
        ]);
        setClasses(classesData);
        setMembers(membersData);
        setAttendance(attendanceData);
        // On sélectionne le premier cours disponible par défaut, une fois les
        // données chargées (on ne peut pas le faire avant, elles n'existent pas encore).
        setSelectedClassId(classesData[0]?.id ?? '');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedClass = classes.find((fitnessClass) => fitnessClass.id === selectedClassId);

  const enrolledMembers: Member[] = selectedClass
    ? selectedClass.enrolledMemberIds
        .map((memberId) => members.find((member) => member.id === memberId))
        .filter((member): member is Member => member !== undefined)
    : [];

  const getAttendanceStatus = (memberId: string): boolean | undefined => {
    const record = attendance.find(
      (a) => a.memberId === memberId && a.classId === selectedClassId && a.date === today
    );
    return record?.present;
  };

  // Marque la présence, puis met à jour l'état local à partir de la réponse du serveur.
  const handleMark = async (memberId: string, present: boolean) => {
    try {
      const updatedRecord = await markAttendance(memberId, selectedClassId, present);

      setAttendance((prev) => {
        const existingIndex = prev.findIndex((record) => record.id === updatedRecord.id);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = updatedRecord;
          return updated;
        }
        return [...prev, updatedRecord];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du marquage de présence');
    }
  };

  if (isLoading) {
    return <p className="text-slate-500">Chargement des présences...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Présences</h1>
        <p className="text-slate-500 mt-1">Check-in du jour ({today})</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Choisir un cours</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full sm:w-80 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {classes.map((fitnessClass) => (
              <option key={fitnessClass.id} value={fitnessClass.id}>
                {fitnessClass.name} — {fitnessClass.day} {fitnessClass.time}
              </option>
            ))}
          </select>
        </div>

        <div className="divide-y divide-slate-100">
          {members.map((member) => {
            const status = getAttendanceStatus(member.id);

            return (
              <div key={member.id} className="flex items-center justify-between py-3">
                <span className="font-medium text-slate-800">{member.name}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleMark(member.id, true)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      status === true
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <Check size={14} /> Présent
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMark(member.id, false)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      status === false
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    <X size={14} /> Absent
                  </button>
                </div>
              </div>
            );
          })}

          {members.length === 0 && (
            <p className="text-center text-slate-400 py-6">Aucun membre enregistré.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;