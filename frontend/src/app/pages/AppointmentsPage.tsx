import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Clock, User, History, Stethoscope } from "lucide-react";
import { toast } from "sonner";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

import { useEffect } from "react";
import { citasApi, pacientesApi, odontologosApi } from "../services/api";

const appointmentTypes = [
  "Consulta General",
  "Limpieza Dental",
  "Ortodoncia",
  "Endodoncia",
  "Extracción",
  "Implantes",
  "Blanqueamiento",
  "Emergencia",
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00",
];

export function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);

  // Rol del usuario logueado
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const userRole = user.rol || '';
  const canManageAppointments = ['admin', 'asistente', 'dentista'].includes(userRole);
  const canCancelAppointments = ['admin', 'dentista'].includes(userRole);

  const myDoctorProfile = allDoctors.find(doc => doc.id_usuario === user.id_usuario);
  const myDoctorId = myDoctorProfile?.id_odontologo;

  const canActionAppointment = (appointment: any) => {
    if (userRole === 'admin' || userRole === 'asistente') return true;
    if (userRole === 'dentista') {
      return appointment.id_odontologo === myDoctorId;
    }
    return false;
  };
  const [formData, setFormData] = useState({
    id_paciente: "",
    id_odontologo: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, appointment: null as any, type: 'cancel' as 'cancel'|'reject', reason: '' });

  const filteredAppointments = appointments
    .filter((apt) => apt.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingAppointments = appointments
    .filter((apt) =>
      apt.date >= new Date().toISOString().split('T')[0] &&
      (apt.status === "pendiente" || apt.status === "confirmada")
    )
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 5);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setFormData({ id_paciente: "", id_odontologo: "", date: selectedDate, time: "", type: "", notes: "" });
    setIsDialogOpen(true);
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const [data, patients, doctors] = await Promise.all([
        citasApi.getAll(),
        pacientesApi.getAll(),
        odontologosApi.getAll(),
      ]);
      setAllPatients(patients);
      setAllDoctors(doctors);
      setAppointments(data.map((c: any) => {
        // MySQL devuelve "2026-05-18 09:00:00" (espacio, no T)
        const parts = c.fecha_cita.split(' ');
        const datePart = parts[0]; // "2026-05-18"
        const timePart = parts[1] ? parts[1].substring(0, 5) : '00:00'; // "09:00"
        return {
          id: c.id_cita.toString(),
          patientName: `${c.paciente_nombres} ${c.paciente_apellidos}`,
          date: datePart,
          time: timePart,
          type: c.motivo || 'Consulta',
          status: c.estado_codigo.toLowerCase(),
          rawStatusId: c.id_estado_cita,
          notes: c.notas || '',
          id_paciente: c.id_paciente,
          id_odontologo: c.id_odontologo,
          rawDate: c.fecha_cita
        };
      }));
    } catch (error) {
      console.error("Error al cargar citas", error);
      toast.error("Error al cargar las citas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setFormData({
      id_paciente: appointment.id_paciente?.toString() || "",
      id_odontologo: appointment.id_odontologo?.toString() || "",
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      notes: appointment.notes,
    });
    setIsDialogOpen(true);
  };

  const handleCancelAppointment = (appointment: any) => {
    setCancelModal({ isOpen: true, appointment, type: 'cancel', reason: '' });
  };

  const handleUpdateStatus = async (appointment: any, newStatusId: number, successMsg: string) => {
    try {
      const payload = {
        id_odontologo: appointment.id_odontologo || null,
        id_estado_cita: newStatusId,
        fecha_cita: appointment.rawDate.replace('T', ' ').substring(0, 19),
        motivo: appointment.type,
        notas: appointment.notes
      };
      await citasApi.update(appointment.id, payload);
      toast.success(successMsg);
      fetchAppointments();
    } catch (error) {
      toast.error("Error al actualizar el estado de la cita");
    }
  };

  const handleCompleteAppointment = (appointment: any) => {
    handleUpdateStatus(appointment, 3, "Cita marcada como completada"); // 3 = COMPLETADA
  };

  const handleAcceptAppointment = (appointment: any) => {
    handleUpdateStatus(appointment, 2, "Cita confirmada exitosamente"); // 2 = CONFIRMADA
  };

  const handleRejectAppointment = (appointment: any) => {
    setCancelModal({ 
      isOpen: true, 
      appointment, 
      type: 'reject', 
      reason: 'Lo sentimos, no hay disponibilidad en este horario. Por favor, intente con otra fecha u horario.' 
    });
  };

  const confirmCancelAction = async () => {
    const { appointment, type, reason } = cancelModal;
    if (!appointment) return;
    
    let finalReason = reason;
    if (type === 'reject' && finalReason.trim() === "") finalReason = "Cita rechazada por la clínica.";
    if (type === 'cancel' && finalReason.trim() === "") {
      toast.error("La justificación es obligatoria");
      return;
    }

    try {
      const payload = {
        id_odontologo: appointment.id_odontologo || null,
        id_estado_cita: 4, // 4 = CANCELADA/RECHAZADA
        fecha_cita: appointment.rawDate.replace('T', ' ').substring(0, 19),
        motivo: appointment.type,
        notas: appointment.notes 
          ? `${appointment.notes} | ${type === 'cancel' ? 'Cancelada' : 'Rechazada'}: ${finalReason}` 
          : `${type === 'cancel' ? 'Cancelada' : 'Rechazada'}: ${finalReason}`
      };
      await citasApi.update(appointment.id, payload);
      toast.success(`Cita ${type === 'cancel' ? 'cancelada' : 'rechazada'} exitosamente`);
      setCancelModal({ isOpen: false, appointment: null, type: 'cancel', reason: '' });
      fetchAppointments();
    } catch (error) {
      toast.error(`Error al ${type === 'cancel' ? 'cancelar' : 'rechazar'} la cita`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_paciente || !formData.date || !formData.time || !formData.type) {
      toast.error("Completa los campos requeridos: paciente, fecha, hora y tipo");
      return;
    }
    try {
      // AppointmentsPage solo es accesible por staff (doctor/admin/recepcionista).
      // Toda cita creada aquí sale DIRECTAMENTE como CONFIRMADA (2).
      // El flujo PENDIENTE → CONFIRMADA solo aplica cuando el PACIENTE solicita desde su portal.
      const payload = {
        id_paciente: parseInt(formData.id_paciente),
        id_odontologo: formData.id_odontologo ? parseInt(formData.id_odontologo) : null,
        id_estado_cita: editingAppointment ? editingAppointment.rawStatusId : 2, // 2 = CONFIRMADA
        fecha_cita: `${formData.date} ${formData.time}:00`,
        motivo: formData.type,
        notas: formData.notes || null,
      };
      if (editingAppointment) {
        await citasApi.update(editingAppointment.id, payload);
        toast.success("Cita actualizada correctamente");
      } else {
        await citasApi.create(payload);
        toast.success("Cita agendada y confirmada ✓");
      }
      setIsDialogOpen(false);
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la cita");
    }
  };


  const todayAppointments = appointments.filter(
    (apt) => apt.date === new Date().toISOString().split('T')[0] &&
      (apt.status === "pendiente" || apt.status === "confirmada")
  ).length;

  // Group appointments by date for history view
  const groupedAppointments = appointments
    .filter((apt) => statusFilter === "all" || apt.status === statusFilter)
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
    .reduce((groups, apt) => {
      const date = apt.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(apt);
      return groups;
    }, {} as Record<string, Appointment[]>);

  const getStatusBadge = (appointment: any) => {
    const status = appointment.status;
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let customClass = "";

    if (status === "pendiente") {
      if (appointment.notes?.includes("Derivado por")) {
        variant = "default";
        label = "Derivación";
        customClass = "bg-orange-500 hover:bg-orange-600 text-white border-transparent";
      } else {
        variant = "outline";
        label = "Pendiente";
      }
    } else if (status === "confirmada" || status === "scheduled") {
      variant = "secondary";
      label = "Confirmada";
    } else if (status === "completada" || status === "completed") {
      variant = "default";
      label = "Completada";
    } else if (status === "cancelada") {
      variant = "destructive";
      label = "Cancelada";
      if (appointment.notes?.includes("Cancelada por paciente")) {
        label = "Cancelada (Paciente)";
      } else if (appointment.notes?.includes("Cancelada:")) {
        label = "Cancelada (Clínica)";
      }
    } else if (status === "no_asistio") {
      variant = "destructive";
      label = "No Asistió";
    }

    return <Badge variant={variant} className={customClass}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Calendario de Citas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las citas y agenda de pacientes
          </p>
        </div>
        <Button onClick={handleAddAppointment} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Citas de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Programadas para hoy
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próximas Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              En los próximos días
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Citas Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter((a) => a.status === "completada").length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Total realizadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar and Day View */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agenda del Día</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay citas programadas para esta fecha</p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-blue-50">
                        <div className="text-center">
                          <p className="text-xs text-blue-600 font-medium">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{appointment.patientName}</p>
                          <Badge variant="outline">{appointment.type}</Badge>
                          {getStatusBadge(appointment)}
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {appointment.status === "pendiente" && canManageAppointments && canActionAppointment(appointment) && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcceptAppointment(appointment)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectAppointment(appointment)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Rechazar
                          </Button>
                        </>
                      )}
                      {appointment.status === "confirmada" && canActionAppointment(appointment) && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/dashboard/patients/${appointment.id_paciente}/history`)}
                            className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs px-3"
                          >
                            <Stethoscope className="w-3 h-3 mr-1" />
                            Iniciar Atención
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteAppointment(appointment)}
                            className="text-gray-500 border-gray-300 hover:bg-gray-50 h-8 text-xs"
                            title="Marcar completada sin registro clínico"
                          >
                            ✓
                          </Button>
                        </>
                      )}

                      {canCancelAppointments && canActionAppointment(appointment) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelAppointment(appointment)}
                          className="text-destructive hover:text-destructive"
                          title="Cancelar cita"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 shrink-0">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {new Date(appointment.date + 'T12:00:00').toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                        })}{" "}
                        - {appointment.time}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/dashboard/patients/${appointment.id_paciente}/history`)}
                    className="shrink-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 text-xs"
                  >
                    Ver →
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial Completo de Citas por Día */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial Completo de Citas
            </CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Citas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="confirmada">Confirmadas</SelectItem>
                <SelectItem value="completada">Completadas</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.keys(groupedAppointments).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay citas con este filtro</p>
              </div>
            ) : (
              Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
                <div key={date} className="space-y-3">
                  {/* Date Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 border-t" />
                    <h3 className="text-sm font-medium text-muted-foreground px-3">
                      {new Date(date + 'T12:00:00').toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <div className="flex-1 border-t" />
                  </div>

                  {/* Appointments for this day */}
                  <div className="space-y-2">
                    {dayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-50">
                              <p className="text-sm text-blue-600 font-medium">
                                {appointment.time}
                              </p>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{appointment.patientName}</p>
                                <Badge variant="outline">{appointment.type}</Badge>
                                {getStatusBadge(appointment)}
                              </div>
                              {appointment.notes && (
                                <p className="text-sm text-muted-foreground">
                                  {appointment.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {appointment.status === "pendiente" && canManageAppointments && canActionAppointment(appointment) && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAcceptAppointment(appointment)}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  Aceptar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectAppointment(appointment)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Rechazar
                                </Button>
                              </>
                            )}
                            {appointment.status === "confirmada" && canActionAppointment(appointment) && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/dashboard/patients/${appointment.id_paciente}/history`)}
                                  className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs px-3"
                                >
                                  <Stethoscope className="w-3 h-3 mr-1" />
                                  Iniciar Atención
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCompleteAppointment(appointment)}
                                  className="text-gray-500 border-gray-300 hover:bg-gray-50 h-8 text-xs"
                                  title="Marcar completada sin registro clínico"
                                >
                                  ✓
                                </Button>
                              </>
                            )}

                            {canCancelAppointments && canActionAppointment(appointment) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCancelAppointment(appointment)}
                                className="text-destructive hover:text-destructive"
                                title="Cancelar cita"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? "Editar Cita" : "Nueva Cita"}
            </DialogTitle>
            <DialogDescription>
              {editingAppointment
                ? "Actualiza la información de la cita"
                : "Agenda una nueva cita para el paciente"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="id_paciente">Paciente *</Label>
                <Select value={formData.id_paciente} onValueChange={(v) => setFormData({ ...formData, id_paciente: v })}>
                  <SelectTrigger id="id_paciente">
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPatients.map((p: any) => (
                      <SelectItem key={p.id_paciente} value={p.id_paciente.toString()}>
                        {p.nombres} {p.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_odontologo">Odontólogo (Opcional)</Label>
                <Select value={formData.id_odontologo} onValueChange={(v) => setFormData({ ...formData, id_odontologo: v === "sin" ? "" : v })}>
                  <SelectTrigger id="id_odontologo">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sin">Sin asignar</SelectItem>
                    {allDoctors.map((d: any) => (
                      <SelectItem key={d.id_odontologo} value={d.id_odontologo.toString()}>
                        Dr/a. {d.nombre} {d.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora *</Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Seleccionar hora" />
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
                <Label htmlFor="type">Tipo de Cita *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Información adicional..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingAppointment ? "Actualizar" : "Agendar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel/Reject Modal */}
      <Dialog open={cancelModal.isOpen} onOpenChange={(isOpen) => setCancelModal(prev => ({ ...prev, isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cancelModal.type === 'cancel' ? 'Cancelar Cita' : 'Rechazar Cita'}
            </DialogTitle>
            <DialogDescription>
              {cancelModal.type === 'cancel' 
                ? '¿Por qué se cancela esta cita? (Esta justificación la verá el paciente)'
                : '¿Motivo del rechazo? (El paciente verá este mensaje)'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Justificación / Motivo {cancelModal.type === 'cancel' && '*'}</Label>
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
            <Button variant="destructive" onClick={confirmCancelAction}>
              {cancelModal.type === 'cancel' ? 'Confirmar Cancelación' : 'Confirmar Rechazo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}