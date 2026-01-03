import React, { useState } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { ProfessorDashboard } from './ProfessorDashboard';
import { StudentDashboard } from './StudentDashboard';

export const DashboardHome: React.FC = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role?.toUpperCase() || 'STUDENT';

  return (
    <div className="relative">
        {role === 'ADMIN' && <AdminDashboard />}
        {role === 'PROFESSOR' && <ProfessorDashboard />}
        {role === 'STUDENT' && <StudentDashboard />}
    </div>
  );
};