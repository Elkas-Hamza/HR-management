class LeaveRequest {
  constructor(data = {}) {
    this.id = data.id || null;
    this.employeeId = data.employeeId || null;
    this.startDate = data.startDate || new Date().toISOString().split('T')[0];
    this.endDate = data.endDate || new Date().toISOString().split('T')[0];
    this.type = data.type || 'Vacation'; // Vacation | Sick | Personal
    this.status = data.status || 'Pending'; // Pending | Approved | Rejected
    this.reason = data.reason || '';
  }

  getDuration() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff + 1;
  }

  isPending() {
    return this.status === 'Pending';
  }

  toJSON() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      startDate: this.startDate,
      endDate: this.endDate,
      type: this.type,
      status: this.status,
      reason: this.reason
    };
  }
}

export default LeaveRequest;
