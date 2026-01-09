import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import leaveService from '../../services/leaveService';
import employeeService from '../../services/employeeService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

const LeaveList = () => {
  const { t } = useTranslation();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, leave: null });
  const [formModal, setFormModal] = useState({ isOpen: false, leave: null });
  const [formData, setFormData] = useState({ 
    employeeId: '', 
    startDate: new Date().toISOString().split('T')[0], 
    endDate: new Date().toISOString().split('T')[0], 
    type: 'Vacation', 
    status: 'Pending',
    reason: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...leaves];
    if (statusFilter) filtered = leaveService.filterByStatus(filtered, statusFilter);
    if (typeFilter) filtered = leaveService.filterByType(filtered, typeFilter);
    setFilteredLeaves(filtered);
  }, [statusFilter, typeFilter, leaves]);

  const loadData = async () => {
    const lvs = await leaveService.getAll();
    const emps = await employeeService.getAll();
    setLeaves(lvs);
    setEmployees(emps);
    setFilteredLeaves(lvs);
  };

  const handleAdd = () => {
    setFormData({ employeeId: '', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], type: 'Vacation', status: 'Pending', reason: '' });
    setFormModal({ isOpen: true, leave: null });
  };

  const handleEdit = (leave) => {
    setFormData({ employeeId: leave.employeeId, startDate: leave.startDate, endDate: leave.endDate, type: leave.type, status: leave.status, reason: leave.reason });
    setFormModal({ isOpen: true, leave });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert employeeId to number to ensure proper data type
    const dataToSubmit = {
      ...formData,
      employeeId: parseInt(formData.employeeId)
    };
    
    if (formModal.leave) {
      await leaveService.update(formModal.leave.id, dataToSubmit);
    } else {
      await leaveService.create(dataToSubmit);
    }
    setFormModal({ isOpen: false, leave: null });
    loadData();
  };

  const handleApprove = async (leave) => {
    await leaveService.approve(leave.id);
    loadData();
  };

  const handleReject = async (leave) => {
    await leaveService.reject(leave.id);
    loadData();
  };

  const handleDelete = (leave) => {
    setDeleteModal({ isOpen: true, leave });
  };

  const confirmDelete = async () => {
    if (deleteModal.leave) {
      await leaveService.delete(deleteModal.leave.id);
      loadData();
      setDeleteModal({ isOpen: false, leave: null });
    }
  };

  const getEmployeeName = (empId) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.getFullName() : 'N/A';
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: t('leaves.employee'), render: (row) => getEmployeeName(row.employeeId) },
    { header: t('leaves.startDate'), field: 'startDate' },
    { header: t('leaves.endDate'), field: 'endDate' },
    { header: t('leaves.type'), field: 'type' },
    { 
      header: t('leaves.status'), 
      render: (row) => (
        <span className={`px-2 py-1 rounded text-white text-xs ${
          row.status === 'Approved' ? 'bg-green-500' :
          row.status === 'Rejected' ? 'bg-red-500' :
          'bg-yellow-500'
        }`}>
          {row.status}
        </span>
      )
    },
    { header: 'Duration', render: (row) => `${row.getDuration()} days` }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('leaves.title')}</h1>
        <div className="space-x-2">
          <button onClick={() => leaveService.exportToCSV()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">{t('common.export')}</button>
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{t('leaves.addRequest')}</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('leaves.status')}</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('leaves.type')}</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded">
              <option value="">All Types</option>
              <option value="Vacation">Vacation</option>
              <option value="Sick">Sick</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable 
          columns={columns} 
          data={filteredLeaves} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
        />
      </div>

      {formModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">{formModal.leave ? t('common.edit') : t('common.add')} {t('leaves.title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('leaves.employee')} *</label>
                <select value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded">
                  <option value="">Select Employee</option>
                  {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.getFullName()}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('leaves.startDate')} *</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('leaves.endDate')} *</label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('leaves.type')} *</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded">
                  <option value="Vacation">Vacation</option>
                  <option value="Sick">Sick</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('leaves.status')} *</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('leaves.reason')}</label>
                <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded" rows="3"></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setFormModal({ isOpen: false, leave: null })} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={deleteModal.isOpen} title={t('common.delete')} message={t('common.confirmDelete')} onConfirm={confirmDelete} onCancel={() => setDeleteModal({ isOpen: false, leave: null })} />
    </div>
  );
};

export default LeaveList;
