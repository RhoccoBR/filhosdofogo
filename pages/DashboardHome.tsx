import React, { useState } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { ProfessorDashboard } from './ProfessorDashboard';
import { StudentDashboard } from './StudentDashboard';

export const DashboardHome: React.FC = () => {
  // Estado simulado para alternar entre visões. 
  // Em uma aplicação real, isso viria do contexto de autenticação do usuário.
  const [viewMode, setViewMode] = useState<'ADMIN' | 'PROFESSOR' | 'STUDENT'>('STUDENT');

  return (
    <div className="relative">
        {/* Toggle de Desenvolvimento para Demonstração */}
        <div className="absolute top-0 right-0 z-10 flex gap-2">
            <button 
                onClick={() => setViewMode('ADMIN')}
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all ${viewMode === 'ADMIN' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800 text-white opacity-50 hover:opacity-100'}`}
            >
                <span className="material-icons-round text-xs">admin_panel_settings</span>
                Admin
            </button>
            <button 
                onClick={() => setViewMode('PROFESSOR')}
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all ${viewMode === 'PROFESSOR' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-white opacity-50 hover:opacity-100'}`}
            >
                <span className="material-icons-round text-xs">school</span>
                Prof
            </button>
            <button 
                onClick={() => setViewMode('STUDENT')}
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-all ${viewMode === 'STUDENT' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-800 text-white opacity-50 hover:opacity-100'}`}
            >
                <span className="material-icons-round text-xs">person</span>
                Aluno
            </button>
        </div>

        {viewMode === 'ADMIN' && <AdminDashboard />}
        {viewMode === 'PROFESSOR' && <ProfessorDashboard />}
        {viewMode === 'STUDENT' && <StudentDashboard />}
    </div>
  );
};