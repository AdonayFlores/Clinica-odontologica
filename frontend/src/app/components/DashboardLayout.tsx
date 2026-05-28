import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  X,
  Activity,
  Stethoscope,
  UserCog,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useNotifications } from "../contexts/NotificationContext";
import { toast } from "sonner";
import { ChangePasswordModal } from "./ChangePasswordModal";

const navigation = [
  { name: "Dashboard",    href: "/dashboard",              icon: LayoutDashboard, roles: ['admin', 'dentista', 'asistente'] },
  { name: "Pacientes",    href: "/dashboard/patients",     icon: Users,           roles: ['admin', 'dentista', 'asistente'] },
  { name: "Odontólogos",  href: "/dashboard/odontologos",  icon: Stethoscope,     roles: ['admin'] },
  { name: "Usuarios",     href: "/dashboard/users",        icon: UserCog,         roles: ['admin'] },
  { name: "Insumos",      href: "/dashboard/inventory",   icon: Package,         roles: ['admin', 'asistente', 'dentista'] },
  { name: "Citas",        href: "/dashboard/appointments", icon: Calendar,        roles: ['admin', 'dentista', 'asistente'] },
  { name: "Reportes",     href: "/dashboard/reports",     icon: BarChart3,       roles: ['admin', 'dentista'] },
  { name: "Auditoría",    href: "/dashboard/logs",        icon: Activity,        roles: ['admin'] },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addNotification } = useNotifications();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;
  const userRol: string = user?.rol || '';
  const userName = user ? `${user.nombre} ${user.apellido}` : "Usuario";
  const userInitials = user ? `${user.nombre[0]}${user.apellido[0]}` : "U";

  // Filtrar navegación según rol
  const allowedNav = navigation.filter((item) => item.roles.includes(userRol));

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  const handleAcceptAppointment = (appointmentId: string, notificationId: string) => {
    // Actualizar el estado de la cita
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const updatedAppointments = appointments.map((apt: any) =>
      apt.id === appointmentId ? { ...apt, status: "scheduled", dentist: userName } : apt
    );
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    // Obtener información de la cita y el paciente
    const appointment = appointments.find((apt: any) => apt.id === appointmentId);
    
    // Crear notificación para el paciente
    if (appointment) {
      addNotification({
        type: "appointment_accepted",
        title: "Cita Aceptada",
        message: `Tu cita del ${new Date(appointment.date).toLocaleDateString("es-ES")} ha sido aceptada por ${userName}`,
        patientId: appointment.patientId || "1",
        patientName: appointment.patientName || "Paciente",
        appointmentId: appointmentId,
        userType: "patient",
      });
    }

    toast.success("Cita aceptada correctamente");
  };

  const handleRejectAppointment = (appointmentId: string, notificationId: string) => {
    // Actualizar el estado de la cita
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const updatedAppointments = appointments.map((apt: any) =>
      apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
    );
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    // Obtener información de la cita
    const appointment = appointments.find((apt: any) => apt.id === appointmentId);
    
    // Crear notificación para el paciente
    if (appointment) {
      addNotification({
        type: "appointment_rejected",
        title: "Cita Rechazada",
        message: `Tu cita del ${new Date(appointment.date).toLocaleDateString("es-ES")} no pudo ser aceptada. Por favor contacta con la clínica.`,
        patientId: appointment.patientId || "1",
        patientName: appointment.patientName || "Paciente",
        appointmentId: appointmentId,
        userType: "patient",
      });
    }

    toast.error("Cita rechazada");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Farmacia Dental</span>
              <span className="text-xs text-muted-foreground">Sistema de Gestión</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {allowedNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.href)}
                      className={`group flex gap-x-3 rounded-lg p-3 w-full transition-all ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-foreground hover:bg-muted hover:text-blue-600"
                      }`}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${active ? "text-blue-600" : ""}`} />
                      <span className="text-sm">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {/* Logout at sidebar bottom */}
            <div className="pb-4 pt-2 border-t border-border mt-2">
              <button
                onClick={handleLogout}
                className="group flex gap-x-3 rounded-lg p-3 w-full text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
            <div className="flex flex-col h-full">
              <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold">Farmacia Dental</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 px-3 py-4">
                <ul className="space-y-2">
                  {allowedNav.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => {
                            navigate(item.href);
                            setSidebarOpen(false);
                          }}
                          className={`group flex gap-x-3 rounded-lg p-3 w-full transition-all ${
                            active
                              ? "bg-blue-50 text-blue-600"
                              : "text-foreground hover:bg-muted hover:text-blue-600"
                          }`}
                        >
                          <Icon className={`h-5 w-5 shrink-0 ${active ? "text-blue-600" : ""}`} />
                          <span className="text-sm">{item.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              {/* Logout at mobile sidebar bottom */}
              <div className="px-3 pb-4 border-t border-border pt-2">
                <button
                  onClick={handleLogout}
                  className="group flex gap-x-3 rounded-lg p-3 w-full text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Dark mode toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full"
                title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-muted">
                    <span className="hidden sm:block text-sm">{userName}</span>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="text-sm">{userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : "Usuario"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Visible logout button in topbar */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Salir</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <ChangePasswordModal portal="staff" />
    </div>
  );
}