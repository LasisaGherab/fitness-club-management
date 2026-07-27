import type { 
  Member, 
  Coach, 
  FitnessClass, 
  Payment, 
  AttendanceRecord, 
  MembershipType, 
  PaymentStatus, 
  MemberStatus, 
  DayOfWeek
} from './types';

const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(errorBody.message ?? `Erreur HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
};

// ----------------------------- DASHBOARD -----------------------------------

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalCoaches: number;
  totalClasses: number;
  pendingPayments: number;
  totalRevenue: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  return handleResponse<DashboardStats>(response);
};

// ----------------------------- MEMBRES -------------------------------------

export const fetchMembers = async (): Promise<Member[]> => {
  const response = await fetch(`${API_BASE_URL}/members`);
  return handleResponse<Member[]>(response);
};

export const createMember = async (data: {
  name: string;
  email: string;
  phone: string;
  membershipType: MembershipType;
}): Promise<Member> => {
  const response = await fetch(`${API_BASE_URL}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Member>(response);
};

export const deleteMember = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/members/${id}`, { method: 'DELETE' });
  await handleResponse<{ message: string; id: string }>(response);
};

export const updateMemberStatus = async (id: string, status: MemberStatus): Promise<Member> => {
  const response = await fetch(`${API_BASE_URL}/members/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Member>(response);
};

// ----------------------------- COACHS ---------------------------------------

export const fetchCoaches = async (): Promise<Coach[]> => {
  const response = await fetch(`${API_BASE_URL}/coaches`);
  return handleResponse<Coach[]>(response);
};

export const createCoach = async (data: {
  name: string;
  specialty: string;
  email: string;
  experienceYears: number;
}): Promise<Coach> => {
  const response = await fetch(`${API_BASE_URL}/coaches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Coach>(response);
};

export const deleteCoach = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/coaches/${id}`, { method: 'DELETE' });
  await handleResponse<{ message: string; id: string }>(response);
};

// ----------------------------- CLASSES --------------------------------------

export const fetchClasses = async (): Promise<FitnessClass[]> => {
  const response = await fetch(`${API_BASE_URL}/classes`);
  return handleResponse<FitnessClass[]>(response);
};

export const createClass = async (data: {
  name: string;
  day: DayOfWeek;
  time: string;
  coachId: string;
  capacity: number;
}): Promise<FitnessClass> => {
  const response = await fetch(`${API_BASE_URL}/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<FitnessClass>(response);
};

// ----------------------------- PAIEMENTS ------------------------------------

export const fetchPayments = async (): Promise<Payment[]> => {
  const response = await fetch(`${API_BASE_URL}/payments`);
  return handleResponse<Payment[]>(response);
};

export const createPayment = async (data: {
  memberId: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}): Promise<Payment> => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Payment>(response);
};

export const updatePaymentStatus = async (id: string, status: PaymentStatus): Promise<Payment> => {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Payment>(response);
};

// ----------------------------- PRÉSENCES ------------------------------------

export const fetchAttendance = async (): Promise<AttendanceRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/attendance`);
  return handleResponse<AttendanceRecord[]>(response);
};

export const markAttendance = async (
  memberId: string,
  classId: string,
  present: boolean
): Promise<AttendanceRecord> => {
  const response = await fetch(`${API_BASE_URL}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, classId, present }),
  });
  return handleResponse<AttendanceRecord>(response);
};