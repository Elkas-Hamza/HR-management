import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import attendanceService from '../../services/attendanceService';
import employeeService from '../../services/employeeService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

const AttendanceList = () => {
  const { t } = useTranslation();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, record: null });
  const [formModal, setFormModal] = useState({ isOpen: false, record: null });
  const [formData, setFormData] = useState({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Present' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...attendance];
    if (dateFilter) filtered = attendanceService.filterByDate(filtered, dateFilter);
    if (statusFilter) filtered = attendanceService.filterByStatus(filtered, statusFilter);
    setFilteredAttendance(filtered);
  }, [dateFilter, statusFilter, attendance]);

  const loadData = async () => {
    const att = await attendanceService.getAll();
    const emps = await employeeService.getAll();
    setAttendance(att);
    setEmployees(emps);
    setFilteredAttendance(att);
  };

  const handleAdd = () => {
    setFormData({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Present' });
    setFormModal({ isOpen: true, record: null });
  };

  const handleEdit = (record) => {
    setFormData({ employeeId: record.employeeId, date: record.date, status: record.status });
    setFormModal({ isOpen: true, record });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert employeeId to number to ensure proper data type
    const dataToSubmit = {
      ...formData,
      employeeId: parseInt(formData.employeeId)
    };
    
    if (formModal.record) {
      await attendanceService.update(formModal.record.id, dataToSubmit);
    } else {
      await attendanceService.create(dataToSubmit);
    }
    setFormModal({ isOpen: false, record: null });
    loadData();
  };

  const handleDelete = (record) => {
    setDeleteModal({ isOpen: true, record });
  };

  const confirmDelete = async () => {
    if (deleteModal.record) {
      await attendanceService.delete(deleteModal.record.id);
      loadData();
      setDeleteModal({ isOpen: false, record: null });
    }
  };

  const getEmployeeName = (empId) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.getFullName() : 'N/A';
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: t('attendance.employee'), render: (row) => getEmployeeName(row.employeeId) },
    { header: t('attendance.date'), field: 'date' },
    { 
      header: t('attendance.status'), 
      render: (row) => (
        <span className={`px-2 py-1 rounded text-white text-xs ${
          row.status === 'Present' ? 'bg-green-500' :
          row.status === 'Late' ? 'bg-yellow-500' :
          'bg-red-500'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('attendance.title')}</h1>
        <div className="space-x-2">
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{t('attendance.addRecord')}</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('attendance.date')}</label>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('attendance.status')}</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded">
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={filteredAttendance} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {formModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">{formModal.record ? t('common.edit') : t('common.add')} {t('attendance.title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('attendance.employee')} *</label>
                <select value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded">
                  <option value="">Select Employee</option>
                  {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.getFullName()}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('attendance.date')} *</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('attendance.status')} *</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded">
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setFormModal({ isOpen: false, record: null })} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={deleteModal.isOpen} title={t('common.delete')} message={t('common.confirmDelete')} onConfirm={confirmDelete} onCancel={() => setDeleteModal({ isOpen: false, record: null })} />
    </div>
  );
};

export default AttendanceList;
