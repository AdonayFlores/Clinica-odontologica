import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Pill,
  ClipboardList,
  Plus,
  Download,
  Eye,
  Stethoscope,
  User,
  Phone,
  Mail,
  CalendarDays,
  Trash2,
  Share2,
  Printer,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { insumosApi, consultasApi, citasApi, odontologosApi, pacientesApi, recetasApi, notasApi, medicamentosApi } from "../services/api";
import Odontograma from "../components/Odontograma";

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  dentist: string;
  status: "completed" | "scheduled" | "cancelled";
  diagnosis: string;
  treatment: string;
  notes: string;
}

interface Prescription {
  id: string;
  date: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
}

// Notas Clínicas y Documentos usarán interfaces, pero empezarán vacíos porque no hay API aún
interface ClinicalNote {
  id: string;
  date: string;
  title: string;
  content: string;
  createdBy: string;
  category: "general" | "treatment" | "followup" | "emergency";
}

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  uploadedBy: string;
}

export function PatientHistoryPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [referralSlip, setReferralSlip] = useState<any>(null); // datos del ticket generado
  
  // Real Data states
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const userRole = user.rol || '';
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]); // Combines Citas & Consultas
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<any[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [availableInsumos, setAvailableInsumos] = useState<any[]>([]);
  const [availableOdontologos, setAvailableOdontologos] = useState<any[]>([]);
  const [availableMedicamentos, setAvailableMedicamentos] = useState<any[]>([]);
  const [insumosUtilizados, setInsumosUtilizados] = useState<{ id_insumo: number; nombre: string; cantidad: number }[]>([]);

  // Form states
  const [noteForm, setNoteForm] = useState({ title: "", content: "", category: "general" as ClinicalNote["category"] });
  const [prescriptionForm, setPrescriptionForm] = useState<{
    id_consulta: string;
    indicaciones_generales: string;
    detalles: { id_medicamento: number; nombre: string; dosis: string; frecuencia: string; duracion: string; cantidad_indicada: string; instrucciones: string }[];
  }>({ id_consulta: "", indicaciones_generales: "", detalles: [] });
  const [prescriptionMedItem, setPrescriptionMedItem] = useState({
    id_medicamento: 0, nombre: '', dosis: '', frecuencia: '', duracion: '', cantidad_indicada: '', instrucciones: '',
  });
  const [prescriptionIndicaciones, setPrescriptionIndicaciones] = useState('');
  const [prescriptionConsultaId, setPrescriptionConsultaId] = useState('');
  const [prescriptionItems, setPrescriptionItems] = useState<any[]>([]);
  const [appointmentForm, setAppointmentForm] = useState<{
    date: string;
    time: string;
    type: string;
    dentist: string;
    diagnosis: string;
    treatment: string;
    notes: string;
    status: "scheduled" | "completed" | "cancelled";
    originalCitaId?: number | null;
  }>({ date: "", time: "", type: "", dentist: "", diagnosis: "", treatment: "", notes: "", status: "scheduled" });
  const [documentForm, setDocumentForm] = useState({ name: "", type: "" });
  const [referralForm, setReferralForm] = useState({
    id_odontologo_destino: "",
    especialidad: "",
    motivo: "",
    urgencia: "normal" as "normal" | "urgente" | "muy_urgente",
    observaciones: "",
  });

  // Fetch Real Data
  const fetchData = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      // 1. Paciente
      const patientData = await pacientesApi.getById(patientId);
      setPatient(patientData);

      // 2. Citas (Programadas)
      const allCitas = await citasApi.getAll();
      const patientCitas = allCitas.filter((c: any) =>
        c.id_paciente.toString() === patientId &&
        c.estado_codigo !== 'COMPLETADA' &&
        c.estado_codigo !== 'CANCELADA'
      );
      
      // 3. Consultas (Completadas)
      const patientConsultas = await pacientesApi.getHistorial(patientId);

      // Mapear ambas a un formato unificado para la UI
      const mappedAppointments = [
        ...patientCitas.map((c: any) => ({
          id: `cita-${c.id_cita}`,
          date: c.fecha_cita.split(' ')[0],
          time: c.fecha_cita.split(' ')[1].substring(0,5),
          type: c.motivo,
          dentist: c.odontologo_nombre ? `${c.odontologo_nombre} ${c.odontologo_apellido}` : 'Sin asignar',
          id_odontologo: c.id_odontologo,
          status: 'scheduled',
          diagnosis: '',
          treatment: '',
          notes: c.notes || ''
        })),
        ...patientConsultas.map((c: any) => ({
          id: `consulta-${c.id_consulta}`,
          date: c.fecha_consulta.split(' ')[0],
          time: c.fecha_consulta.split(' ')[1].substring(0,5),
          type: c.motivo_consulta,
          dentist: `${c.odontologo_nombre} ${c.odontologo_apellido}`,
          id_odontologo: c.id_odontologo,
          status: 'completed',
          diagnosis: c.diagnostico,
          treatment: c.tratamiento,
          notes: c.notas || ''
        }))
      ].sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());


      setAppointments(mappedAppointments);

      // 4. Notas clínicas (reales)
      const notas = await notasApi.getByPaciente(patientId);
      setClinicalNotes(notas.map((n: any) => ({
        id: n.id_nota.toString(),
        date: n.fecha_nota.split(' ')[0],
        title: n.titulo,
        content: n.contenido,
        createdBy: `${n.autor_nombre} ${n.autor_apellido}`,
        id_usuario: n.id_usuario,
        category: n.categoria as ClinicalNote['category'],
      })));

      // 5. Recetas del paciente (reales)
      const recetas = await recetasApi.getByPaciente(patientId);
      setPrescriptions(recetas.map((r: any) => ({
        id: r.id_receta.toString(),
        date: r.fecha_receta.split(' ')[0],
        medication: r.detalles_texto || 'Sin detalles de medicamentos',
        dosage: r.motivo_consulta || '-',
        duration: '-',
        instructions: r.indicaciones_generales || 'Seguir indicaciones del médico',
        prescribedBy: `Dr/a. ${r.odontologo_nombre} ${r.odontologo_apellido}`,
      })));

      // 6. Insumos, Odontologos y Medicamentos para formularios
      const insumos = await insumosApi.getAll();
      setAvailableInsumos(insumos.filter((i: any) => i.estado_codigo !== 'DESCONTINUADO'));

      const odontologos = await odontologosApi.getAll();
      setAvailableOdontologos(odontologos);

      const medicamentos = await medicamentosApi.getAll();
      setAvailableMedicamentos(medicamentos.filter((m: any) => m.estado === 'activo'));

    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error("Error al cargar la información del paciente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  if (loading) {
    return <div className="p-8 text-center">Cargando información del paciente...</div>;
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Paciente no encontrado</h2>
          <Button onClick={() => navigate("/dashboard/patients")}>
            Volver a Pacientes
          </Button>
        </div>
      </div>
    );
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    try {
      await notasApi.create({
        id_paciente: patientId,
        titulo: noteForm.title,
        contenido: noteForm.content,
        categoria: noteForm.category,
      });
      // Reload notes from API
      const notas = await notasApi.getByPaciente(patientId);
      setClinicalNotes(notas.map((n: any) => ({
        id: n.id_nota.toString(),
        date: n.fecha_nota.split(' ')[0],
        title: n.titulo,
        content: n.contenido,
        createdBy: `${n.autor_nombre} ${n.autor_apellido}`,
        id_usuario: n.id_usuario,
        category: n.categoria as ClinicalNote['category'],
      })));
      setNoteForm({ title: "", content: "", category: "general" });
      setIsNoteDialogOpen(false);
      toast.success("Nota clínica guardada correctamente");
    } catch (err: any) {
      toast.error(err.message || "Error al guardar la nota");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('¿Eliminar esta nota clínica?')) return;
    try {
      await notasApi.delete(noteId);
      setClinicalNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success('Nota eliminada');
    } catch {
      toast.error('Error al eliminar la nota');
    }
  };

  const handleAddMedToReceta = () => {
    if (!prescriptionMedItem.nombre || !prescriptionMedItem.dosis || !prescriptionMedItem.frecuencia || !prescriptionMedItem.duracion) {
      toast.error('Completa todos los campos del medicamento');
      return;
    }
    setPrescriptionItems(prev => [...prev, { ...prescriptionMedItem }]);
    setPrescriptionMedItem({ id_medicamento: 0, nombre: '', dosis: '', frecuencia: '', duracion: '', cantidad_indicada: '1', instrucciones: '' });
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prescriptionItems.length === 0) {
      toast.error('Agrega al menos un medicamento a la receta');
      return;
    }
    if (!prescriptionConsultaId) {
      toast.error('Selecciona la consulta de referencia');
      return;
    }
    try {
      await recetasApi.create({
        id_consulta: prescriptionConsultaId,
        indicaciones_generales: prescriptionIndicaciones,
        detalles: prescriptionItems.map(item => ({
          id_medicamento: item.id_medicamento,
          dosis: item.dosis,
          frecuencia: item.frecuencia,
          duracion: item.duracion,
          cantidad_indicada: item.cantidad_indicada || '1',
          instrucciones: item.instrucciones || '',
        })),
      });
      // Reload recetas
      const recetas = await recetasApi.getByPaciente(patientId!);
      setPrescriptions(recetas.map((r: any) => ({
        id: r.id_receta.toString(),
        date: r.fecha_receta.split(' ')[0],
        medication: r.detalles_texto || 'Sin detalles de medicamentos',
        dosage: r.motivo_consulta || '-',
        duration: '-',
        instructions: r.indicaciones_generales || 'Seguir indicaciones del médico',
        prescribedBy: `Dr/a. ${r.odontologo_nombre} ${r.odontologo_apellido}`,
      })));
      setPrescriptionItems([]);
      setPrescriptionIndicaciones('');
      setPrescriptionConsultaId('');
      setIsPrescriptionDialogOpen(false);
      toast.success('Receta guardada correctamente en la base de datos');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar la receta');
    }
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId) return;

    try {
      if (appointmentForm.status === 'completed') {
        // Es una Consulta Clínica ya terminada
        await consultasApi.create({
          id_paciente: patientId,
          id_odontologo: appointmentForm.dentist,
          fecha_consulta: `${appointmentForm.date} ${appointmentForm.time}:00`,
          motivo_consulta: appointmentForm.type,
          diagnostico: appointmentForm.diagnosis || 'No especificado',
          tratamiento: appointmentForm.treatment || 'No especificado',
          notas: appointmentForm.notes,
          insumos_utilizados: insumosUtilizados
        });
        
        // Si proviene de una cita programada, actualizar su estado a completada
        if (appointmentForm.originalCitaId) {
          await citasApi.update(appointmentForm.originalCitaId, {
            id_odontologo: appointmentForm.dentist,
            id_estado_cita: 3, // 3 = COMPLETADA
            fecha_cita: `${appointmentForm.date} ${appointmentForm.time}:00`,
            motivo: appointmentForm.type,
            notas: appointmentForm.notes
          });
        }
        
        toast.success("Consulta guardada y descargo de inventario realizado con éxito");
      } else {
        // Es una Cita programada
        if (appointmentForm.originalCitaId) {
          // Si estamos actualizando una cita existente a otro estado programado o cancelada
          await citasApi.update(appointmentForm.originalCitaId, {
            id_odontologo: appointmentForm.dentist,
            id_estado_cita: appointmentForm.status === 'scheduled' ? 1 : (appointmentForm.status === 'cancelled' ? 4 : 1),
            fecha_cita: `${appointmentForm.date} ${appointmentForm.time}:00`,
            motivo: appointmentForm.type,
            notas: appointmentForm.notes
          });
          toast.success("Cita actualizada con éxito");
        } else {
          // Nueva cita programada — el staff siempre crea CONFIRMADA (2) directamente
          await citasApi.create({
            id_paciente: patientId,
            id_odontologo: appointmentForm.dentist,
            id_estado_cita: appointmentForm.status === 'cancelled' ? 4 : 2, // staff → CONFIRMADA
            fecha_cita: `${appointmentForm.date} ${appointmentForm.time}:00`,
            motivo: appointmentForm.type,
            notas: appointmentForm.notes
          });
          toast.success("Cita agendada y confirmada con éxito");
        }
      }

      // Refrescar datos
      await fetchData();

      setAppointmentForm({
        date: "",
        time: "",
        type: "",
        dentist: "",
        diagnosis: "",
        treatment: "",
        notes: "",
        status: "scheduled",
        originalCitaId: null
      });
      setInsumosUtilizados([]);
      setIsAppointmentDialogOpen(false);

    } catch (error: any) {
      toast.error(error.message || "Error al guardar en la API real");
    }
  };

  const handleStartAppointment = (apt: Appointment) => {
    const dentistId = availableOdontologos.find(
      (o: any) => `${o.nombre} ${o.apellido}` === apt.dentist
    )?.id_odontologo.toString() || "";

    setAppointmentForm({
      date: apt.date,
      time: apt.time,
      type: apt.type,
      dentist: dentistId,
      diagnosis: "",
      treatment: "",
      notes: apt.notes,
      status: "completed",
      originalCitaId: parseInt(apt.id.replace('cita-', ''))
    });
    setInsumosUtilizados([]);
    setIsAppointmentDialogOpen(true);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const newDocument: Document = {
      id: (documents.length + 1).toString(),
      name: documentForm.name,
      type: documentForm.type,
      date: new Date().toISOString().split("T")[0],
      size: "0 KB", // Placeholder size
      uploadedBy: "Usuario Actual",
    };
    setDocuments([newDocument, ...documents]);
    setDocumentForm({ name: "", type: "" });
    setIsDocumentDialogOpen(false);
    toast.success("Archivo agregado correctamente");
  };

  // ──────────────────────────────────────────────────
  // DERIVACIÓN A ESPECIALISTA
  // ──────────────────────────────────────────────────
  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !referralForm.id_odontologo_destino || !referralForm.motivo) {
      toast.error('Completa: doctor destino y motivo de derivación');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const doctorOrigen = `${userData.nombre || ''} ${userData.apellido || ''}`.trim() || 'Doctor';
    const doctorDestino = availableOdontologos.find(
      (o: any) => o.id_odontologo.toString() === referralForm.id_odontologo_destino
    );
    const urgenciaLabel = { normal: 'Normal', urgente: 'Urgente', muy_urgente: 'Muy Urgente' }[referralForm.urgencia];

    try {
      // 1. Crear nota clínica estructurada de derivación
      const contenidoNota = [
        `DERIVACIÓN A ESPECIALISTA`,
        `──────────────────────────`,
        `Doctor Referente: Dr/a. ${doctorOrigen}`,
        `Doctor Destino: Dr/a. ${doctorDestino?.nombre} ${doctorDestino?.apellido}${
          referralForm.especialidad ? ` (${referralForm.especialidad})` : ''
        }`,
        `Urgencia: ${urgenciaLabel}`,
        ``,
        `Motivo de Derivación:`,
        referralForm.motivo,
        referralForm.observaciones ? `\nObservaciones Clínicas:\n${referralForm.observaciones}` : '',
      ].filter(Boolean).join('\n');

      await notasApi.create({
        id_paciente: patientId,
        titulo: `Derivación a Dr/a. ${doctorDestino?.nombre} ${doctorDestino?.apellido}`,
        contenido: contenidoNota,
        categoria: 'followup',
      });

      // 2. Crear cita pendiente con el doctor destino
      const fechaProxima = new Date();
      fechaProxima.setDate(fechaProxima.getDate() + 7); // +7 días por defecto
      const fechaStr = fechaProxima.toISOString().split('T')[0];

      await citasApi.create({
        id_paciente: patientId,
        id_odontologo: parseInt(referralForm.id_odontologo_destino),
        id_estado_cita: 1, // PENDIENTE — recepcionista confirma fecha real
        fecha_cita: `${fechaStr} 09:00:00`,
        motivo: referralForm.especialidad || referralForm.motivo.substring(0, 60),
        notas: `Derivado por Dr/a. ${doctorOrigen}. Motivo: ${referralForm.motivo}`,
      });

      // 3. Guardar datos del ticket para mostrar/imprimir
      setReferralSlip({
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
        paciente: `${patient?.nombres} ${patient?.apellidos}`,
        doctorOrigen,
        doctorDestino: `${doctorDestino?.nombre} ${doctorDestino?.apellido}`,
        especialidad: referralForm.especialidad,
        motivo: referralForm.motivo,
        urgencia: urgenciaLabel,
        observaciones: referralForm.observaciones,
      });

      toast.success('Derivación creada — cita pendiente agendada con el especialista');

      // Refrescar datos
      await fetchData();

      // Resetear form pero NO cerrar — mostramos el ticket
      setReferralForm({ id_odontologo_destino: '', especialidad: '', motivo: '', urgencia: 'normal', observaciones: '' });

    } catch (err: any) {
      toast.error(err.message || 'Error al crear la derivación');
    }
  };

  const handlePrintReferral = () => {
    window.print();
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      general: { variant: "secondary", label: "General" },
      treatment: { variant: "default", label: "Tratamiento" },
      followup: { variant: "outline", label: "Seguimiento" },
      emergency: { variant: "destructive", label: "Emergencia" },
    };
    const config = variants[category] || variants.general;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      completed: { variant: "default", label: "Completada" },
      scheduled: { variant: "secondary", label: "Programada" },
      cancelled: { variant: "destructive", label: "Cancelada" },
    };
    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const completedAppointments = appointments.filter((a) => a.status === "completed");
  const scheduledAppointments = appointments.filter((a) => a.status === "scheduled");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/patients")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl tracking-tight">Historial Clínico</h1>
          <p className="text-muted-foreground mt-1">
            Información médica completa del paciente
          </p>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
              <p className="font-medium text-lg">{patient.nombres} {patient.apellidos}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Edad</p>
              <p className="font-medium">
                {patient.fecha_nacimiento 
                  ? new Date().getFullYear() - new Date(patient.fecha_nacimiento).getFullYear()
                  : 'N/A'} años
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tipo de Sangre</p>
              <p className="font-medium">{patient.tipo_sangre || 'No especificado'}</p>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                <p className="font-medium">{patient.telefono || 'No especificado'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{patient.correo || patient.correo_usuario || 'No especificado'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Alergias</p>
              <Badge variant={patient.alergias && patient.alergias !== 'Ninguna' ? 'destructive' : 'secondary'} className="mt-1">
                {patient.alergias || 'Ninguna'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Contacto de Emergencia</p>
              <p className="font-medium">
                {patient.contacto_emergencia_nombre ? `${patient.contacto_emergencia_nombre} - ${patient.contacto_emergencia_telefono}` : 'No especificado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Citas</span>
          </TabsTrigger>
          <TabsTrigger value="odontograma" className="flex items-center gap-2">
            <span className="text-base leading-none">🦷</span>
            <span className="hidden sm:inline">Odontograma</span>
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Recetas</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Notas</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Archivos</span>
          </TabsTrigger>
        </TabsList>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => { setReferralSlip(null); setIsReferralDialogOpen(true); }}
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Derivar a Especialista
            </Button>
            <Button
              onClick={() => setIsAppointmentDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </div>

          {/* Scheduled Appointments */}
          {scheduledAppointments.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  Citas Programadas ({scheduledAppointments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{apt.type}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Dr. {apt.dentist}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(apt.status)}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                            onClick={() => handleStartAppointment(apt)}
                          >
                            <Stethoscope className="w-3 h-3 mr-1" />
                            Comenzar Cita
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(apt.date + 'T12:00:00').toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Stethoscope className="h-4 w-4" />
                          {apt.time}
                        </div>
                      </div>
                      {apt.notes && (
                        <p className="text-sm mt-3 p-2 bg-muted/50 rounded">
                          <strong>Notas:</strong> {apt.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Appointments */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Historial de Citas ({completedAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedAppointments.map((apt, index) => (
                  <div
                    key={apt.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors relative"
                  >
                    {/* Timeline dot */}
                    {index < completedAppointments.length - 1 && (
                      <div className="absolute left-4 top-16 bottom-0 w-px bg-border" />
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-600 mt-2 relative z-10" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{apt.type}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {apt.dentist}
                            </p>
                          </div>
                          {getStatusBadge(apt.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(apt.date + 'T12:00:00').toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Stethoscope className="h-4 w-4" />
                            {apt.time}
                          </div>
                        </div>
                        {apt.diagnosis && (
                          <div className="mb-2">
                            <p className="text-sm font-medium mb-1">Diagnóstico:</p>
                            <p className="text-sm text-muted-foreground">{apt.diagnosis}</p>
                          </div>
                        )}
                        {apt.treatment && (
                          <div className="mb-2">
                            <p className="text-sm font-medium mb-1">Tratamiento:</p>
                            <p className="text-sm text-muted-foreground">{apt.treatment}</p>
                          </div>
                        )}
                        {apt.notes && (
                          <div className="mt-2 p-3 bg-muted/50 rounded-md">
                            <p className="text-sm">
                              <strong>Observaciones:</strong> {apt.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab - preceded by Odontograma Tab */}
        <TabsContent value="odontograma" className="space-y-4">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <Odontograma patientId={patientId!} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsPrescriptionDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Receta
            </Button>
          </div>

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Medicamento</TableHead>
                    <TableHead>Dosificación</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Prescrito por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No hay recetas registradas.
                      </TableCell>
                    </TableRow>
                  ) : prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>
                        {new Date(prescription.date + 'T12:00:00').toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {prescription.medication}
                      </TableCell>
                      <TableCell>{prescription.dosage}</TableCell>
                      <TableCell>{prescription.duration}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {prescription.prescribedBy}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsNoteDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Nota
            </Button>
          </div>

          <div className="grid gap-4">
            {clinicalNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-lg bg-card">
                No hay notas clínicas registradas.
              </div>
            ) : clinicalNotes.map((note) => (
              <Card key={note.id} className="shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {note.createdBy} •{" "}
                        {new Date(note.date + 'T12:00:00').toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(note.category)}
                      {(userRole === 'admin' || note.id_usuario === user.id_usuario) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsDocumentDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Archivo
            </Button>
          </div>

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Subido por</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay archivos registrados.
                      </TableCell>
                    </TableRow>
                  ) : documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(doc.date).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.size}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.uploadedBy}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Clinical Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Nota Clínica</DialogTitle>
            <DialogDescription>
              Registra observaciones importantes sobre el paciente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddNote}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={noteForm.title}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, title: e.target.value })
                  }
                  placeholder="Ej: Evaluación post-tratamiento"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={noteForm.category}
                  onValueChange={(value) =>
                    setNoteForm({
                      ...noteForm,
                      category: value as ClinicalNote["category"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="treatment">Tratamiento</SelectItem>
                    <SelectItem value="followup">Seguimiento</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={noteForm.content}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, content: e.target.value })
                  }
                  placeholder="Describe las observaciones clínicas..."
                  rows={5}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNoteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Guardar Nota
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Prescription Dialog */}
      <Dialog
        open={isPrescriptionDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPrescriptionItems([]);
            setPrescriptionIndicaciones('');
            setPrescriptionConsultaId('');
          }
          setIsPrescriptionDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Receta Médica</DialogTitle>
            <DialogDescription>
              Selecciona la consulta de referencia y agrega los medicamentos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPrescription}>
            <div className="space-y-4 py-4">

              {/* Consulta de referencia */}
              <div className="space-y-2">
                <Label>Consulta de Referencia <span className="text-red-500">*</span></Label>
                <Select value={prescriptionConsultaId} onValueChange={setPrescriptionConsultaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar consulta" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointments
                      .filter((a: any) => {
                        const isCompletedConsulta = a.status === 'completed' && a.id.startsWith('consulta-');
                        if (!isCompletedConsulta) return false;
                        if (userRole === 'dentista') {
                          const myDoctorProfile = availableOdontologos.find(doc => doc.id_usuario === user.id_usuario);
                          const myDoctorId = myDoctorProfile?.id_odontologo;
                          return a.id_odontologo === myDoctorId;
                        }
                        return true;
                      })
                      .map((a: any) => (
                        <SelectItem key={a.id} value={a.id.replace('consulta-', '')}>
                          {a.date} — {a.type}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Indicaciones generales */}
              <div className="space-y-2">
                <Label>Indicaciones Generales</Label>
                <Textarea
                  value={prescriptionIndicaciones}
                  onChange={(e) => setPrescriptionIndicaciones(e.target.value)}
                  placeholder="Ej: Tomar con alimentos, completar el tratamiento..."
                  rows={2}
                />
              </div>

              {/* Añadir medicamento */}
              <div className="p-3 rounded-lg border bg-muted/30 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Agregar Medicamento</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Medicamento</Label>
                    <Input
                      value={prescriptionMedItem.nombre}
                      onChange={(e) => setPrescriptionMedItem(prev => ({ ...prev, id_medicamento: 0, nombre: e.target.value }))}
                      placeholder="Escribe el nombre del medicamento libremente..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Dosis</Label>
                    <Input
                      value={prescriptionMedItem.dosis}
                      onChange={(e) => setPrescriptionMedItem(p => ({ ...p, dosis: e.target.value }))}
                      placeholder="Ej: 500mg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Frecuencia</Label>
                    <Input
                      value={prescriptionMedItem.frecuencia}
                      onChange={(e) => setPrescriptionMedItem(p => ({ ...p, frecuencia: e.target.value }))}
                      placeholder="Ej: Cada 8 horas"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Duración</Label>
                    <Input
                      value={prescriptionMedItem.duracion}
                      onChange={(e) => setPrescriptionMedItem(p => ({ ...p, duracion: e.target.value }))}
                      placeholder="Ej: 7 días"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cantidad</Label>
                    <Input
                      value={prescriptionMedItem.cantidad_indicada}
                      onChange={(e) => setPrescriptionMedItem(p => ({ ...p, cantidad_indicada: e.target.value }))}
                      placeholder="Ej: 21"
                    />
                  </div>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={handleAddMedToReceta} className="w-full">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Agregar a la receta
                </Button>
              </div>

              {/* Lista de medicamentos en la receta */}
              {prescriptionItems.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Medicamentos en esta receta:</p>
                  {prescriptionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-sm">
                      <div>
                        <span className="font-medium">{item.nombre}</span>
                        <span className="text-muted-foreground ml-2">{item.dosis} — {item.frecuencia} — {item.duracion}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => setPrescriptionItems(prev => prev.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPrescriptionItems([]);
                  setPrescriptionIndicaciones('');
                  setPrescriptionConsultaId('');
                  setIsPrescriptionDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={prescriptionItems.length === 0}>
                Guardar Receta ({prescriptionItems.length} medicamento{prescriptionItems.length !== 1 ? 's' : ''})
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Appointment Dialog */}
      <Dialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Cita</DialogTitle>
            <DialogDescription>
              Programa una nueva cita para el paciente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAppointment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) =>
                      setAppointmentForm({
                        ...appointmentForm,
                        time: e.target.value,
                      })
                    }
                    required
                    className="block w-full [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="type">Tipo de Cita</Label>
                <Input
                  id="type"
                  value={appointmentForm.type}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      type: e.target.value,
                    })
                  }
                  placeholder="Ej: Consulta General"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="dentist">Dentista Asignado</Label>
                <Select
                  value={appointmentForm.dentist}
                  onValueChange={(val) =>
                    setAppointmentForm({ ...appointmentForm, dentist: val })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar odontólogo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOdontologos.map((o: any) => (
                      <SelectItem key={o.id_odontologo} value={o.id_odontologo.toString()}>
                        {o.nombre} {o.apellido} - {o.especialidad || 'General'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={appointmentForm.status}
                  onValueChange={(value) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      status: value as Appointment["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Programada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {appointmentForm.status === "completed" && (
                <>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="diagnosis">Diagnóstico</Label>
                    <Textarea
                      id="diagnosis"
                      value={appointmentForm.diagnosis}
                      onChange={(e) =>
                        setAppointmentForm({
                          ...appointmentForm,
                          diagnosis: e.target.value,
                        })
                      }
                      placeholder="Ej: 1. Caries en molar superior derecho&#10;2. Gingivitis leve"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="treatment">Tratamiento</Label>
                    <Textarea
                      id="treatment"
                      value={appointmentForm.treatment}
                      onChange={(e) =>
                        setAppointmentForm({
                          ...appointmentForm,
                          treatment: e.target.value,
                        })
                      }
                      placeholder="Ej: 1. Resina compuesta&#10;2. Profilaxis"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={appointmentForm.notes}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Describe las notas adicionales..."
                  rows={2}
                />
              </div>

              {appointmentForm.status === "completed" && (
                <div className="space-y-3 pt-4 border-t md:col-span-2">
                  <Label>Insumos Utilizados (Descargo Automático)</Label>
                  <Select
                    onValueChange={(val) => {
                      const insumo = availableInsumos.find(i => i.id_insumo.toString() === val);
                      if (insumo && !insumosUtilizados.find(iu => iu.id_insumo === insumo.id_insumo)) {
                        setInsumosUtilizados([...insumosUtilizados, { id_insumo: insumo.id_insumo, nombre: insumo.nombre, cantidad: 1 }]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar insumo para descontar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInsumos.map(ins => (
                        <SelectItem key={ins.id_insumo} value={ins.id_insumo.toString()}>{ins.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {insumosUtilizados.length > 0 && (
                    <div className="space-y-2 mt-2 bg-muted/30 p-3 rounded-md">
                      {insumosUtilizados.map((iu, index) => (
                        <div key={iu.id_insumo} className="flex items-center gap-2">
                          <span className="flex-1 text-sm font-medium">{iu.nombre}</span>
                          <Input 
                            type="number" 
                            min="1" 
                            value={iu.cantidad} 
                            className="w-20 h-8"
                            onChange={(e) => {
                              const newArr = [...insumosUtilizados];
                              newArr[index].cantidad = parseInt(e.target.value) || 1;
                              setInsumosUtilizados(newArr);
                            }}
                          />
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => setInsumosUtilizados(insumosUtilizados.filter(i => i.id_insumo !== iu.id_insumo))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                Guardar Cita
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog
        open={isDocumentDialogOpen}
        onOpenChange={setIsDocumentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Archivo</DialogTitle>
            <DialogDescription>
              Sube un nuevo archivo para el paciente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDocument}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Archivo</Label>
                <Input
                  id="name"
                  value={documentForm.name}
                  onChange={(e) =>
                    setDocumentForm({
                      ...documentForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ej: Radiografía Panorámica"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Archivo</Label>
                <Select
                  value={documentForm.type}
                  onValueChange={(value) =>
                    setDocumentForm({
                      ...documentForm,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Imagen">Imagen</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDocumentDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Guardar Archivo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────── */}
      {/* DIALOG: DERIVACIÓN A ESPECIALISTA              */}
      {/* ─────────────────────────────────────────────── */}
      <Dialog open={isReferralDialogOpen} onOpenChange={(open) => { setIsReferralDialogOpen(open); if (!open) setReferralSlip(null); }}>
        <DialogContent className="max-w-lg">
          {!referralSlip ? (
            // ── FORMULARIO DE DERIVACIÓN ──
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-amber-500" />
                  Derivar a Especialista
                </DialogTitle>
                <DialogDescription>
                  Crea una derivación formal con nota clínica y cita pendiente para el especialista.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateReferral}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Doctor Destino *</Label>
                    <Select
                      value={referralForm.id_odontologo_destino}
                      onValueChange={(v) => setReferralForm({ ...referralForm, id_odontologo_destino: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especialista" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOdontologos.map((o: any) => (
                          <SelectItem key={o.id_odontologo} value={o.id_odontologo.toString()}>
                            Dr/a. {o.nombre} {o.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Especialidad / Tipo de Atención</Label>
                    <Input
                      placeholder="Ej: Ortodoncia, Endodoncia, Cirugía..."
                      value={referralForm.especialidad}
                      onChange={(e) => setReferralForm({ ...referralForm, especialidad: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Motivo de Derivación *</Label>
                    <Textarea
                      placeholder="Describe el motivo clínico de la derivación..."
                      value={referralForm.motivo}
                      onChange={(e) => setReferralForm({ ...referralForm, motivo: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Urgencia</Label>
                    <Select
                      value={referralForm.urgencia}
                      onValueChange={(v: any) => setReferralForm({ ...referralForm, urgencia: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">🟢 Normal</SelectItem>
                        <SelectItem value="urgente">🟡 Urgente</SelectItem>
                        <SelectItem value="muy_urgente">🔴 Muy Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Observaciones Clínicas (opcional)</Label>
                    <Textarea
                      placeholder="Hallazgos relevantes, antecedentes, indicaciones para el especialista..."
                      value={referralForm.observaciones}
                      onChange={(e) => setReferralForm({ ...referralForm, observaciones: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsReferralDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Share2 className="h-4 w-4 mr-2" />
                    Crear Derivación
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            // ── TICKET DE DERIVACIÓN (post-creación) ──
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-700">
                  ✅ Derivación Creada
                </DialogTitle>
                <DialogDescription>
                  Se creó la nota clínica y la cita pendiente con el especialista. Puedes imprimir el ticket.
                </DialogDescription>
              </DialogHeader>

              {/* Ticket imprimible */}
              <div id="referral-ticket" className="border-2 border-dashed border-gray-300 rounded-lg p-6 my-4 print:border-solid print:border-black">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold">🦷 Clínica Odontológica</h2>
                  <p className="text-sm text-muted-foreground">Nota de Derivación a Especialista</p>
                  <p className="text-xs text-muted-foreground mt-1">{referralSlip.fecha}</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">Paciente</p>
                      <p className="font-semibold">{referralSlip.paciente}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">Urgencia</p>
                      <p className="font-semibold">
                        {referralSlip.urgencia === 'Normal' ? '🟢' : referralSlip.urgencia === 'Urgente' ? '🟡' : '🔴'} {referralSlip.urgencia}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">Referente</p>
                      <p>Dr/a. {referralSlip.doctorOrigen}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">Especialista</p>
                      <p className="font-semibold">Dr/a. {referralSlip.doctorDestino}</p>
                      {referralSlip.especialidad && <p className="text-xs text-muted-foreground">{referralSlip.especialidad}</p>}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Motivo de Derivación</p>
                    <p className="text-sm">{referralSlip.motivo}</p>
                  </div>
                  {referralSlip.observaciones && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Observaciones Clínicas</p>
                      <p className="text-sm">{referralSlip.observaciones}</p>
                    </div>
                  )}
                  <div className="pt-3 border-t text-center">
                    <p className="text-xs text-muted-foreground">Se ha agendado una cita preliminar con el especialista.</p>
                    <p className="text-xs text-muted-foreground">Confirme fecha y hora con recepción.</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => { setIsReferralDialogOpen(false); setReferralSlip(null); }}>
                  Cerrar
                </Button>
                <Button onClick={handlePrintReferral} className="bg-gray-700 hover:bg-gray-800">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Ticket
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CSS solo para impresión del ticket */}
      <style>{`
        @media print {
          body > *:not(#referral-print-root) { display: none !important; }
          #referral-ticket { display: block !important; border: 2px solid black !important; }
          [role="dialog"] > * { display: none; }
          [role="dialog"] #referral-ticket { display: block !important; }
        }
      `}</style>
    </div>
  );
}