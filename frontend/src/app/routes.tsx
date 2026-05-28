import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { PatientLoginPage } from "./pages/PatientLoginPage";
import { PatientRegisterPage } from "./pages/PatientRegisterPage";
import { PatientDashboardPage } from "./pages/PatientDashboardPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { PatientsPage } from "./pages/PatientsPage";
import { PatientHistoryPage } from "./pages/PatientHistoryPage";
import { InventoryPage } from "./pages/InventoryPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { UsersPage } from "./pages/UsersPage";
import { OdontologosPage } from "./pages/OdontologosPage";
import { LogsPage } from "./pages/LogsPage";
import { ProtectedRoute, PatientProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/patient/login",
    element: <PatientLoginPage />,
  },
  {
    path: "/patient/register",
    element: <PatientRegisterPage />,
  },
  {
    path: "/patient/dashboard",
    element: (
      <PatientProtectedRoute>
        <PatientDashboardPage />
      </PatientProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "patients", element: <PatientsPage /> },
      { path: "patients/:patientId/history", element: <PatientHistoryPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "appointments", element: <AppointmentsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "odontologos", element: <OdontologosPage /> },
      { path: "logs", element: <LogsPage /> },
    ],
  },
]);