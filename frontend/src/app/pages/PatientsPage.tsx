import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Search, Plus, Edit, Trash2, Phone, Mail, FileText, Loader2, KeyRound, Copy } from "lucide-react";
import { toast } from "sonner";
import { pacientesApi } from "../services/api";

interface Paciente {
  id_paciente: number;
  id_usuario: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  sexo: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  contacto_emergencia_nombre?: string;
  contacto_emergencia_telefono?: string;
  fecha_registro: string;
}


const emptyForm = {
  nombres: "",
  apellidos: "",
  documento_identidad: "",
  fecha_nacimiento: "",
  sexo: "",
  tipo_sangre: "",
  alergias: "",
  telefono: "",
  correo: "",
  direccion: "",
  contacto_emergencia_nombre: "",
  contacto_emergencia_telefono: "",
};

export function PatientsPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  // Estado para crear acceso al sistema
  const [accesoDialog, setAccesoDialog] = useState<{ open: boolean; paciente: Paciente | null }>({ open: false, paciente: null });
  const [accesoForm, setAccesoForm] = useState({ correo: "", password: "", confirmPassword: "" });
  const [savingAcceso, setSavingAcceso] = useState(false);
  const [createdPass, setCreatedPass] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const pacs = await pacientesApi.getAll();
      setPacientes(pacs);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al cargar pacientes";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPacientes = pacientes.filter((p) =>
    `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.correo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.telefono || "").includes(searchTerm)
  );

  const handleAdd = () => {
    setEditingPaciente(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleEdit = (paciente: Paciente) => {
    setEditingPaciente(paciente);
    setFormData({
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      documento_identidad: (paciente as any).documento_identidad || "",
      fecha_nacimiento: paciente.fecha_nacimiento?.split("T")[0] || "",
      sexo: paciente.sexo,
      tipo_sangre: (paciente as any).tipo_sangre || "",
      alergias: (paciente as any).alergias || "",
      telefono: paciente.telefono || "",
      correo: paciente.correo || "",
      direccion: paciente.direccion || "",
      contacto_emergencia_nombre: paciente.contacto_emergencia_nombre || "",
      contacto_emergencia_telefono: paciente.contacto_emergencia_telefono || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este paciente?")) return;
    try {
      await pacientesApi.delete(id);
      setPacientes((prev) => prev.filter((p) => p.id_paciente !== id));
      toast.success("Paciente eliminado correctamente");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al eliminar";
      toast.error(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPaciente) {
        const updated = await pacientesApi.update(editingPaciente.id_paciente, {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          documento_identidad: formData.documento_identidad || null,
          fecha_nacimiento: formData.fecha_nacimiento,
          sexo: formData.sexo,
          tipo_sangre: formData.tipo_sangre || null,
          alergias: formData.alergias || null,
          telefono: formData.telefono || null,
          correo: formData.correo || null,
          direccion: formData.direccion || null,
          contacto_emergencia_nombre: formData.contacto_emergencia_nombre || null,
          contacto_emergencia_telefono: formData.contacto_emergencia_telefono || null,
        });
        setPacientes((prev) =>
          prev.map((p) => (p.id_paciente === editingPaciente.id_paciente ? updated : p))
        );
        toast.success("Paciente actualizado correctamente");
      } else {
        const created = await pacientesApi.create({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          documento_identidad: formData.documento_identidad || null,
          fecha_nacimiento: formData.fecha_nacimiento,
          sexo: formData.sexo,
          tipo_sangre: formData.tipo_sangre || null,
          alergias: formData.alergias || null,
          telefono: formData.telefono || null,
          correo: formData.correo || null,
          direccion: formData.direccion || null,
          contacto_emergencia_nombre: formData.contacto_emergencia_nombre || null,
          contacto_emergencia_telefono: formData.contacto_emergencia_telefono || null,
        });
        setPacientes((prev) => [created, ...prev]);
        toast.success("Paciente registrado correctamente");
      }
      setIsDialogOpen(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al guardar";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Handler para crear acceso al sistema de un paciente existente
  const handleCrearAcceso = (paciente: Paciente) => {
    setAccesoForm({ correo: paciente.correo || "", password: "", confirmPassword: "" });
    setAccesoDialog({ open: true, paciente });
  };

  const handleSubmitAcceso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accesoForm.password) {
      if (accesoForm.password !== accesoForm.confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      if (accesoForm.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }
    }
    setSavingAcceso(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://192.168.0.27:3001/api"}/pacientes/${accesoDialog.paciente!.id_paciente}/crear-acceso`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ correo: accesoForm.correo, password: accesoForm.password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Acceso creado para ${accesoDialog.paciente!.nombres}`);
      setAccesoDialog({ open: false, paciente: null });
      loadData(); // recargar para actualizar el ícono
      if (data && data.passwordTemp) {
        setCreatedPass(data.passwordTemp);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al crear acceso");
    } finally {
      setSavingAcceso(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Gestión de Pacientes</h1>
          <p className="text-muted-foreground mt-1">
            Administra la información de tus pacientes
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-muted-foreground">Cargando pacientes...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha Nacimiento</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {searchTerm ? "No se encontraron pacientes con ese criterio" : "No hay pacientes registrados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPacientes.map((paciente) => (
                    <TableRow key={paciente.id_paciente}>
                      <TableCell className="font-medium">
                        {paciente.nombres} {paciente.apellidos}
                      </TableCell>
                      <TableCell>
                        {paciente.fecha_nacimiento
                          ? new Date(paciente.fecha_nacimiento).toLocaleDateString("es-ES")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{paciente.sexo}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {paciente.telefono && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {paciente.telefono}
                            </div>
                          )}
                          {paciente.correo && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {paciente.correo}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(paciente.fecha_registro).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/patients/${paciente.id_paciente}/history`)}
                            title="Ver Historial Clínico"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(paciente)}
                            title="Editar Paciente"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(paciente.id_paciente)}
                            className="text-destructive hover:text-destructive"
                            title="Eliminar Paciente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {!paciente.id_usuario && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCrearAcceso(paciente)}
                              title="Crear acceso al portal del paciente"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Agregar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPaciente ? "Editar Paciente" : "Nuevo Paciente"}
            </DialogTitle>
            <DialogDescription>
              {editingPaciente
                ? "Actualiza la información del paciente"
                : "Ingresa los datos del nuevo paciente"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Fila 1: Nombres y Apellidos */}
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input id="nombres" value={formData.nombres} onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input id="apellidos" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} required />
              </div>

              {/* Fila 2: DUI y Fecha Nacimiento */}
              <div className="space-y-2">
                <Label htmlFor="dui">DUI / Documento de Identidad</Label>
                <Input
                  id="dui"
                  value={(formData as any).documento_identidad}
                  onChange={(e) => setFormData({ ...formData, documento_identidad: e.target.value } as any)}
                  placeholder="Ej: 00000000-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input id="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })} required />
              </div>

              {/* Fila 3: Sexo y Tipo de Sangre */}
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo *</Label>
                <select
                  id="sexo"
                  value={formData.sexo}
                  onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_sangre">Tipo de Sangre</Label>
                <select
                  id="tipo_sangre"
                  value={(formData as any).tipo_sangre}
                  onChange={(e) => setFormData({ ...formData, tipo_sangre: e.target.value } as any)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="">No especificado</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Fila 4: Teléfono y Correo */}
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo</Label>
                <Input id="correo" type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} />
              </div>

              {/* Alergias - ancho completo */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="alergias">Alergias conocidas</Label>
                <Input
                  id="alergias"
                  value={(formData as any).alergias}
                  onChange={(e) => setFormData({ ...formData, alergias: e.target.value } as any)}
                  placeholder="Ej: Penicilina, Latex, Ninguna"
                />
              </div>

              {/* Dirección - ancho completo */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
              </div>

              {/* Contacto de emergencia */}
              <div className="space-y-2">
                <Label htmlFor="contacto_emergencia_nombre">Contacto de Emergencia</Label>
                <Input id="contacto_emergencia_nombre" value={formData.contacto_emergencia_nombre} onChange={(e) => setFormData({ ...formData, contacto_emergencia_nombre: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto_emergencia_telefono">Teléfono Emergencia</Label>
                <Input id="contacto_emergencia_telefono" type="tel" value={formData.contacto_emergencia_telefono} onChange={(e) => setFormData({ ...formData, contacto_emergencia_telefono: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingPaciente ? "Actualizar" : "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Crear Acceso al Sistema */}
      <Dialog open={accesoDialog.open} onOpenChange={(open) => setAccesoDialog({ open, paciente: accesoDialog.paciente })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600" />
              Crear Acceso al Portal
            </DialogTitle>
            <DialogDescription>
              Crea las credenciales de acceso para{" "}
              <strong>{accesoDialog.paciente?.nombres} {accesoDialog.paciente?.apellidos}</strong>.
              El paciente podrá iniciar sesión en el portal con estos datos.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAcceso}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="acceso-correo">Correo electrónico *</Label>
                <Input
                  id="acceso-correo"
                  type="email"
                  value={accesoForm.correo}
                  onChange={(e) => setAccesoForm({ ...accesoForm, correo: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acceso-password">Contraseña (Opcional)</Label>
                <Input
                  id="acceso-password"
                  type="password"
                  value={accesoForm.password}
                  onChange={(e) => setAccesoForm({ ...accesoForm, password: e.target.value })}
                  placeholder="Dejar en blanco para autogenerar temporal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acceso-confirm">Confirmar Contraseña (Opcional)</Label>
                <Input
                  id="acceso-confirm"
                  type="password"
                  value={accesoForm.confirmPassword}
                  onChange={(e) => setAccesoForm({ ...accesoForm, confirmPassword: e.target.value })}
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAccesoDialog({ open: false, paciente: null })}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={savingAcceso}>
                {savingAcceso ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creando...</> : "Crear Acceso"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar contraseña autogenerada */}
      <Dialog open={createdPass !== null} onOpenChange={(open) => { if (!open) setCreatedPass(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">¡Acceso Creado Exitosamente!</DialogTitle>
            <DialogDescription>
              Se ha autogenerado una contraseña temporal y segura para este paciente. Por favor, cópiala ahora, ya que no se volverá a mostrar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-900/40 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2">Contraseña Temporal Generada</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-bold tracking-wider select-all">{createdPass}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (createdPass) {
                      navigator.clipboard.writeText(createdPass);
                      toast.success("Contraseña copiada al portapapeles");
                    }
                  }}
                  title="Copiar contraseña"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs mt-3">
                El paciente deberá cambiar esta clave inmediatamente al iniciar sesión por primera vez en su portal.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setCreatedPass(null)}>
                Entendido, Cerrar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}