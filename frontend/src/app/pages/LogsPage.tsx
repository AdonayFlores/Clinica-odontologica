import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { logsApi } from "../services/api";

interface LogEntry {
  id_log: number;
  id_usuario: number | null;
  metodo: string;
  ruta: string;
  ip: string;
  detalles: string;
  fecha_registro: string;
  usuario_nombre?: string;
  usuario_apellido?: string;
  usuario_correo?: string;
  usuario_rol?: string;
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-150 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  POST: "bg-emerald-150 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  PUT: "bg-amber-150 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  PATCH: "bg-purple-150 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  DELETE: "bg-rose-150 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

const ROL_LABELS: Record<string, string> = {
  admin: "Admin",
  dentista: "Dentista",
  asistente: "Asistente",
  paciente: "Paciente",
};

export function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await logsApi.getAll();
      setLogs(data);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar logs de auditoría");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const userStr = l.usuario_nombre 
      ? `${l.usuario_nombre} ${l.usuario_apellido} ${l.usuario_correo} ${l.usuario_rol}` 
      : "Invitado/Público";
    const targetStr = `${l.metodo} ${l.ruta} ${l.ip} ${userStr}`.toLowerCase();
    return targetStr.includes(searchTerm.toLowerCase());
  });

  const toggleExpand = (id: number) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Auditoría de Actividad</h1>
            <p className="text-muted-foreground mt-1">
              Registro inmutable de solicitudes HTTP y operaciones realizadas en el sistema.
            </p>
          </div>
        </div>
        <Button onClick={loadLogs} variant="outline" size="sm" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Actualizar"
          )}
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por método, ruta, doctor, ip..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-muted-foreground">Cargando logs de auditoría...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="w-[100px]">Método</TableHead>
                    <TableHead>Ruta / Endpoint</TableHead>
                    <TableHead>Usuario Responsable</TableHead>
                    <TableHead className="w-[140px]">Dirección IP</TableHead>
                    <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No se encontraron registros de auditoría.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((l) => {
                      const isExpanded = expandedLogId === l.id_log;
                      let parsedDetails: any = null;
                      let isDetailsEmpty = true;
                      try {
                        if (l.detalles) {
                          parsedDetails = JSON.parse(l.detalles);
                          if (parsedDetails && typeof parsedDetails === 'object') {
                            const hasQuery = parsedDetails.query && Object.keys(parsedDetails.query).length > 0;
                            const hasBody = parsedDetails.body && Object.keys(parsedDetails.body).length > 0;
                            if (hasQuery || hasBody) {
                              isDetailsEmpty = false;
                            }
                          }
                        }
                      } catch (e) {
                        parsedDetails = l.detalles;
                        if (parsedDetails) isDetailsEmpty = false;
                      }

                      return (
                        <>
                          <TableRow key={l.id_log} className="hover:bg-muted/50 cursor-pointer" onClick={() => toggleExpand(l.id_log)}>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleExpand(l.id_log)}>
                                {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Badge className={`font-semibold text-xs tracking-wider px-2 py-0.5 rounded ${METHOD_COLORS[l.metodo] || "bg-gray-100 text-gray-800"}`}>
                                {l.metodo}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs max-w-xs truncate" title={l.ruta}>
                              {l.ruta}
                            </TableCell>
                            <TableCell>
                              {l.usuario_nombre ? (
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {l.usuario_nombre} {l.usuario_apellido}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {l.usuario_correo} • <strong className="text-blue-600 dark:text-blue-400 font-semibold">{ROL_LABELS[l.usuario_rol || ""] || l.usuario_rol}</strong>
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm italic">Invitado / Público</span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {l.ip || "127.0.0.1"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(l.fecha_registro).toLocaleString("es-ES")}
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow key={`details-${l.id_log}`} className="bg-slate-50 dark:bg-slate-900/30">
                              <TableCell colSpan={6} className="p-4">
                                <div className="space-y-3">
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalles Técnicos de la Operación</p>
                                  <div className="bg-card border rounded-lg p-3 overflow-x-auto font-mono text-xs max-h-48 text-foreground">
                                    {!isDetailsEmpty ? (
                                      <pre className="whitespace-pre-wrap">{JSON.stringify(parsedDetails, null, 2)}</pre>
                                    ) : (
                                      <span className="text-muted-foreground italic flex items-center gap-1.5">
                                        ℹ️ Solicitud de lectura simple. No se enviaron parámetros de búsqueda ni datos de formulario en esta operación.
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
