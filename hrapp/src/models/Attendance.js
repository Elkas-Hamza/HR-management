class Attendance {
  constructor(data = {}) {
    this.id = data.id || null;
    this.employeeId = data.employeeId || null;
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.status = data.status || 'Present'; // Present | Absent | Late
  }

  isPresent() {
    return this.status === 'Present';
  }

  toJSON() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      date: this.date,
      status: this.status
    };
  }
}

export default Attendance;
