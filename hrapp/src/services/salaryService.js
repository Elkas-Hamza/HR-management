import axios from 'axios';
import Salary from '../models/Salary';

const API_URL = 'http://localhost:5000/api/salaries';

class SalaryService {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data.map(s => new Salary(s));
    } catch (error) {
      console.error('Error fetching salaries:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return new Salary(response.data);
    } catch (error) {
      console.error('Error fetching salary:', error);
      return null;
    }
  }

  async getByEmployeeId(employeeId) {
    try {
      const response = await axios.get(`${API_URL}/employee/${employeeId}`);
      return response.data.map(s => new Salary(s));
    } catch (error) {
      console.error('Error fetching salaries:', error);
      return [];
    }
  }

  async create(salaryData) {
    try {
      const response = await axios.post(API_URL, salaryData);
      return new Salary(response.data);
    } catch (error) {
      console.error('Error creating salary:', error);
      throw error;
    }
  }

  async update(id, salaryData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, salaryData);
      return new Salary(response.data);
    } catch (error) {
      console.error('Error updating salary:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting salary:', error);
      throw error;
    }
  }

  filterByMonth(salaries, month) {
    if (!month) return salaries;
    return salaries.filter(s => s.month === month);
  }

  getSalaryDistribution(salaries) {
    const ranges = [
      { label: '0-3000', min: 0, max: 3000 },
      { label: '3000-5000', min: 3000, max: 5000 },
      { label: '5000-7000', min: 5000, max: 7000 },
      { label: '7000+', min: 7000, max: Infinity }
    ];

    return ranges.map(range => ({
      label: range.label,
      count: salaries.filter(s => {
        const total = s.getTotalSalary();
        return total >= range.min && total < range.max;
      }).length
    }));
  }

  exportToCSV(salaries) {
    const headers = ['ID', 'Employee ID', 'Base Salary', 'Bonus', 'Total', 'Month'];
    const rows = salaries.map(sal => [
      sal.id,
      sal.employeeId,
      sal.baseSalary,
      sal.bonus,
      sal.getTotalSalary(),
      sal.month
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salaries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }
}

const salaryService = new SalaryService();
export default salaryService;
