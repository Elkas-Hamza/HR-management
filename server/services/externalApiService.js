const fs = require('fs').promises;
const path = require('path');

class LocalDataService {
  async load(filename) {
    const filePath = path.resolve(__dirname, '..', 'data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  }

  async save(filename, data) {
    const filePath = path.resolve(__dirname, '..', 'data', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll(filename) {
    return this.load(filename);
  }

  async getById(filename, id) {
    const data = await this.load(filename);
    return data.find(item => item.id.toString() === id.toString()) || null;
  }

  async create(filename, newData) {
    const data = await this.load(filename);
    const newId = data.length > 0 ? Math.max(...data.map(item => parseInt(item.id) || 0)) + 1 : 1;
    const newItem = { id: newId.toString(), ...newData };
    data.push(newItem);
    await this.save(filename, data);
    return newItem;
  }

  async update(filename, id, updatedData) {
    const data = await this.load(filename);
    const index = data.findIndex(item => item.id.toString() === id.toString());
    if (index === -1) return null;
    data[index] = { ...data[index], ...updatedData, id: data[index].id };
    await this.save(filename, data);
    return data[index];
  }

  async delete(filename, id) {
    const data = await this.load(filename);
    const filtered = data.filter(item => item.id.toString() !== id.toString());
    await this.save(filename, filtered);
    return { success: true };
  }

  // Employees
  getEmployees() { return this.getAll('employees.json'); }
  getEmployeeById(id) { return this.getById('employees.json', id); }
  createEmployee(data) { return this.create('employees.json', data); }
  updateEmployee(id, data) { return this.update('employees.json', id, data); }
  deleteEmployee(id) { return this.delete('employees.json', id); }

  // Departments
  getDepartments() { return this.getAll('departments.json'); }
  getDepartmentById(id) { return this.getById('departments.json', id); }
  createDepartment(data) { return this.create('departments.json', data); }
  updateDepartment(id, data) { return this.update('departments.json', id, data); }
  deleteDepartment(id) { return this.delete('departments.json', id); }

  // Salaries
  getSalaries() { return this.getAll('salaries.json'); }
  getSalaryById(id) { return this.getById('salaries.json', id); }
  async getSalariesByEmployeeId(employeeId) {
    const data = await this.getAll('salaries.json');
    return data.filter(item => item.employeeId?.toString() === employeeId.toString());
  }
  createSalary(data) { return this.create('salaries.json', data); }
  updateSalary(id, data) { return this.update('salaries.json', id, data); }
  deleteSalary(id) { return this.delete('salaries.json', id); }

  // Attendance
  getAttendance() { return this.getAll('attendance.json'); }
  getAttendanceById(id) { return this.getById('attendance.json', id); }
  async getAttendanceByEmployeeId(employeeId) {
    const data = await this.getAll('attendance.json');
    return data.filter(item => item.employeeId?.toString() === employeeId.toString());
  }
  createAttendance(data) { return this.create('attendance.json', data); }
  updateAttendance(id, data) { return this.update('attendance.json', id, data); }
  deleteAttendance(id) { return this.delete('attendance.json', id); }

  // Leaves
  getLeaves() { return this.getAll('leaves.json'); }
  getLeaveById(id) { return this.getById('leaves.json', id); }
  async getLeavesByEmployeeId(employeeId) {
    const data = await this.getAll('leaves.json');
    return data.filter(item => item.employeeId?.toString() === employeeId.toString());
  }
  createLeave(data) { return this.create('leaves.json', data); }
  updateLeave(id, data) { return this.update('leaves.json', id, data); }
  approveLeave(id) { return this.update('leaves.json', id, { status: 'Approved' }); }
  rejectLeave(id) { return this.update('leaves.json', id, { status: 'Rejected' }); }
  deleteLeave(id) { return this.delete('leaves.json', id); }
}

module.exports = new LocalDataService();