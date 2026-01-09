import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import salaryService from '../../services/salaryService';
import attendanceService from '../../services/attendanceService';
import leaveService from '../../services/leaveService';

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [department, setDepartment] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async () => {
    const emp = await employeeService.getById(id);
    setEmployee(emp);

    if (emp) {
      const dept = await departmentService.getById(emp.departmentId);
      setDepartment(dept);

      const empSalaries = await salaryService.getByEmployeeId(id);
      setSalaries(empSalaries);

      const empAttendance = await attendanceService.getByEmployeeId(id);
      setAttendance(empAttendance);

      const empLeaves = await leaveService.getByEmployeeId(id);
      setLeaves(empLeaves);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (!employee) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('common.details')}</h1>
          <div className="space-x-2">
            <button
              onClick={handleExportPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Export PDF
            </button>
            <button
              onClick={() => navigate('/employees')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Back
            </button>
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start space-x-6">
            {employee.picture && (
              <img
                src={employee.picture}
                alt={employee.getFullName()}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{employee.getFullName()}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">{t('employees.email')}:</span> {employee.email}
                </div>
                <div>
                  <span className="font-semibold">{t('employees.phone')}:</span> {employee.phone}
                </div>
                <div>
                  <span className="font-semibold">{t('employees.department')}:</span> {department?.name || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">{t('employees.hireDate')}:</span> {employee.hireDate}
                </div>
                <div>
                  <span className="font-semibold">{t('employees.status')}:</span>{' '}
                  <span className={`px-2 py-1 rounded text-white ${employee.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salaries */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{t('salaries.title')}</h3>
          {salaries.length === 0 ? (
            <p className="text-gray-500">No salary records</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-left">Base Salary</th>
                  <th className="px-4 py-2 text-left">Bonus</th>
                  <th className="px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map(salary => (
                  <tr key={salary.id} className="border-b">
                    <td className="px-4 py-2">{salary.month}</td>
                    <td className="px-4 py-2">${salary.baseSalary}</td>
                    <td className="px-4 py-2">${salary.bonus}</td>
                    <td className="px-4 py-2 font-semibold">${salary.getTotalSalary()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{t('attendance.title')}</h3>
          {attendance.length === 0 ? (
            <p className="text-gray-500">No attendance records</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {attendance.slice(0, 8).map(record => (
                <div key={record.id} className="border rounded p-3">
                  <div className="text-sm font-semibold">{record.date}</div>
                  <div className={`text-xs mt-1 px-2 py-1 rounded ${
                    record.status === 'Present' ? 'bg-green-100 text-green-800' :
                    record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">{t('leaves.title')}</h3>
          {leaves.length === 0 ? (
            <p className="text-gray-500">No leave requests</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(leave => (
                  <tr key={leave.id} className="border-b">
                    <td className="px-4 py-2">{leave.type}</td>
                    <td className="px-4 py-2">{leave.startDate}</td>
                    <td className="px-4 py-2">{leave.endDate}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-white text-xs ${
                        leave.status === 'Approved' ? 'bg-green-500' :
                        leave.status === 'Rejected' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{leave.getDuration()} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
