import axios from 'axios';
import Attendance from '../models/Attendance';

const API_URL = 'http://localhost:5000/api/attendance';

class AttendanceService {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data.map(a => new Attendance(a));
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return new Attendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return null;
    }
  }

  async getByEmployeeId(employeeId) {
    try {
      const response = await axios.get(`${API_URL}/employee/${employeeId}`);
      return response.data.map(a => new Attendance(a));
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  }

  async create(attendanceData) {
    try {
      const response = await axios.post(API_URL, attendanceData);
      return new Attendance(response.data);
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  }

  async update(id, attendanceData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, attendanceData);
      return new Attendance(response.data);
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  }

  filterByDate(attendanceRecords, date) {
    if (!date) return attendanceRecords;
    return attendanceRecords.filter(a => a.date === date);
  }

  filterByStatus(attendanceRecords, status) {
    if (!status) return attendanceRecords;
    return attendanceRecords.filter(a => a.status === status);
  }

  getAttendanceRate(attendanceRecords) {
    const total = attendanceRecords.length;
    if (total === 0) return { present: 0, late: 0, absent: 0 };
    
    const present = attendanceRecords.filter(a => a.status === 'Present').length;
    const late = attendanceRecords.filter(a => a.status === 'Late').length;
    const absent = attendanceRecords.filter(a => a.status === 'Absent').length;

    return {
      present: Math.round((present / total) * 100),
      late: Math.round((late / total) * 100),
      absent: Math.round((absent / total) * 100)
    };
  }

  getAbsenceTrend(attendanceRecords) {
    // Group by date and count absences
    const absencesByDate = {};
    attendanceRecords.forEach(record => {
      if (record.status === 'Absent') {
        absencesByDate[record.date] = (absencesByDate[record.date] || 0) + 1;
      }
    });

    return Object.entries(absencesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  exportToCSV(attendanceRecords) {
    const headers = ['ID', 'Employee ID', 'Date', 'Status'];
    const rows = attendanceRecords.map(att => [
      att.id,
      att.employeeId,
      att.date,
      att.status
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }
}

const attendanceService = new AttendanceService();
export default attendanceService;
