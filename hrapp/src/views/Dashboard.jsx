import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import salaryService from '../services/salaryService';
import attendanceService from '../services/attendanceService';
import leaveService from '../services/leaveService';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [kpis, setKpis] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    totalDepartments: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const emps = await employeeService.getAll();
    const depts = await departmentService.getAll();
    const leaves = await leaveService.getAll();
    const sals = await salaryService.getAll();
    const atts = await attendanceService.getAll();

    setEmployees(emps);
    setDepartments(depts);
    setSalaries(sals);
    setAttendance(atts);

    setKpis({
      totalEmployees: emps.length,
      activeEmployees: emps.filter(e => e.status === 'Active').length,
      pendingLeaves: leaves.filter(l => l.status === 'Pending').length,
      totalDepartments: depts.length
    });
  };

  // Chart 1: Employees per Department (Bar Chart)
  const getEmployeesPerDeptData = () => {
    const deptCounts = {};
    departments.forEach(dept => {
      deptCounts[dept.name] = employees.filter(emp => emp.departmentId === dept.id).length;
    });

    return {
      labels: Object.keys(deptCounts),
      datasets: [{
        label: t('dashboard.employeesPerDept'),
        data: Object.values(deptCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  };

  // Chart 2: Salary Distribution (Bar Chart)
  const getSalaryDistributionData = () => {
    const distribution = salaryService.getSalaryDistribution(salaries);
    return {
      labels: distribution.map(d => d.label),
      datasets: [{
        label: t('dashboard.salaryDistribution'),
        data: distribution.map(d => d.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  };

  // Chart 3: Attendance Rate (Pie Chart)
  const getAttendanceRateData = () => {
    const rate = attendanceService.getAttendanceRate(attendance);
    return {
      labels: ['Present', 'Late', 'Absent'],
      datasets: [{
        data: [rate.present, rate.late, rate.absent],
        backgroundColor: [
          'rgba(75, 192, 75, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderWidth: 1
      }]
    };
  };

  // Chart 4: Monthly Hires (Line Chart)
  const getMonthlyHiresData = () => {
    const monthCounts = {};
    employees.forEach(emp => {
      const month = emp.hireDate.slice(0, 7);
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthCounts).sort();
    return {
      labels: sortedMonths,
      datasets: [{
        label: t('dashboard.monthlyHires'),
        data: sortedMonths.map(m => monthCounts[m]),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.4
      }]
    };
  };

  // Chart 5: Absence Trend (Line Chart)
  const getAbsenceTrendData = () => {
    const trend = attendanceService.getAbsenceTrend(attendance);
    return {
      labels: trend.map(t => t.date),
      datasets: [{
        label: t('dashboard.absenceTrend'),
        data: trend.map(t => t.count),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      }]
    };
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t('dashboard.title')}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">{t('dashboard.totalEmployees')}</h3>
          <p className="text-4xl font-bold mt-2">{kpis.totalEmployees}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">{t('dashboard.activeEmployees')}</h3>
          <p className="text-4xl font-bold mt-2">{kpis.activeEmployees}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">{t('dashboard.pendingLeaves')}</h3>
          <p className="text-4xl font-bold mt-2">{kpis.pendingLeaves}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">{t('dashboard.totalDepartments')}</h3>
          <p className="text-4xl font-bold mt-2">{kpis.totalDepartments}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.employeesPerDept')}</h3>
          <Bar data={getEmployeesPerDeptData()} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.salaryDistribution')}</h3>
          <Bar data={getSalaryDistributionData()} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.attendanceRate')}</h3>
          <Pie data={getAttendanceRateData()} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.monthlyHires')}</h3>
          <Line data={getMonthlyHiresData()} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.absenceTrend')}</h3>
          <Line data={getAbsenceTrendData()} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
