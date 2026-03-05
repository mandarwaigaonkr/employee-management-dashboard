# Employee Dashboard

This project is an Employee Management Dashboard built with Angular 17, Angular Material, and a JSON Server mock backend.

## Architecture

The project follows a component-based architecture using Angular 17 Standalone Components.

- **Components:** Handles the UI representation (`Navbar`, `EmployeeList`, `EmployeeDetail`, `EmployeeForm`).
- **Services:** `EmployeeService` handles HTTP calls to the backend.
- **Models:** `Employee` interface defines the data structure.
- **Pipes:** `DepartmentFilterPipe` provides custom filtering logic.
- **Directives:** `HighlightSalaryDirective` alters DOM elements based on logic.
- **Interceptors:** `httpInterceptor` intercepts all HTTP calls for logging and global error handling.

### Diagram
```text
[ Angular Frontend (Port 4200) ]
       |
  (HTTP calls intercepted by HttpInterceptor)
       |
[ JSON Server Backend (Port 3000) ]
```

## Setup Instructions

1. Clone or download the repository.
2. Ensure you have Node.js and Angular CLI installed.
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the application

You need to run both the Angular server and the JSON mock backend server concurrently.

### 1. Run the JSON Server (Mock Backend)
In a terminal, run:
```bash
npx json-server --watch db.json --port 3000
```

### 2. Run the Angular Development Server
In another terminal, run:
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
