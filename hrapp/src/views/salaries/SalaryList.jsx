import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import salaryService from '../../services/salaryService';
import employeeService from '../../services/employeeService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

const SalaryList = () => {
  const { t } = useTranslation();
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [monthFilter, setMonthFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, salary: null });
  const [formModal, setFormModal] = useState({ isOpen: false, salary: null });
  const [formData, setFormData] = useState({ employeeId: '', baseSalary: '', bonus: '', month: new Date().toISOString().slice(0, 7) });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = salaryService.filterByMonth(salaries, monthFilter);
    setFilteredSalaries(filtered);
  }, [monthFilter, salaries]);

  const loadData = async () => {
    const sals = await salaryService.getAll();
    const emps = await employeeService.getAll();
    setSalaries(sals);
    setEmployees(emps);
    setFilteredSalaries(sals);
  };

  const handleAdd = () => {
    setFormData({ employeeId: '', baseSalary: '', bonus: '', month: new Date().toISOString().slice(0, 7) });
    setFormModal({ isOpen: true, salary: null });
  };

  const handleEdit = (salary) => {
    setFormData({ employeeId: salary.employeeId, baseSalary: salary.baseSalary, bonus: salary.bonus, month: salary.month });
    setFormModal({ isOpen: true, salary });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert numeric fields to numbers to ensure proper data type
    const dataToSubmit = {
      ...formData,
      employeeId: parseInt(formData.employeeId),
      baseSalary: parseFloat(formData.baseSalary),
      bonus: parseFloat(formData.bonus) || 0
    };
    
    if (formModal.salary) {
      await salaryService.update(formModal.salary.id, dataToSubmit);
    } else {
      await salaryService.create(dataToSubmit);
    }
    setFormModal({ isOpen: false, salary: null });
    loadData();
  };

  const handleDelete = (salary) => {
    setDeleteModal({ isOpen: true, salary });
  };

  const confirmDelete = async () => {
    if (deleteModal.salary) {
      await salaryService.delete(deleteModal.salary.id);
      loadData();
      setDeleteModal({ isOpen: false, salary: null });
    }
  };

  const getEmployeeName = (empId) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.getFullName() : 'N/A';
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: t('salaries.employee'), render: (row) => getEmployeeName(row.employeeId) },
    { header: t('salaries.baseSalary'), render: (row) => `$${row.baseSalary}` },
    { header: t('salaries.bonus'), render: (row) => `$${row.bonus}` },
    { header: t('salaries.total'), render: (row) => `$${row.getTotalSalary()}` },
    { header: t('salaries.month'), field: 'month' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('salaries.title')}</h1>
        <div className="space-x-2">
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{t('salaries.addSalary')}</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-2">{t('salaries.month')}</label>
        <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={filteredSalaries} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {formModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">{formModal.salary ? t('common.edit') : t('common.add')} {t('salaries.title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('salaries.employee')} *</label>
                <select value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded">
                  <option value="">Select Employee</option>
                  {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.getFullName()}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('salaries.baseSalary')} *</label>
                <input type="number" value={formData.baseSalary} onChange={(e) => setFormData({...formData, baseSalary: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('salaries.bonus')}</label>
                <input type="number" value={formData.bonus} onChange={(e) => setFormData({...formData, bonus: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('salaries.month')} *</label>
                <input type="month" value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setFormModal({ isOpen: false, salary: null })} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={deleteModal.isOpen} title={t('common.delete')} message={t('common.confirmDelete')} onConfirm={confirmDelete} onCancel={() => setDeleteModal({ isOpen: false, salary: null })} />
    </div>
  );
};

export default SalaryList;
