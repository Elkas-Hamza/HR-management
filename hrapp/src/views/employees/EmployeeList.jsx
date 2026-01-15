import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

const EmployeeList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const loadData = async () => {
    const emps = await employeeService.getAll();
    const depts = await departmentService.getAll();
    setEmployees(emps);
    setFilteredEmployees(emps);
    setDepartments(depts);
  };

  const applyFilters = () => {
    let filtered = [...employees];
    
    if (searchTerm) {
      filtered = employeeService.search(filtered, searchTerm);
    }
    
    if (departmentFilter) {
      filtered = employeeService.filterByDepartment(filtered, departmentFilter);
    }
    
    if (statusFilter) {
      filtered = employeeService.filterByStatus(filtered, statusFilter);
    }
    
    setFilteredEmployees(filtered);
  };

  const handleDelete = async (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const confirmDelete = async () => {
    if (deleteModal.employee) {
      await employeeService.delete(deleteModal.employee.id);
      setEmployees(employees.filter(e => e.id !== deleteModal.employee.id));
      setDeleteModal({ isOpen: false, employee: null });
    }
  };



  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'N/A';
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { 
      header: t('employees.firstName'), 
      render: (row) => (
        <div className="flex items-center">
          {row.picture && <img src={row.picture} alt={row.firstName} className="w-8 h-8 rounded-full mr-2" />}
          {row.firstName}
        </div>
      )
    },
    { header: t('employees.lastName'), field: 'lastName' },
    { header: t('employees.email'), field: 'email' },
    { header: t('employees.phone'), field: 'phone' },
    { header: t('employees.department'), render: (row) => getDepartmentName(row.departmentId) },
    { header: t('employees.hireDate'), field: 'hireDate' },
    { 
      header: t('employees.status'), 
      render: (row) => (
        <span className={`px-2 py-1 rounded text-white ${row.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('employees.title')}</h1>
        <div className="space-x-2">

          <button
            onClick={() => navigate('/employees/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {t('employees.addEmployee')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('common.search')}</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('employees.department')}</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('employees.status')}</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          onView={(employee) => navigate(`/employees/${employee.id}`)}
          onEdit={(employee) => navigate(`/employees/edit/${employee.id}`)}
          onDelete={handleDelete}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t('common.delete')}
        message={t('common.confirmDelete')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, employee: null })}
      />
    </div>
  );
};

export default EmployeeList;
