import axios from 'axios';
import Employee from '../models/Employee';

const API_URL = 'http://localhost:5000/api/employees';

class EmployeeService {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      const employees = response.data.map(emp => new Employee(emp));
      return employees;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return new Employee(response.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  }

  async create(employeeData) {
    try {
      const response = await axios.post(API_URL, employeeData);
      return new Employee(response.data);
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async update(id, employeeData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, employeeData);
      return new Employee(response.data);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  search(employees, searchTerm) {
    if (!searchTerm) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter(emp => 
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  }

  filterByDepartment(employees, departmentId) {
    if (!departmentId) return employees;
    return employees.filter(emp => emp.departmentId === parseInt(departmentId));
  }

  filterByStatus(employees, status) {
    if (!status) return employees;
    return employees.filter(emp => emp.status === status);
  }

  sortBy(employees, field, order = 'asc') {
    return [...employees].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }

  exportToCSV(employees) {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Hire Date', 'Status'];
    const rows = employees.map(emp => [
      emp.id,
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.phone,
      emp.departmentId,
      emp.hireDate,
      emp.status
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }
}

const employeeService = new EmployeeService();
export default employeeService;
