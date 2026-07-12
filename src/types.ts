// src/types.ts

// --------------------------------------------------------------------------
// TYPES "UNION" : ce sont des listes fermées de valeurs possibles.
// Exemple : un membre ne peut être QUE 'Active' OU 'Inactive', rien d'autre.
// TypeScript nous empêchera d'écrire une faute de frappe comme 'active' (minuscule)
// ou 'Actives' : ce sont de vraies erreurs détectées à l'écriture du code.
// --------------------------------------------------------------------------

// Les onglets disponibles dans notre Sidebar (utilisé au Chapitre 1)
export type TabId =
  | 'dashboard'
  | 'members'
  | 'coaches'
  | 'classes'
  | 'payments'
  | 'attendance';

// Le type d'abonnement d'un membre
export type MembershipType = 'Basic' | 'Premium' | 'VIP';

// Le statut d'un membre (client actif ou parti)
export type MemberStatus = 'Active' | 'Inactive';

// Le statut d'un paiement (utilisé au Chapitre 6)
export type PaymentStatus = 'Paid' | 'Pending';

// Les jours de la semaine pour le planning (utilisé au Chapitre 5)
export type DayOfWeek =
  | 'Lundi'
  | 'Mardi'
  | 'Mercredi'
  | 'Jeudi'
  | 'Vendredi'
  | 'Samedi'
  | 'Dimanche';

// --------------------------------------------------------------------------
// INTERFACES : la "carte d'identité" de chaque donnée métier de l'application.
// Chaque propriété a un nom et un type. Le "?" rend une propriété optionnelle.
// --------------------------------------------------------------------------

// Un membre du club de sport
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;           // Date au format ISO, ex : "2026-01-15"
  membershipType: MembershipType;
  status: MemberStatus;
}

// Un coach sportif
export interface Coach {
  id: string;
  name: string;
  specialty: string;          // Ex : "Musculation", "Yoga", "CrossFit"
  email: string;
  experienceYears: number;
  photoUrl?: string;           // Optionnel : on affichera des initiales si absent
}

// Un cours de fitness dans le planning
export interface FitnessClass {
  id: string;
  name: string;                // Ex : "Yoga Matinal"
  day: DayOfWeek;
  time: string;                 // Ex : "09:00"
  coachId: string;               // Référence vers l'id d'un Coach
  capacity: number;               // Nombre maximum de participants
  enrolledMemberIds: string[];      // Les ids des membres inscrits à ce cours
}

// Un paiement lié à un membre
export interface Payment {
  id: string;
  memberId: string;             // Référence vers l'id d'un Member
  amount: number;
  date: string;
  status: PaymentStatus;
}

// Un enregistrement de présence (check-in quotidien)
export interface AttendanceRecord {
  id: string;
  memberId: string;             // Référence vers l'id d'un Member
  classId: string;                // Référence vers l'id d'un FitnessClass
  date: string;                    // Le jour concerné, ex : "2026-07-07"
  present: boolean;
}