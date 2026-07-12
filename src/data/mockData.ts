// src/data/mockData.ts

import type { Member, Coach, FitnessClass, Payment, AttendanceRecord } from '../types';

// --------------------------------------------------------------------------
// Chaque tableau est typé avec "Type[]" : un tableau d'éléments de ce type.
// Si un objet ci-dessous ne respecte pas l'interface (champ manquant, ou
// mauvaise valeur pour un type union), TypeScript affichera une erreur ici
// même, avant d'exécuter quoi que ce soit.
// --------------------------------------------------------------------------

export const mockMembers: Member[] = [
  {
    id: 'm1',
    name: 'Amine Ben Salah',
    email: 'amine.bensalah@email.com',
    phone: '+216 20 123 456',
    joinDate: '2025-09-12',
    membershipType: 'Premium',
    status: 'Active',
  },
  {
    id: 'm2',
    name: 'Nour Trabelsi',
    email: 'nour.trabelsi@email.com',
    phone: '+216 22 987 654',
    joinDate: '2025-11-03',
    membershipType: 'Basic',
    status: 'Active',
  },
  {
    id: 'm3',
    name: 'Youssef Karray',
    email: 'youssef.karray@email.com',
    phone: '+216 55 456 789',
    joinDate: '2024-05-20',
    membershipType: 'VIP',
    status: 'Inactive',
  },
];

export const mockCoaches: Coach[] = [
  {
    id: 'c1',
    name: 'Sarah Mansour',
    specialty: 'Musculation',
    email: 'sarah.mansour@fitclub.com',
    experienceYears: 6,
  },
  {
    id: 'c2',
    name: 'Karim Jouini',
    specialty: 'CrossFit',
    email: 'karim.jouini@fitclub.com',
    experienceYears: 4,
  },
  {
    id: 'c3',
    name: 'Lina Cherif',
    specialty: 'Yoga & Stretching',
    email: 'lina.cherif@fitclub.com',
    experienceYears: 8,
  },
];

export const mockClasses: FitnessClass[] = [
  {
    id: 'cl1',
    name: 'Musculation Intensive',
    day: 'Lundi',
    time: '08:00',
    coachId: 'c1',
    capacity: 15,
    enrolledMemberIds: ['m1', 'm2'],
  },
  {
    id: 'cl2',
    name: 'CrossFit Découverte',
    day: 'Mercredi',
    time: '18:00',
    coachId: 'c2',
    capacity: 12,
    enrolledMemberIds: ['m1'],
  },
  {
    id: 'cl3',
    name: 'Yoga Matinal',
    day: 'Vendredi',
    time: '07:30',
    coachId: 'c3',
    capacity: 20,
    enrolledMemberIds: ['m2', 'm3'],
  },
];

export const mockPayments: Payment[] = [
  { id: 'p1', memberId: 'm1', amount: 120, date: '2026-06-01', status: 'Paid' },
  { id: 'p2', memberId: 'm2', amount: 60, date: '2026-06-03', status: 'Pending' },
  { id: 'p3', memberId: 'm3', amount: 200, date: '2026-05-15', status: 'Paid' },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', memberId: 'm1', classId: 'cl1', date: '2026-07-06', present: true },
  { id: 'a2', memberId: 'm2', classId: 'cl1', date: '2026-07-06', present: false },
];