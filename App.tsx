import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// ... other imports ...

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Application Routes */}
        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="users/:id" element={<StudentDetails />} />
          <Route path="financial" element={<Financial />} />
          <Route path="pedagogical" element={<Pedagogical />} />
          <Route path="grades" element={<Grades />} />
          <Route path="classes" element={<MyClasses />} />
          <Route path="music" element={<MusicLibrary />} />
          <Route path="works" element={<Works />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="students-list" element={<StudentsList />} />
          <Route path="create-class" element={<CreateClass />} />
          <Route path="uniforms" element={<Uniforms />} />
          <Route path="reports" element={<Reports />} />
          <Route path="training" element={<Training />} />
          <Route path="school-report" element={<SchoolReport />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;