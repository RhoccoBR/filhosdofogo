import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { ProfessorDashboard } from './ProfessorDashboard';
import { StudentDashboard } from './StudentDashboard';
import { DatabaseUser } from '../services/supabase';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Verifica se há usuário salvo no localStorage
      const storedUser = localStorage.getItem('fdf_user');
      
      if (!storedUser) {
          navigate('/login');
          return;
      }

      try {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
      } catch (e) {
          console.error("Erro ao ler usuário", e);
          localStorage.removeItem('fdf_user');
          navigate('/login');
      } finally {
          setLoading(false);
      }
  }, [navigate]);

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
              <span className="material-icons-round animate-spin text-4xl mb-2 text-primary">sync</span>
              <p>Carregando seu perfil...</p>
          </div>
      );
  }

  if (!currentUser) return null;

  return (
    <div className="relative">
        {/* Renderização Condicional baseada no Role do Banco de Dados */}
        {currentUser.role === 'ADMIN' && <AdminDashboard />}
        {currentUser.role === 'PROFESSOR' && <ProfessorDashboard />}
        {currentUser.role === 'STUDENT' && <StudentDashboard />}
    </div>
  );
};