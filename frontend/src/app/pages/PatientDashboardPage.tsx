import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { pacientesApi, citasApi, odontologosApi } from "../services/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Calendar,
  Clock,
  FileText,
  Pill,
  User,
  LogOut,
  Moon,
  Sun,
  Plus,
  Edit,
  Trash2,
  Download,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "../contexts/NotificationContext";
import { useTheme } from "../contexts/ThemeContext";
import { ChangePasswordModal } from "../components/ChangePasswordModal";



const appointmentTypes = [
  "Consulta General",
  "Limpieza Dental",
  "Ortodoncia",
  "Endodoncia",
  "Extracción",
  "Blanqueamiento",
  "Emergencia",
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  dentist: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

export function PatientDashboardPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // Estado para el perfil real
  const [patientData, setPatientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<any[]>([]);
  const [rawProfile, setRawProfile] = useState<any>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nombres: "",
    apellidos: "",
    documento_identidad: "",
    fecha_nacimiento: "",
    sexo: "",
    alergias: "",
    tipo_sangre: "",
    telefono: "",
    correo: "",
    direccion: "",
    contacto_emergencia_nombre: "",
    contacto_emergencia_telefono: "",
  });

  const handleEditProfile = () => {
    if (!rawProfile) return;
    setProfileForm({
      nombres: rawProfile.nombres || "",
      apellidos: rawProfile.apellidos || "",
      documento_identidad: rawProfile.documento_identidad || "",
      fecha_nacimiento: rawProfile.fecha_nacimiento ? rawProfile.fecha_nacimiento.split(/[T ]/)[0] : "",
      sexo: rawProfile.sexo || "",
      alergias: rawProfile.alergias || "",
      tipo_sangre: rawProfile.tipo_sangre || "",
      telefono: rawProfile.telefono || "",
      correo: rawProfile.correo || "",
      direccion: rawProfile.direccion || "",
      contacto_emergencia_nombre: rawProfile.contacto_emergencia_nombre || "",
      contacto_emergencia_telefono: rawProfile.contacto_emergencia_telefono || "",
    });
    setIsProfileDialogOpen(true);
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pacientesApi.update(rawProfile.id_paciente, profileForm);
      toast.success("Perfil actualizado exitosamente");
      setIsProfileDialogOpen(false);
      // Reload profile
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar perfil");
    }
  };

  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "",
    type: "", // esto será la especialidad/motivo general
    doctorId: "", // esto será el id del doctor seleccionado
    notes: "",
  });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, appointment: null as any, reason: '' });



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [perfil, misCitas, miHistorial, misRecetas, docs] = await Promise.all([
          pacientesApi.getMiPerfil(),
          pacientesApi.getMisCitas(),
          pacientesApi.getMiHistorial(),
          pacientesApi.getMisRecetas(),
          odontologosApi.getAll()
        ]);

        setDoctorsList(docs);
        setRawProfile(perfil);
        setPatientData({
          id: perfil.id_paciente,
          name: `${perfil.nombres} ${perfil.apellidos}`,
          documentId: perfil.documento_identidad || 'No registrado',
          age: calcularEdad(perfil.fecha_nacimiento),
          phone: perfil.telefono || 'No registrado',
          email: perfil.correo || 'No registrado',
          bloodType: perfil.tipo_sangre || 'No registrado',
          allergies: perfil.alergias || 'Ninguna conocida',
          emergencyContact: perfil.contacto_emergencia_nombre ? `${perfil.contacto_emergencia_nombre} - ${perfil.contacto_emergencia_telefono || ''}` : 'No registrado',
        });

        setAppointments(misCitas.map((c: any) => ({
          id: c.id_cita.toString(),
          date: c.fecha_cita.split(/[T ]/)[0],
          time: new Date(c.fecha_cita.replace(' ', 'T')).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          type: c.motivo || 'Consulta General',
          dentist: c.odontologo_nombre ? `Dr/a. ${c.odontologo_nombre} ${c.odontologo_apellido}` : 'Por asignar',
          status: c.estado_codigo.toLowerCase(),
          rawStatusId: c.id_estado_cita,
          rawTime: c.fecha_cita.split(/[T ]/)[1].substring(0, 5),
          notes: c.notas || ''
        })));

        setClinicalNotes(miHistorial.map((h: any) => ({
          id: h.id_consulta.toString(),
          date: h.fecha_consulta.split(/[T ]/)[0],
          title: h.motivo_consulta,
          content: `${h.diagnostico} - ${h.tratamiento}`,
          dentist: `Dr/a. ${h.odontologo_nombre} ${h.odontologo_apellido}`,
          category: 'treatment'
        })));

        setPrescriptions(misRecetas.map((r: any) => {
          // detalles es un array de objetos — lo convertimos a string legible
          let medicationText = 'Sin detalles de medicamentos';
          if (Array.isArray(r.detalles) && r.detalles.length > 0) {
            medicationText = r.detalles
              .map((d: any) => `${d.medicamento_nombre} — ${d.dosis} — ${d.frecuencia} por ${d.duracion}`)
              .join('\n');
          } else if (typeof r.detalles === 'string' && r.detalles) {
            medicationText = r.detalles;
          }
          return {
            id: r.id_receta.toString(),
            date: r.fecha_receta.split(/[T ]/)[0],
            medication: medicationText,
            dosage: 'Ver indicaciones',
            duration: '-',
            instructions: r.indicaciones_generales || 'Ninguna',
            dentist: `Dr/a. ${r.odontologo_nombre} ${r.odontologo_apellido}`
          };
        }));

      } catch (error) {
        console.error("Error cargando perfil", error);
        toast.error("Error al cargar tu perfil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const calcularEdad = (fecha: string) => {
    if (!fecha) return 0;
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  };


  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientData");
    toast.success("Sesión cerrada exitosamente");
    navigate("/patient/login");
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setAppointmentForm({ date: "", time: "", type: "", doctorId: "", notes: "" });
    setIsAppointmentDialogOpen(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      date: appointment.date,
      time: appointment.rawTime,
      type: appointment.type,
      doctorId: appointment.dentist !== 'Por asignar' ? appointment.doctorId || "" : "",
      notes: appointment.notes,
    });
    setIsAppointmentDialogOpen(true);
  };

  const handleDeleteAppointment = (apt: any) => {
    // 1. Validar 24 horas
    const appointmentDate = new Date(`${apt.date}T${apt.rawTime || "00:00"}:00`);
    const now = new Date();
    const diffHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      toast.error("Solo puedes cancelar citas con al menos 24 horas de anticipación. Por favor comunícate con la clínica.");
      return;
    }

    setCancelModal({ isOpen: true, appointment: apt, reason: '' });
  };

  const confirmCancelAppointment = async () => {
    const { appointment: apt, reason } = cancelModal;
    if (!apt) return;
    if (reason.trim() === "") {
      toast.error("El motivo de cancelación es obligatorio");
      return;
    }

    try {
      const payload = {
        id_odontologo: apt.doctorId || null,
        id_estado_cita: 4, // 4 = CANCELADA
        fecha_cita: `${apt.date} ${apt.rawTime || "00:00"}:00`,
        motivo: apt.type,
        notas: apt.notes ? `${apt.notes} | Cancelada por paciente: ${reason}` : `Cancelada por paciente: ${reason}`
      };
      
      await citasApi.update(apt.id, payload);
      toast.success("Cita cancelada exitosamente");
      window.location.reload(); // Recargar para reflejar el estado actualizado
    } catch (error: any) {
      toast.error(error.message || "Error al cancelar la cita");
    }
  };

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id_odontologo: appointmentForm.doctorId || null,
        id_estado_cita: editingAppointment ? editingAppointment.rawStatusId : 1,
        fecha_cita: `${appointmentForm.date} ${appointmentForm.time}:00`,
        motivo: appointmentForm.type || "Consulta",
        notas: appointmentForm.notes
      };

      if (editingAppointment) {
        await citasApi.update(editingAppointment.id, payload);
        toast.success("Cita actualizada correctamente");
      } else {
        const newCita = await citasApi.create(payload);
        toast.success("Cita solicitada exitosamente");
        
        addNotification({
          type: "appointment_request",
          title: "Nueva Solicitud de Cita",
          message: `${patientData?.name} ha solicitado una cita para ${appointmentForm.type}`,
          patientId: patientData?.id,
          patientName: patientData?.name,
          appointmentId: newCita.id_cita?.toString(),
          appointmentData: {
            date: appointmentForm.date,
            time: appointmentForm.time,
            type: appointmentForm.type
          }
        });
      }
      setIsAppointmentDialogOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Error al procesar la cita");
    }
  };

  const filteredDoctors = doctorsList;

  const upcomingAppointments = appointments.filter(
    (apt) => apt.date >= new Date().toISOString().split("T")[0] && apt.status !== "completada" && apt.status !== "cancelada"
  );

  const historyAppointments = appointments.filter((apt) => apt.status === "completada" || apt.status === "cancelada");

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
    > = {
      completada: { variant: "default", label: "Completada" },
      pendiente: { variant: "outline", label: "Solicitada" },
      confirmada: { variant: "secondary", label: "Aceptada" },
      cancelada: { variant: "destructive", label: "Cancelada" },
    };
    const config = variants[status] || { variant: "outline", label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (isLoading || !patientData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="font-semibold">Portal del Paciente</h1>
              <p className="text-sm text-muted-foreground">{patientData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl tracking-tight">Bienvenido, {patientData.name.split(" ")[0]}</h2>
            <p className="text-muted-foreground mt-1">
              Gestiona tus citas y consulta tu información médica
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Próximas Citas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                <p className="text-sm text-muted-foreground mt-1">Citas programadas</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Recetas Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptions.length}</div>
                <p className="text-sm text-muted-foreground mt-1">Medicamentos recetados</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Historial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{historyAppointments.length}</div>
                <p className="text-sm text-muted-foreground mt-1">Citas completadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="appointments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="appointments">Mis Citas</TabsTrigger>
              <TabsTrigger value="prescriptions">Recetas</TabsTrigger>
              <TabsTrigger value="history">Historial Clínico</TabsTrigger>
              <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Mis Citas</CardTitle>
                    <Button
                      onClick={handleAddAppointment}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Solicitar Cita
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Upcoming Appointments */}
                    {upcomingAppointments.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Próximas Citas
                        </h3>
                        {upcomingAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium">{apt.type}</p>
                                    {getStatusBadge(apt.status)}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                  {new Date(apt.date + 'T12:00:00').toLocaleDateString("es-ES", {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                    })}{" "}
                                    - {apt.time}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{apt.dentist}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteAppointment(apt)}
                                  className="text-destructive hover:text-destructive"
                                  title="Eliminar cita"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Completed Appointments */}
                    {historyAppointments.length > 0 && (
                      <div className="space-y-2 mt-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Historial de Citas
                        </h3>
                        {historyAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-4 border rounded-lg bg-muted/20"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium">{apt.type}</p>
                                  {getStatusBadge(apt.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(apt.date).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}{" "}
                                  - {apt.time}
                                </p>
                                <p className="text-sm text-muted-foreground">{apt.dentist}</p>
                                {apt.notes && (
                                  <p className="text-sm mt-2">{apt.notes}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Mis Recetas Médicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div
                        key={prescription.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-center shrink-0">
                            <Pill className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{prescription.medication}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(prescription.date + 'T12:00:00').toLocaleDateString("es-ES")}
                              </p>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Dosis:</span> {prescription.dosage}
                              </p>
                              <p>
                                <span className="font-medium">Duración:</span>{" "}
                                {prescription.duration}
                              </p>
                              <p>
                                <span className="font-medium">Instrucciones:</span>{" "}
                                {prescription.instructions}
                              </p>
                              <p className="text-muted-foreground">
                                Recetado por: {prescription.dentist}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clinical History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Mi Historial Clínico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clinicalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{note.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(note.date + 'T12:00:00').toLocaleDateString("es-ES")}
                              </p>
                            </div>
                            <p className="text-sm mb-2">{note.content}</p>
                            <p className="text-sm text-muted-foreground">
                              Atendido por: {note.dentist}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Mi Información Personal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Nombre Completo</Label>
                        <p className="font-medium mt-1">{patientData.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Documento de Identidad</Label>
                        <p className="font-medium mt-1">{patientData.documentId}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Edad</Label>
                        <p className="font-medium mt-1">{patientData.age} años</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tipo de Sangre</Label>
                        <p className="font-medium mt-1">{patientData.bloodType}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Teléfono</Label>
                        <p className="font-medium mt-1">{patientData.phone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium mt-1">{patientData.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Alergias</Label>
                        <p className="font-medium mt-1">{patientData.allergies}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Contacto de Emergencia</Label>
                        <p className="font-medium mt-1">{patientData.emergencyContact}</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" onClick={handleEditProfile}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Información
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer with logout */}
      <footer className="border-t bg-white dark:bg-gray-800 mt-8">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Clínica Odontológica — Portal del Paciente</p>
        </div>
      </footer>

      {/* Appointment Dialog */}
      <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? "Editar Cita" : "Solicitar Nueva Cita"}
            </DialogTitle>
            <DialogDescription>
              {editingAppointment
                ? "Actualiza la información de tu cita"
                : "Completa los datos para solicitar una cita. El consultorio confirmará tu solicitud."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAppointment}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha Preferida *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora Preferida *</Label>
                  <Select
                    value={appointmentForm.time}
                    onValueChange={(value) =>
                      setAppointmentForm({ ...appointmentForm, time: value })
                    }
                  >
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Cita (Motivo) *</Label>
                <Select
                  value={appointmentForm.type}
                  onValueChange={(value) => {
                    setAppointmentForm({ ...appointmentForm, type: value });
                  }}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleccionar motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Odontólogo Preferido (Opcional)</Label>
                <Select
                  value={appointmentForm.doctorId}
                  onValueChange={(value) =>
                    setAppointmentForm({ ...appointmentForm, doctorId: value === "cualquiera" ? "" : value })
                  }
                >
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cualquiera">Cualquiera</SelectItem>
                    {filteredDoctors.map((doc: any) => (
                      <SelectItem key={doc.id_odontologo} value={doc.id_odontologo.toString()}>
                        Dr/a. {doc.nombre} {doc.apellido} {doc.especialidad ? `(${doc.especialidad})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Motivo de la Consulta</Label>
                <Input
                  id="notes"
                  value={appointmentForm.notes}
                  onChange={(e) =>
                    setAppointmentForm({ ...appointmentForm, notes: e.target.value })
                  }
                  placeholder="Describe brevemente el motivo..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAppointmentDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingAppointment ? "Actualizar" : "Solicitar Cita"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Información Personal</DialogTitle>
            <DialogDescription>
              Actualiza tus datos personales y médicos. Haz clic en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input
                  id="nombres"
                  value={profileForm.nombres}
                  onChange={(e) => setProfileForm({ ...profileForm, nombres: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  value={profileForm.apellidos}
                  onChange={(e) => setProfileForm({ ...profileForm, apellidos: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento_identidad">Doc. de Identidad</Label>
                <Input
                  id="documento_identidad"
                  value={profileForm.documento_identidad}
                  onChange={(e) => setProfileForm({ ...profileForm, documento_identidad: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={profileForm.fecha_nacimiento}
                  onChange={(e) => setProfileForm({ ...profileForm, fecha_nacimiento: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select
                  value={profileForm.sexo}
                  onValueChange={(val) => setProfileForm({ ...profileForm, sexo: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_sangre">Tipo de Sangre</Label>
                <Select
                  value={profileForm.tipo_sangre || "No registrado"}
                  onValueChange={(val) => setProfileForm({ ...profileForm, tipo_sangre: val !== "No registrado" ? val : "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No registrado">No registrado</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={profileForm.telefono}
                  onChange={(e) => setProfileForm({ ...profileForm, telefono: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  value={profileForm.correo}
                  onChange={(e) => setProfileForm({ ...profileForm, correo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={profileForm.direccion}
                  onChange={(e) => setProfileForm({ ...profileForm, direccion: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alergias">Alergias</Label>
                <Input
                  id="alergias"
                  value={profileForm.alergias}
                  onChange={(e) => setProfileForm({ ...profileForm, alergias: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto_emergencia_nombre">Contacto de Emergencia</Label>
                <Input
                  id="contacto_emergencia_nombre"
                  value={profileForm.contacto_emergencia_nombre}
                  onChange={(e) => setProfileForm({ ...profileForm, contacto_emergencia_nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto_emergencia_telefono">Teléfono de Emergencia</Label>
                <Input
                  id="contacto_emergencia_telefono"
                  value={profileForm.contacto_emergencia_telefono}
                  onChange={(e) => setProfileForm({ ...profileForm, contacto_emergencia_telefono: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={cancelModal.isOpen} onOpenChange={(isOpen) => setCancelModal(prev => ({ ...prev, isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Cita</DialogTitle>
            <DialogDescription>
              ¿Por qué necesitas cancelar esta cita? (El doctor leerá este motivo)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Motivo de cancelación *</Label>
              <Textarea 
                value={cancelModal.reason}
                onChange={(e) => setCancelModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Escribe el motivo aquí..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModal(prev => ({ ...prev, isOpen: false }))}>
              Atrás
            </Button>
            <Button variant="destructive" onClick={confirmCancelAppointment}>
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ChangePasswordModal portal="patient" />
    </div>
  );
}