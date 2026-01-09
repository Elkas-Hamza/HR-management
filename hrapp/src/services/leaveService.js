import axios from 'axios';
import LeaveRequest from '../models/LeaveRequest';

const API_URL = 'http://localhost:5000/api/leaves';

class LeaveService {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data.map(l => new LeaveRequest(l));
    } catch (error) {
      console.error('Error fetching leaves:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return new LeaveRequest(response.data);
    } catch (error) {
      console.error('Error fetching leave:', error);
      return null;
    }
  }

  async getByEmployeeId(employeeId) {
    try {
      const response = await axios.get(`${API_URL}/employee/${employeeId}`);
      return response.data.map(l => new LeaveRequest(l));
    } catch (error) {
      console.error('Error fetching leaves:', error);
      return [];
    }
  }

  async create(leaveData) {
    try {
      const response = await axios.post(API_URL, leaveData);
      return new LeaveRequest(response.data);
    } catch (error) {
      console.error('Error creating leave:', error);
      throw error;
    }
  }

  async update(id, leaveData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, leaveData);
      return new LeaveRequest(response.data);
    } catch (error) {
      console.error('Error updating leave:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting leave:', error);
      throw error;
    }
  }

  async approve(id) {
    try {
      const response = await axios.put(`${API_URL}/${id}/approve`);
      return new LeaveRequest(response.data);
    } catch (error) {
      console.error('Error approving leave:', error);
      throw error;
    }
  }

  async reject(id) {
    try {
      const response = await axios.put(`${API_URL}/${id}/reject`);
      return new LeaveRequest(response.data);
    } catch (error) {
      console.error('Error rejecting leave:', error);
      throw error;
    }
  }

  filterByStatus(leaveRequests, status) {
    if (!status) return leaveRequests;
    return leaveRequests.filter(l => l.status === status);
  }

  filterByType(leaveRequests, type) {
    if (!type) return leaveRequests;
    return leaveRequests.filter(l => l.type === type);
  }

  getPendingCount(leaveRequests) {
    return leaveRequests.filter(l => l.status === 'Pending').length;
  }

  exportToCSV(leaveRequests) {
    const headers = ['ID', 'Employee ID', 'Start Date', 'End Date', 'Type', 'Status', 'Reason', 'Duration (days)'];
    const rows = leaveRequests.map(leave => [
      leave.id,
      leave.employeeId,
      leave.startDate,
      leave.endDate,
      leave.type,
      leave.status,
      leave.reason,
      leave.getDuration()
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaves_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }
}

const leaveService = new LeaveService();
export default leaveService;

