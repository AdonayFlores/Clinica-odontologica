import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Search, Plus, Edit, Trash2, Loader2, Stethoscope, Copy } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://192.168.0.27:3001/api";
const getHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("authToken")}` });

interface Odontologo {
  id_odontologo: number;
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  especialidad: string;
  cedula_profesional: string;
}

const emptyForm = { nombre: "", apellido: "", correo: "", password: "", especialidad: "", cedula_profesional: "" };

export function OdontologosPage() {
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOd, setEditingOd] = useState<Odontologo | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [createdPass, setCreatedPass] = useState<string | null>(null);

  const loadOdontologos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/odontologos`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOdontologos(data);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al cargar odontólogos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOdontologos(); }, []);

  const filtered = odontologos.filter((o) =>
    `${o.nombre} ${o.apellido} ${o.especialidad || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => { setEditingOd(null); setFormData(emptyForm); setIsDialogOpen(true); };

  const handleEdit = (o: Odontologo) => {
    setEditingOd(o);
    setFormData({ nombre: o.nombre, apellido: o.apellido, correo: o.correo, password: "", especialidad: o.especialidad || "", cedula_profesional: o.cedula_profesional || "" });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar odontólogo?")) return;
    try {
      const res = await fetch(`${API_BASE}/odontologos/${id}`, { method: "DELETE", headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOdontologos((prev) => prev.filter((o) => o.id_odontologo !== id));
      toast.success("Odontólogo eliminado");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingOd) {
        const res = await fetch(`${API_BASE}/odontologos/${editingOd.id_odontologo}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ nombre: formData.nombre, apellido: formData.apellido, correo: formData.correo, especialidad: formData.especialidad, cedula_profesional: formData.cedula_profesional }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        await loadOdontologos();
        toast.success("Odontólogo actualizado");
      } else {
        const res = await fetch(`${API_BASE}/odontologos`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        await loadOdontologos();
        toast.success("Odontólogo creado correctamente");
        if (data && data.passwordTemp) {
          setCreatedPass(data.passwordTemp);
        }
      }
      setIsDialogOpen(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Odontólogos</h1>
          <p className="text-muted-foreground mt-1">Gestiona el equipo de dentistas</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Odontólogo
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar odontólogo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-muted-foreground">Cargando odontólogos...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      No hay odontólogos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((o) => (
                    <TableRow key={o.id_odontologo}>
                      <TableCell className="font-medium">Dr. {o.nombre} {o.apellido}</TableCell>
                      <TableCell>{o.correo}</TableCell>
                      <TableCell>{o.especialidad || "—"}</TableCell>
                      <TableCell>{o.cedula_profesional || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(o)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(o.id_odontologo)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingOd ? "Editar Odontólogo" : "Nuevo Odontólogo"}</DialogTitle>
            <DialogDescription>{editingOd ? "Actualiza los datos" : "Registra un nuevo dentista en el sistema"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Apellido *</Label>
                <Input value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} required />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Correo *</Label>
                <Input type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} required />
              </div>
              {!editingOd && (
                <div className="space-y-2 col-span-2">
                  <Label>Contraseña (Opcional)</Label>
                  <Input type="password" placeholder="Dejar en blanco para autogenerar temporal" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              )}
              <div className="space-y-2">
                <Label>Especialidad</Label>
                <Input placeholder="Ej: Ortodoncia" value={formData.especialidad} onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cédula Profesional</Label>
                <Input value={formData.cedula_profesional} onChange={(e) => setFormData({ ...formData, cedula_profesional: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : (editingOd ? "Actualizar" : "Crear")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar contraseña autogenerada */}
      <Dialog open={createdPass !== null} onOpenChange={(open) => { if (!open) setCreatedPass(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">¡Odontólogo Creado Exitosamente!</DialogTitle>
            <DialogDescription>
              Se ha autogenerado una contraseña temporal y segura para este odontólogo. Por favor, cópiala ahora, ya que no se volverá a mostrar.
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
                El odontólogo deberá cambiar esta clave inmediatamente al iniciar sesión por primera vez.
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
