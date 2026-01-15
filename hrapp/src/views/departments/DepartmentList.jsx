import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import departmentService from '../../services/departmentService';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';

const DepartmentList = () => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, department: null });
  const [formModal, setFormModal] = useState({ isOpen: false, department: null });
  const [formData, setFormData] = useState({ name: '', manager: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = departmentService.search(departments, searchTerm);
    setFilteredDepartments(filtered);
  }, [searchTerm, departments]);

  const loadData = async () => {
    const depts = await departmentService.getAll();
    setDepartments(depts);
    setFilteredDepartments(depts);
  };

  const handleAdd = () => {
    setFormData({ name: '', manager: '', description: '' });
    setFormModal({ isOpen: true, department: null });
  };

  const handleEdit = (department) => {
    setFormData({ name: department.name, manager: department.manager, description: department.description });
    setFormModal({ isOpen: true, department });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formModal.department) {
      await departmentService.update(formModal.department.id, formData);
    } else {
      await departmentService.create(formData);
    }
    setFormModal({ isOpen: false, department: null });
    loadData();
  };

  const handleDelete = (department) => {
    setDeleteModal({ isOpen: true, department });
  };

  const confirmDelete = async () => {
    if (deleteModal.department) {
      await departmentService.delete(deleteModal.department.id);
      loadData();
      setDeleteModal({ isOpen: false, department: null });
    }
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: t('departments.name'), field: 'name' },
    { header: t('departments.manager'), field: 'manager' },
    { header: t('departments.description'), field: 'description' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('departments.title')}</h1>
        <div className="space-x-2">
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            {t('departments.addDepartment')}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('common.search')}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={filteredDepartments} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Form Modal */}
      {formModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {formModal.department ? t('common.edit') : t('common.add')} {t('departments.title')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('departments.name')} *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('departments.manager')} *</label>
                <input type="text" value={formData.manager} onChange={(e) => setFormData({...formData, manager: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('departments.description')}</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded" rows="3"></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setFormModal({ isOpen: false, department: null })} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">{t('common.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={deleteModal.isOpen} title={t('common.delete')} message={t('common.confirmDelete')} onConfirm={confirmDelete} onCancel={() => setDeleteModal({ isOpen: false, department: null })} />
    </div>
  );
};

export default DepartmentList;
