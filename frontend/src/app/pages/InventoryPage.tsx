import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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
import { Search, Plus, Edit, Trash2, Loader2, AlertTriangle, RefreshCw, Package } from "lucide-react";
import { toast } from "sonner";
import { insumosApi } from "../services/api";

interface Insumo {
  id_insumo: number;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  unidad_medida: string;
  stock_minimo: number;
  id_estado_insumo: number;
  estado_nombre?: string;
  estado_codigo?: string;
  stock_actual: number;
}

export function InventoryPage() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [selectedInsumoForStock, setSelectedInsumoForStock] = useState<Insumo | null>(null);
  const [stockToAdd, setStockToAdd] = useState(1);
  const [submittingStock, setSubmittingStock] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    unidad_medida: "unidad",
    stock_minimo: 10,
    id_estado_insumo: 1, // 1: Disponible, 2: Agotado, 3: Descontinuado
  });

  const fetchInsumos = async () => {
    setLoading(true);
    try {
      const data = await insumosApi.getAll();
      setInsumos(data);
    } catch (error) {
      toast.error("Error al cargar insumos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  const filtered = insumos.filter((i) =>
    i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = insumos.filter((i) => i.estado_codigo !== "DESCONTINUADO").length;
  const discontinuedCount = insumos.filter((i) => i.estado_codigo === "DESCONTINUADO").length;

  const handleAdd = () => {
    setEditingInsumo(null);
    setFormData({ 
      nombre: "", descripcion: "", categoria: "", 
      unidad_medida: "unidad", stock_minimo: 10, id_estado_insumo: 1 
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (insumo: Insumo) => {
    setEditingInsumo(insumo);
    setFormData({
      nombre: insumo.nombre,
      descripcion: insumo.descripcion || "",
      categoria: insumo.categoria,
      unidad_medida: insumo.unidad_medida,
      stock_minimo: insumo.stock_minimo,
      id_estado_insumo: insumo.id_estado_insumo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Descontinuar este insumo?")) return;
    try {
      await insumosApi.delete(id);
      toast.success("Insumo descontinuado");
      fetchInsumos();
    } catch (error: any) {
      toast.error(error.message || "Error al descontinuar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingInsumo) {
        await insumosApi.update(editingInsumo.id_insumo, formData);
        toast.success("Insumo actualizado");
      } else {
        await insumosApi.create(formData);
        toast.success("Insumo creado");
      }
      setIsDialogOpen(false);
      fetchInsumos();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenStockDialog = (insumo: Insumo) => {
    setSelectedInsumoForStock(insumo);
    setStockToAdd(1);
    setIsStockDialogOpen(true);
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInsumoForStock) return;
    setSubmittingStock(true);
    try {
      await insumosApi.addStock(selectedInsumoForStock.id_insumo, stockToAdd);
      toast.success(`Se añadieron ${stockToAdd} unidades a ${selectedInsumoForStock.nombre}`);
      setIsStockDialogOpen(false);
      fetchInsumos();
    } catch (error: any) {
      toast.error(error.message || "Error al añadir stock");
    } finally {
      setSubmittingStock(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Insumos y Bodega</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de insumos físicos y material de uso clínico
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchInsumos} variant="outline" size="icon" title="Actualizar">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Package className="h-4 w-4 mr-2" />
            Nuevo Insumo
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Insumos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insumos.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos / En Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Descontinuados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">{discontinuedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-muted-foreground">Cargando insumos...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Insumo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>U. Medida</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {searchTerm ? "No se encontraron resultados" : "No hay insumos registrados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((i) => (
                    <TableRow key={i.id_insumo} className={i.estado_codigo === "DESCONTINUADO" ? "opacity-50" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{i.nombre}</p>
                          {i.descripcion && (
                            <p className="text-xs text-muted-foreground">{i.descripcion}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{i.categoria}</TableCell>
                      <TableCell>{i.unidad_medida}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={`font-bold ${i.stock_actual <= i.stock_minimo ? 'text-orange-600' : 'text-green-600'}`}>
                            {i.stock_actual}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {i.stock_actual <= i.stock_minimo && <AlertTriangle className="h-3 w-3 text-orange-400" />}
                            Mínimo: {i.stock_minimo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          i.estado_codigo === "DISPONIBLE" ? "default" : 
                          i.estado_codigo === "AGOTADO" ? "destructive" : "outline"
                        }>
                          {i.estado_nombre}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {i.estado_codigo !== "DESCONTINUADO" && (
                            <Button variant="outline" size="sm" onClick={() => handleOpenStockDialog(i)}>
                              + Stock
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(i)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {i.estado_codigo !== "DESCONTINUADO" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(i.id_insumo)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
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

      {/* Dialog Agregar / Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingInsumo ? "Editar Insumo" : "Nuevo Insumo"}</DialogTitle>
            <DialogDescription>
              {editingInsumo ? "Actualiza la información del material" : "Registra un nuevo material de uso clínico"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre (Ej: Masilla, Gasas, Anestesia) *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Input
                    id="categoria"
                    placeholder="Resinas, Descartables..."
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidad_medida">Unidad de Medida *</Label>
                  <Input
                    id="unidad_medida"
                    placeholder="Caja, Bote, Unidad..."
                    value={formData.unidad_medida}
                    onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock_minimo">Stock Mínimo (Alerta) *</Label>
                  <Input
                    id="stock_minimo"
                    type="number"
                    min="0"
                    value={formData.stock_minimo}
                    onChange={(e) => setFormData({ ...formData, stock_minimo: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado Físico Actual</Label>
                  <select
                    id="estado"
                    value={formData.id_estado_insumo}
                    onChange={(e) => setFormData({ ...formData, id_estado_insumo: parseInt(e.target.value) })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  >
                    <option value={1}>Disponible</option>
                    <option value={2}>Agotado</option>
                    <option value={3}>Descontinuado</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</> : (editingInsumo ? "Actualizar" : "Guardar")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Añadir Stock */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Añadir Stock</DialogTitle>
            <DialogDescription>
              Ingresa la cantidad a sumar al inventario de:
              <br />
              <strong>{selectedInsumoForStock?.nombre}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockSubmit}>
            <div className="py-4">
              <Label htmlFor="stock_add">Cantidad ({selectedInsumoForStock?.unidad_medida})</Label>
              <Input
                id="stock_add"
                type="number"
                min="1"
                value={stockToAdd}
                onChange={(e) => setStockToAdd(parseInt(e.target.value))}
                required
                className="mt-2 text-lg"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsStockDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={submittingStock}>
                {submittingStock ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Añadiendo...</> : "+ Añadir"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
