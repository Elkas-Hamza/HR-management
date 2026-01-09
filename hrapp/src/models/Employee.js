class Employee {
  constructor(data = {}) {
    this.id = data.id || null;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.departmentId = data.departmentId || null;
    this.hireDate = data.hireDate || new Date().toISOString().split('T')[0];
    this.status = data.status || 'Active';
    this.picture = data.picture || '';
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive() {
    return this.status === 'Active';
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      departmentId: this.departmentId,
      hireDate: this.hireDate,
      status: this.status,
      picture: this.picture
    };
  }
}

export default Employee;
