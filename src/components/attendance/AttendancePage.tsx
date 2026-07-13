import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { FitnessClass, Member, AttendanceRecord } from '../../types';

interface AttendancePageProps {
  classes: FitnessClass[];
  members: Member[];
  attendance: AttendanceRecord[];
  
  onMarkAttendance: (memberId: string, classId: string, present: boolean) => void;
}

// La date du jour, au format "AAAA-MM-JJ"
const today = new Date().toISOString().split('T')[0];

const AttendancePage = ({ classes, members, attendance, onMarkAttendance }: AttendancePageProps) => {

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id ?? '');

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Présences</h1>
        <p className="text-slate-500 mt-1">Check-in du jour ({today})</p>
      </div>

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
          {enrolledMembers.map((member) => {
            const status = getAttendanceStatus(member.id);

            return (
              <div key={member.id} className="flex items-center justify-between py-3">
                <span className="font-medium text-slate-800">{member.name}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onMarkAttendance(member.id, selectedClassId, true)}
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
                    onClick={() => onMarkAttendance(member.id, selectedClassId, false)}
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

          {enrolledMembers.length === 0 && (
            <p className="text-center text-slate-400 py-6">Aucun membre inscrit à ce cours.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;