const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const externalApiService = require('./services/externalApiService');

const app = express();
const PORT = 5000;

console.log(' Server starting...');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== ROOT & HEALTH ====================

app.get('/', (req, res) => {
  res.json({
    name: 'HR Management API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      departments: '/api/departments',
      employees: '/api/employees',
      attendance: '/api/attendance',
      leaves: '/api/leaves',
      salaries: '/api/salaries'
    }
  });
});



// ==================== DEPARTMENTS ====================

app.get('/api/departments', asyncHandler(async (req, res) => {
  const departments = await externalApiService.getDepartments();
  res.json(departments);
}));

app.get('/api/departments/:id', asyncHandler(async (req, res) => {
  const department = await externalApiService.getDepartmentById(req.params.id);
  if (department) {
    res.json(department);
  } else {
    res.status(404).json({ error: 'Department not found' });
  }
}));

app.post('/api/departments', asyncHandler(async (req, res) => {
  const newDepartment = await externalApiService.createDepartment(req.body);
  res.status(201).json(newDepartment);
}));

app.put('/api/departments/:id', asyncHandler(async (req, res) => {
  const updatedDepartment = await externalApiService.updateDepartment(req.params.id, req.body);
  if (updatedDepartment) {
    res.json(updatedDepartment);
  } else {
    res.status(404).json({ error: 'Department not found' });
  }
}));

app.delete('/api/departments/:id', asyncHandler(async (req, res) => {
  await externalApiService.deleteDepartment(req.params.id);
  res.json({ success: true, message: 'Department deleted successfully' });
}));

// ==================== EMPLOYEES ====================

app.get('/api/employees', asyncHandler(async (req, res) => {
  const employees = await externalApiService.getEmployees();
  res.json(employees);
}));

app.get('/api/employees/:id', asyncHandler(async (req, res) => {
  const employee = await externalApiService.getEmployeeById(req.params.id);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
}));

app.post('/api/employees', asyncHandler(async (req, res) => {
  const newEmployee = await externalApiService.createEmployee(req.body);
  res.status(201).json(newEmployee);
}));

app.put('/api/employees/:id', asyncHandler(async (req, res) => {
  const updatedEmployee = await externalApiService.updateEmployee(req.params.id, req.body);
  if (updatedEmployee) {
    res.json(updatedEmployee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
}));

app.delete('/api/employees/:id', asyncHandler(async (req, res) => {
  await externalApiService.deleteEmployee(req.params.id);
  res.json({ success: true, message: 'Employee deleted successfully' });
}));

// ==================== ATTENDANCE ====================

app.get('/api/attendance', asyncHandler(async (req, res) => {
  const attendance = await externalApiService.getAttendance();
  res.json(attendance);
}));

app.get('/api/attendance/:id', asyncHandler(async (req, res) => {
  const record = await externalApiService.getAttendanceById(req.params.id);
  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ error: 'Attendance record not found' });
  }
}));

app.get('/api/attendance/employee/:employeeId', asyncHandler(async (req, res) => {
  const records = await externalApiService.getAttendanceByEmployeeId(req.params.employeeId);
  res.json(records);
}));

app.post('/api/attendance', asyncHandler(async (req, res) => {
  const newRecord = await externalApiService.createAttendance(req.body);
  res.status(201).json(newRecord);
}));

app.put('/api/attendance/:id', asyncHandler(async (req, res) => {
  const updatedRecord = await externalApiService.updateAttendance(req.params.id, req.body);
  if (updatedRecord) {
    res.json(updatedRecord);
  } else {
    res.status(404).json({ error: 'Attendance record not found' });
  }
}));

app.delete('/api/attendance/:id', asyncHandler(async (req, res) => {
  await externalApiService.deleteAttendance(req.params.id);
  res.json({ success: true, message: 'Attendance record deleted successfully' });
}));

// ==================== LEAVES ====================

app.get('/api/leaves', asyncHandler(async (req, res) => {
  const leaves = await externalApiService.getLeaves();
  res.json(leaves);
}));

app.get('/api/leaves/:id', asyncHandler(async (req, res) => {
  const leave = await externalApiService.getLeaveById(req.params.id);
  if (leave) {
    res.json(leave);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
}));

app.get('/api/leaves/employee/:employeeId', asyncHandler(async (req, res) => {
  const records = await externalApiService.getLeavesByEmployeeId(req.params.employeeId);
  res.json(records);
}));

app.post('/api/leaves', asyncHandler(async (req, res) => {
  const newLeave = await externalApiService.createLeave(req.body);
  res.status(201).json(newLeave);
}));

app.put('/api/leaves/:id', asyncHandler(async (req, res) => {
  const updatedLeave = await externalApiService.updateLeave(req.params.id, req.body);
  if (updatedLeave) {
    res.json(updatedLeave);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
}));

app.put('/api/leaves/:id/approve', asyncHandler(async (req, res) => {
  const approvedLeave = await externalApiService.approveLeave(req.params.id);
  if (approvedLeave) {
    res.json(approvedLeave);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
}));

app.put('/api/leaves/:id/reject', asyncHandler(async (req, res) => {
  const rejectedLeave = await externalApiService.rejectLeave(req.params.id);
  if (rejectedLeave) {
    res.json(rejectedLeave);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
}));

app.delete('/api/leaves/:id', asyncHandler(async (req, res) => {
  await externalApiService.deleteLeave(req.params.id);
  res.json({ success: true, message: 'Leave request deleted successfully' });
}));

// ==================== SALARIES ====================

app.get('/api/salaries', asyncHandler(async (req, res) => {
  const salaries = await externalApiService.getSalaries();
  res.json(salaries);
}));

app.get('/api/salaries/:id', asyncHandler(async (req, res) => {
  const salary = await externalApiService.getSalaryById(req.params.id);
  if (salary) {
    res.json(salary);
  } else {
    res.status(404).json({ error: 'Salary not found' });
  }
}));

app.get('/api/salaries/employee/:employeeId', asyncHandler(async (req, res) => {
  const records = await externalApiService.getSalariesByEmployeeId(req.params.employeeId);
  res.json(records);
}));

app.post('/api/salaries', asyncHandler(async (req, res) => {
  const newSalary = await externalApiService.createSalary(req.body);
  res.status(201).json(newSalary);
}));

app.put('/api/salaries/:id', asyncHandler(async (req, res) => {
  const updatedSalary = await externalApiService.updateSalary(req.params.id, req.body);
  if (updatedSalary) {
    res.json(updatedSalary);
  } else {
    res.status(404).json({ error: 'Salary not found' });
  }
}));

app.delete('/api/salaries/:id', asyncHandler(async (req, res) => {
  await externalApiService.deleteSalary(req.params.id);
  res.json({ success: true, message: 'Salary deleted successfully' });
}));

// ==================== ERROR HANDLERS ====================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: {
      root: '/',
      departments: '/api/departments',
      employees: '/api/employees',
      attendance: '/api/attendance',
      leaves: '/api/leaves',
      salaries: '/api/salaries'
    }
  });
});

app.use((error, req, res, next) => {
  console.error('Global Error:', error.message);
  res.status(error.status || 500).json({ 
    error: error.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`\n HR App API Server running on http://localhost:${PORT}`);
  console.log(`\n Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/              - API Info`);
  console.log(`   CRUD http://localhost:${PORT}/api/departments`);
  console.log(`   CRUD http://localhost:${PORT}/api/employees`);
  console.log(`   CRUD http://localhost:${PORT}/api/attendance`);
  console.log(`   CRUD http://localhost:${PORT}/api/leaves`);
  console.log(`   CRUD http://localhost:${PORT}/api/salaries\n`);
});
