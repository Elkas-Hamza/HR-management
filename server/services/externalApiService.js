const axios = require('axios');
const API_CONFIG = require('../config/apiConfig');
const fs = require('fs').promises;
const path = require('path');

class ExternalApiService {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: API_CONFIG.REQUEST_TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.url.includes('localhost')) {
          console.log(` ${config.method.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!API_CONFIG.USE_LOCAL_FALLBACK || error.config?.fallbackFile === undefined) {
          console.error('External API Error:', error.response?.data || error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async loadLocalData(filename) {
    try {
      const filePath = path.resolve(__dirname, '..', 'data', filename);
      const data = await fs.readFile(filePath, 'utf8');
      console.log(` Loaded local data from: ${filename}`);
      return JSON.parse(data);
    } catch (error) {
      console.error(` Error loading local data from ${filename}:`, error.message);
      console.error(`   Expected path: ${path.resolve(__dirname, '..', 'data', filename)}`);
      return [];
    }
  }

  async saveLocalData(filename, data) {
    try {
      const filePath = path.resolve(__dirname, '..', 'data', filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(` Saved local data to: ${filename}`);
      return true;
    } catch (error) {
      console.error(` Error saving local data to ${filename}:`, error.message);
      throw error;
    }
  }

  async fetchData(url, params = {}, fallbackFile = null) {
    if (API_CONFIG.USE_LOCAL_DATA_ONLY && fallbackFile) {
      return await this.loadLocalData(fallbackFile);
    }
    
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      if (API_CONFIG.USE_LOCAL_FALLBACK && fallbackFile) {
        console.log(`  External API unavailable, using local data: ${fallbackFile}`);
        return await this.loadLocalData(fallbackFile);
      }
      
      console.error(`Error fetching data from ${url}:`, error.message);
      throw new Error(`Failed to fetch data: ${error.response?.status || error.message}`);
    }
  }

  async fetchById(url, id, fallbackFile = null) {
    if (API_CONFIG.USE_LOCAL_DATA_ONLY && fallbackFile) {
      try {
        const allData = await this.loadLocalData(fallbackFile);
        const item = allData.find(item => item.id.toString() === id.toString());
        return item || null;
      } catch (error) {
        console.error(`Error fetching by ID from ${fallbackFile}:`, error.message);
        return null;
      }
    }

    try {
      const response = await this.axiosInstance.get(`${url}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`Error fetching data by ID from ${url}/${id}:`, error.message);
      throw new Error(`Failed to fetch data: ${error.response?.status || error.message}`);
    }
  }

  async createData(url, data, fallbackFile = null) {
    if (API_CONFIG.USE_LOCAL_DATA_ONLY && fallbackFile) {
      try {
        const allData = await this.loadLocalData(fallbackFile);
        const newId = allData.length > 0 ? Math.max(...allData.map(item => parseInt(item.id) || 0)) + 1 : 1;
        const newItem = { id: newId.toString(), ...data };
        allData.push(newItem);
        await this.saveLocalData(fallbackFile, allData);
        return newItem;
      } catch (error) {
        console.error(`Error creating data locally in ${fallbackFile}:`, error.message);
        throw new Error(`Failed to create data locally: ${error.message}`);
      }
    }

    try {
      const response = await this.axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating data at ${url}:`, error.message);
      throw new Error(`Failed to create data: ${error.response?.status || error.message}`);
    }
  }

  async updateData(url, id, data, fallbackFile = null) {
    if (API_CONFIG.USE_LOCAL_DATA_ONLY && fallbackFile) {
      try {
        const allData = await this.loadLocalData(fallbackFile);
        const index = allData.findIndex(item => item.id.toString() === id.toString());
        if (index === -1) {
          return null;
        }
        allData[index] = { ...allData[index], ...data, id: allData[index].id };
        await this.saveLocalData(fallbackFile, allData);
        return allData[index];
      } catch (error) {
        console.error(`Error updating data locally in ${fallbackFile}:`, error.message);
        throw new Error(`Failed to update data locally: ${error.message}`);
      }
    }

    try {
      const response = await this.axiosInstance.put(`${url}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating data at ${url}/${id}:`, error.message);
      throw new Error(`Failed to update data: ${error.response?.status || error.message}`);
    }
  }

  async patchData(url, id, data, fallbackFile = null) {
    if (API_CONFIG.USE_LOCAL_DATA_ONLY && fallbackFile) {
      try {
        const allData = await this.loadLocalData(fallbackFile);
        const index = allData.findIndex(item => item.id.toString() === id.toString());
        if (index === -1) {
          return null;
        }
        allData[index] = { ...allData[index], ...data };
        await this.saveLocalData(fallbackFile, allData);
        return allData[index];
      } catch (error) {
        console.error(`Error patching data locally in ${fallbackFile}:`, error.message);
        throw new Error(`Failed to patch data locally: ${error.message}`);
      }
    }

    try {
      const response = await this.axiosInstance.patch(`${url}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error patching data at ${url}/${id}:`, error.message);
      throw new Error(`Failed to patch data: ${error.response?.status || error.message}`);
    }
  }

  async deleteData(url, id, fallbackFile = null) {
    if (API_CONFIG.USE_LOCAL_DATA_ONLY && fallbackFile) {
      try {
        const allData = await this.loadLocalData(fallbackFile);
        const filteredData = allData.filter(item => item.id.toString() !== id.toString());
        await this.saveLocalData(fallbackFile, filteredData);
        return { success: true };
      } catch (error) {
        console.error(`Error deleting data locally from ${fallbackFile}:`, error.message);
        throw new Error(`Failed to delete data locally: ${error.message}`);
      }
    }

    try {
      const response = await this.axiosInstance.delete(`${url}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting data at ${url}/${id}:`, error.message);
      throw new Error(`Failed to delete data: ${error.response?.status || error.message}`);
    }
  }

  // === EMPLOYEES ===
  async getEmployees() {
    return this.fetchData(API_CONFIG.EMPLOYEES_API, {}, 'employees.json');
  }

  async getEmployeeById(id) {
    return this.fetchById(API_CONFIG.EMPLOYEES_API, id, 'employees.json');
  }

  async createEmployee(employeeData) {
    return this.createData(API_CONFIG.EMPLOYEES_API, employeeData, 'employees.json');
  }

  async updateEmployee(id, employeeData) {
    return this.updateData(API_CONFIG.EMPLOYEES_API, id, employeeData, 'employees.json');
  }

  async deleteEmployee(id) {
    return this.deleteData(API_CONFIG.EMPLOYEES_API, id, 'employees.json');
  }

  // === DEPARTMENTS ===
  async getDepartments() {
    return this.fetchData(API_CONFIG.DEPARTMENTS_API, {}, 'departments.json');
  }

  async getDepartmentById(id) {
    return this.fetchById(API_CONFIG.DEPARTMENTS_API, id, 'departments.json');
  }

  async createDepartment(departmentData) {
    return this.createData(API_CONFIG.DEPARTMENTS_API, departmentData, 'departments.json');
  }

  async updateDepartment(id, departmentData) {
    return this.updateData(API_CONFIG.DEPARTMENTS_API, id, departmentData, 'departments.json');
  }

  async deleteDepartment(id) {
    return this.deleteData(API_CONFIG.DEPARTMENTS_API, id, 'departments.json');
  }

  // === SALARIES ===
  async getSalaries() {
    return this.fetchData(API_CONFIG.SALARIES_API, {}, 'salaries.json');
  }

  async getSalaryById(id) {
    return this.fetchById(API_CONFIG.SALARIES_API, id, 'salaries.json');
  }

  async getSalariesByEmployeeId(employeeId) {
    const allData = await this.fetchData(API_CONFIG.SALARIES_API, { employeeId }, 'salaries.json');
    return allData.filter(item => item.employeeId?.toString() === employeeId.toString());
  }

  async createSalary(salaryData) {
    return this.createData(API_CONFIG.SALARIES_API, salaryData, 'salaries.json');
  }

  async updateSalary(id, salaryData) {
    return this.updateData(API_CONFIG.SALARIES_API, id, salaryData, 'salaries.json');
  }

  async deleteSalary(id) {
    return this.deleteData(API_CONFIG.SALARIES_API, id, 'salaries.json');
  }

  // === ATTENDANCE ===
  async getAttendance() {
    return this.fetchData(API_CONFIG.ATTENDANCE_API, {}, 'attendance.json');
  }

  async getAttendanceById(id) {
    return this.fetchById(API_CONFIG.ATTENDANCE_API, id, 'attendance.json');
  }

  async getAttendanceByEmployeeId(employeeId) {
    const allData = await this.fetchData(API_CONFIG.ATTENDANCE_API, { employeeId }, 'attendance.json');
    return allData.filter(item => item.employeeId?.toString() === employeeId.toString());
  }

  async createAttendance(attendanceData) {
    return this.createData(API_CONFIG.ATTENDANCE_API, attendanceData, 'attendance.json');
  }

  async updateAttendance(id, attendanceData) {
    return this.updateData(API_CONFIG.ATTENDANCE_API, id, attendanceData, 'attendance.json');
  }

  async deleteAttendance(id) {
    return this.deleteData(API_CONFIG.ATTENDANCE_API, id, 'attendance.json');
  }

  // === LEAVES ===
  async getLeaves() {
    return this.fetchData(API_CONFIG.LEAVES_API, {}, 'leaves.json');
  }

  async getLeaveById(id) {
    return this.fetchById(API_CONFIG.LEAVES_API, id, 'leaves.json');
  }

  async getLeavesByEmployeeId(employeeId) {
    const allData = await this.fetchData(API_CONFIG.LEAVES_API, { employeeId }, 'leaves.json');
    return allData.filter(item => item.employeeId?.toString() === employeeId.toString());
  }

  async createLeave(leaveData) {
    return this.createData(API_CONFIG.LEAVES_API, leaveData, 'leaves.json');
  }

  async updateLeave(id, leaveData) {
    return this.updateData(API_CONFIG.LEAVES_API, id, leaveData, 'leaves.json');
  }

  async approveLeave(id) {
    return this.patchData(API_CONFIG.LEAVES_API, id, { status: 'Approved' }, 'leaves.json');
  }

  async rejectLeave(id) {
    return this.patchData(API_CONFIG.LEAVES_API, id, { status: 'Rejected' }, 'leaves.json');
  }

  async deleteLeave(id) {
    return this.deleteData(API_CONFIG.LEAVES_API, id, 'leaves.json');
  }
}

module.exports = new ExternalApiService();