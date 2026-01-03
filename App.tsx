import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { DashboardHome } from './pages/DashboardHome';
import { Events } from './pages/Events';
import { Users } from './pages/Users';
import { StudentDetails } from './pages/StudentDetails';
import { Financial } from './pages/Financial';
import { Pedagogical } from './pages/Pedagogical';
import { Grades } from './pages/Grades';
import { MyClasses } from './pages/MyClasses';
import { MusicLibrary } from './pages/MusicLibrary';
import { Works } from './pages/Works';
import { EditProfile } from './pages/EditProfile';
import { StudentsList } from './pages/StudentsList';
import { CreateClass } from './pages/CreateClass';
import { Uniforms } from './pages/Uniforms';
import { Reports } from './pages/Reports';
import { StudentDashboard } from './pages/StudentDashboard';
import { Training } from './pages/Training';
import { SchoolReport } from './pages/SchoolReport';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Application Routes */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="users" element={<Users />} />
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