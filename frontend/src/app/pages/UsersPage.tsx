import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Search, Plus, Edit, Loader2, Users, Copy } from "lucide-react";
import { toast } from "sonner";
import { usuariosApi } from "../services/api";

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  estado_nombre: string;
  estado_codigo: string;
  fecha_creacion: string;
}

const emptyForm = { nombre: "", apellido: "", correo: "", password: "", rol: "paciente", id_estado_usuario: 1 };

const ROL_LABELS: Record<string, string> = {
  admin: "Administrador",
  dentista: "Dentista",
  asistente: "Asistente",
  paciente: "Paciente",
};

const ROL_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  dentista: "bg-blue-100 text-blue-700",
  asistente: "bg-green-100 text-green-700",
  paciente: "bg-gray-100 text-gray-700",
};

export function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [createdPass, setCreatedPass] = useState<string | null>(null);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosApi.getAll();
      setUsuarios(data);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsuarios(); }, []);

  const filteredUsuarios = usuarios.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.correo}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleEdit = (u: Usuario) => {
    setEditingUser(u);
    setFormData({ nombre: u.nombre, apellido: u.apellido, correo: u.correo, password: "", rol: u.rol, id_estado_usuario: u.estado_codigo === "ACTIVO" ? 1 : 2 });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        const updated = await usuariosApi.update(editingUser.id_usuario, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          rol: formData.rol,
          id_estado_usuario: formData.id_estado_usuario,
        });
        
        // Si el admin escribió una nueva contraseña, la actualizamos
        if (formData.password) {
          await usuariosApi.cambiarPassword(editingUser.id_usuario, { password_nueva: formData.password });
        }

        setUsuarios((prev) => prev.map((u) => (u.id_usuario === editingUser.id_usuario ? { ...u, ...updated } : u)));
        toast.success("Usuario actualizado correctamente");
      } else {
        const res = await usuariosApi.create(formData);
        await loadUsuarios();
        toast.success("Usuario creado correctamente");
        if (res && res.passwordTemp) {
          setCreatedPass(res.passwordTemp);
        }
      }
      setIsDialogOpen(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al guardar usuario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-1">Administra los accesos al sistema</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar usuario..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-muted-foreground">Cargando usuarios...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((u) => (
                    <TableRow key={u.id_usuario}>
                      <TableCell className="font-medium">{u.nombre} {u.apellido}</TableCell>
                      <TableCell>{u.correo}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${ROL_COLORS[u.rol] || "bg-gray-100 text-gray-700"}`}>
                          {ROL_LABELS[u.rol] || u.rol}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.estado_codigo === "ACTIVO" ? "default" : "secondary"}>
                          {u.estado_nombre}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(u.fecha_creacion).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(u)} title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
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
            <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription>{editingUser ? "Actualiza los datos del usuario" : "Crea un nuevo acceso al sistema"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="u-nombre">Nombre *</Label>
                <Input id="u-nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-apellido">Apellido *</Label>
                <Input id="u-apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} required />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="u-correo">Correo *</Label>
                <Input id="u-correo" type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} required />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="u-password">
                  {editingUser ? "Nueva Contraseña (Opcional)" : "Contraseña (Opcional)"}
                </Label>
                <Input 
                  id="u-password" 
                  type="password" 
                  placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Dejar en blanco para autogenerar temporal"} 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-rol">Rol *</Label>
                <select 
                  id="u-rol" 
                  value={formData.rol} 
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })} 
                  disabled={!!editingUser}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="paciente">Paciente</option>
                  <option value="asistente">Asistente</option>
                  <option value="dentista">Dentista</option>
                  {editingUser && editingUser.rol === "admin" && (
                    <option value="admin">Administrador</option>
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-estado">Estado</Label>
                <select 
                  id="u-estado" 
                  value={formData.id_estado_usuario} 
                  onChange={(e) => setFormData({ ...formData, id_estado_usuario: parseInt(e.target.value) })} 
                  disabled={editingUser?.rol === "admin"}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value={1}>Activo</option>
                  <option value={2}>Inactivo</option>
                  <option value={3}>Suspendido</option>
                </select>
                {editingUser?.rol === "admin" && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-500 font-medium mt-1">
                    No se puede suspender ni desactivar a un administrador para evitar bloqueos del sistema.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : (editingUser ? "Actualizar" : "Crear Usuario")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar contraseña autogenerada */}
      <Dialog open={createdPass !== null} onOpenChange={(open) => { if (!open) setCreatedPass(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">¡Usuario Creado Exitosamente!</DialogTitle>
            <DialogDescription>
              Se ha autogenerado una contraseña temporal y segura para este usuario. Por favor, cópiala ahora, ya que no se volverá a mostrar.
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
                El usuario deberá cambiar esta clave inmediatamente al iniciar sesión por primera vez.
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
