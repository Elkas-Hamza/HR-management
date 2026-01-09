import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import EmployeeList from './views/employees/EmployeeList';
import EmployeeForm from './views/employees/EmployeeForm';
import EmployeeDetails from './views/employees/EmployeeDetails';
import DepartmentList from './views/departments/DepartmentList';
import SalaryList from './views/salaries/SalaryList';
import AttendanceList from './views/attendance/AttendanceList';
import LeaveList from './views/leaves/LeaveList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Employee Routes */}
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            
            {/* Other Entity Routes */}
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/salaries" element={<SalaryList />} />
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/leaves" element={<LeaveList />} />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
