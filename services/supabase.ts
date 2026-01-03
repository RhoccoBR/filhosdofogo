import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// URL e Chave Anon fornecidas para conexão com o projeto "Filhos do Fogo Manager"
const SUPABASE_URL = 'https://uqeqhargruywphjbzbds.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZXFoYXJncnV5d3BoamJ6YmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NjYxMjUsImV4cCI6MjA4MzA0MjEyNX0.pBY00QmMHAiArV3cJtJVF06SwBMVlSHIsS6UzcP5dvc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipagem para ajudar no intellisense e consistência dos dados
export interface DatabaseUser {
  id?: number; // O banco gera isso automaticamente
  name: string; // Apelido
  real_name: string;
  email: string;
  rank: string;
  role: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
  avatar?: string;
  created_at?: string;
  password?: string; // Campo opcional para validação local
  
  // Campos estendidos de perfil
  phone?: string;
  birth_date?: string;
  professor?: string;
}