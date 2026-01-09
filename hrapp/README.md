# MyHR - HR Management Backoffice

A complete React-based HR Management System built with MVC architecture.

## 🎯 Project Overview

MyHR is a professional HR management backoffice application that provides comprehensive employee management, department tracking, salary management, attendance monitoring, and leave request handling.

## 🛠️ Tech Stack

- **Frontend**: React 19.2.3
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js (via react-chartjs-2)
- **Routing**: React Router v6
- **State Management**: React Context API + Hooks
- **HTTP Client**: Axios
- **Internationalization**: react-i18next
- **Authentication**: Static credentials (admin/admin)

## 📁 MVC Architecture

```
src/
 ├── models/              # Data models (Employee, Department, Salary, etc.)
 ├── services/            # Business logic & API calls (Controllers)
 ├── views/               # UI Pages (Views)
 ├── components/          # Reusable components
 ├── contexts/            # React Context (Auth)
 ├── data/                # Mock JSON data
 └── i18n/                # Translation files (EN, FR, AR)
```

### Models
- `Employee.js` - Employee data structure and methods
- `Department.js` - Department model
- `Salary.js` - Salary calculation model
- `Attendance.js` - Attendance tracking model
- `LeaveRequest.js` - Leave request model

### Services (Controllers)
- `employeeService.js` - Employee CRUD, search, filter, export
- `departmentService.js` - Department management
- `salaryService.js` - Salary operations and distribution analysis
- `attendanceService.js` - Attendance tracking and reporting
- `leaveService.js` - Leave request management

### Views (Pages)
- `Dashboard.jsx` - KPI cards + 5 charts
- `Login.jsx` - Authentication page
- **Employees**: List, Form, Details
- **Departments**: List with inline editing
- **Salaries**: List with filtering
- **Attendance**: List with date/status filters
- **Leaves**: List with approval workflow

### Components
- `Navbar.jsx` - Top navigation with language selector
- `Sidebar.jsx` - Side navigation menu
- `DataTable.jsx` - Reusable data table with actions
- `ConfirmModal.jsx` - Confirmation dialog
- `ProtectedRoute.jsx` - Route protection

## 🚀 Features

### ✅ Complete CRUD Operations
All entities (Employees, Departments, Salaries, Attendance, Leaves) support:
- ✓ Create via forms
- ✓ Read with pagination & filtering
- ✓ Update with edit forms
- ✓ Delete with confirmation
- ✓ Search & filter
- ✓ Sort by columns
- ✓ Export to CSV
- ✓ Details view with related data

### 📊 Dashboard Analytics (5+ Charts)

1. **KPI Cards**:
   - Total Employees
   - Active Employees  
   - Pending Leave Requests
   - Total Departments

2. **Charts**:
   - 📊 Employees per Department (Bar Chart)
   - 💰 Salary Distribution (Histogram)
   - 📈 Attendance Rate (Pie Chart)
   - 📅 Monthly Hires (Line Chart)
   - 📉 Absence Trend (Area Chart)

### 🔐 Authentication
- Login page with static credentials
- Username: `admin`
- Password: `admin`
- Protected routes with redirect
- Session persistence via localStorage

### 🌍 Internationalization
- **English** (EN)
- **French** (FR)
- **Arabic** (AR) with RTL support
- Language switcher in navbar
- All UI text translated

### 🎨 UI/UX Features
- Responsive design (mobile, tablet, desktop)
- Clean, professional admin interface
- Sidebar navigation
- Color-coded status badges
- Modal forms for quick actions
- Print-friendly employee details

## 📦 Installation

```bash
cd hrapp
npm install
```

## ▶️ Running the Application

```bash
npm start
```

The app will run on [http://localhost:3000](http://localhost:3000)

## 🔑 Login Credentials

```
Username: admin
Password: admin
```

## 📊 Data Sources

- **Employees**: DummyJSON API (https://dummyjson.com/users)
- **Departments, Salaries, Attendance, Leaves**: Local JSON files in `src/data/`

## 🏗️ Project Structure Explanation

### MVC Pattern in React

**Models** (`src/models/`):
- Pure JavaScript classes representing data structures
- Contain business logic methods (e.g., `getTotalSalary()`, `getDuration()`)
- Provide data validation and transformation

**Controllers** (`src/services/`):
- Handle all business logic and data operations
- API calls and data fetching
- CRUD operations implementation
- Export functionality
- Search, filter, sort algorithms

**Views** (`src/views/`):
- React components representing pages/screens
- Handle user interactions
- Display data from services
- Form submissions

## 🎓 Educational Value

This project demonstrates:

1. **Clean Architecture**: Clear separation of concerns (MVC)
2. **Best Practices**: 
   - Component reusability
   - Service layer pattern
   - Context API for state management
   - Protected routes
   - Responsive design

3. **Real-world Features**:
   - Authentication flow
   - CRUD operations
   - Data visualization
   - Multi-language support
   - Export functionality

4. **Modern React**:
   - Functional components
   - Hooks (useState, useEffect, useContext)
   - React Router v6
   - Controlled forms

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
