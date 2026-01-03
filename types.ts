export interface User {
  id: string;
  name: string;
  fullName?: string;
  avatar: string;
  cordel: string;
  rank: string; // e.g., 'Mestre', 'Instrutor', 'Aluno'
  email?: string;
  phone?: string;
  cost?: number;
  role: 'admin' | 'professor' | 'student';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  price: number;
  description: string;
  participants: number;
}

export interface Song {
  id: string;
  title: string;
  category: string;
  lyrics: string;
  date: string;
}

export interface FinancialRecord {
  id: string;
  studentName: string;
  description: string;
  details?: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'cancelled' | 'delivered';
  type: 'uniform' | 'event' | 'monthly';
}
