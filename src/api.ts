import type { Member, Coach, FitnessClass, Payment, AttendanceRecord, MembershipType, PaymentStatus } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new Error(errorBody.message ?? `Erreur HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
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

// ----------------------------- COACHS ---------------------------------------

export const fetchCoaches = async (): Promise<Coach[]> => {
  const response = await fetch(`${API_BASE_URL}/coaches`);
  return handleResponse<Coach[]>(response);
};

// ----------------------------- CLASSES --------------------------------------

export const fetchClasses = async (): Promise<FitnessClass[]> => {
  const response = await fetch(`${API_BASE_URL}/classes`);
  return handleResponse<FitnessClass[]>(response);
};

// ----------------------------- PAIEMENTS ------------------------------------

export const fetchPayments = async (): Promise<Payment[]> => {
  const response = await fetch(`${API_BASE_URL}/payments`);
  return handleResponse<Payment[]>(response);
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