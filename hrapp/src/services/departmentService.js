import axios from 'axios';
import Department from '../models/Department';

const API_URL = 'http://localhost:5000/api/departments';

class DepartmentService {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data.map(d => new Department(d));
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return new Department(response.data);
    } catch (error) {
      console.error('Error fetching department:', error);
      return null;
    }
  }

  async create(departmentData) {
    try {
      const response = await axios.post(API_URL, departmentData);
      return new Department(response.data);
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }

  async update(id, departmentData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, departmentData);
      return new Department(response.data);
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  }

  search(departments, searchTerm) {
    if (!searchTerm) return departments;
    const term = searchTerm.toLowerCase();
    return departments.filter(dept => 
      dept.name.toLowerCase().includes(term) ||
      dept.manager.toLowerCase().includes(term)
    );
  }

  exportToCSV(departments) {
    const headers = ['ID', 'Name', 'Manager', 'Description'];
    const rows = departments.map(dept => [
      dept.id,
      dept.name,
      dept.manager,
      dept.description
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `departments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }
}

const departmentService = new DepartmentService();
export default departmentService;
