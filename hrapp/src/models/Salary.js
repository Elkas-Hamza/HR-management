class Salary {
  constructor(data = {}) {
    this.id = data.id || null;
    this.employeeId = data.employeeId || null;
    this.baseSalary = data.baseSalary || 0;
    this.bonus = data.bonus || 0;
    this.month = data.month || new Date().toISOString().slice(0, 7);
  }

  getTotalSalary() {
    return this.baseSalary + this.bonus;
  }

  toJSON() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      baseSalary: this.baseSalary,
      bonus: this.bonus,
      month: this.month
    };
  }
}

export default Salary;
