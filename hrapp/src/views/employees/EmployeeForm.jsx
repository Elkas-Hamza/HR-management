import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';

const EmployeeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    picture: ''
  });

  useEffect(() => {
    loadDepartments();
    if (isEdit) {
      loadEmployee();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDepartments = async () => {
    const depts = await departmentService.getAll();
    setDepartments(depts);
  };

  const loadEmployee = async () => {
    const employee = await employeeService.getById(id);
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        departmentId: employee.departmentId,
        hireDate: employee.hireDate,
        status: employee.status,
        picture: employee.picture || ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert departmentId to number to ensure proper data type
    const dataToSubmit = {
      ...formData,
      departmentId: parseInt(formData.departmentId)
    };
    
    if (isEdit) {
      await employeeService.update(id, dataToSubmit);
    } else {
      await employeeService.create(dataToSubmit);
    }
    
    navigate('/employees');
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? t('employees.editEmployee') : t('employees.addEmployee')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('employees.firstName')} *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('employees.lastName')} *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('employees.email')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('employees.phone')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Photo URL
            </label>
            <input
              type="url"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            {formData.picture && (
              <div className="mt-2">
                <img
                  src={formData.picture}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('employees.department')} *
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('employees.hireDate')} *
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('employees.status')} *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
