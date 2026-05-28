import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader2, TrendingUp, Users, Package, Calendar, AlertTriangle } from "lucide-react";
import { statsApi } from "../services/api";

const COLORS = ['#0284c7', '#06b6d4', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];

const MONTHS: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

export function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [_period, _setPeriod] = useState("6months");

  useEffect(() => {
    statsApi.get()
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <span className="ml-3 text-muted-foreground">Cargando reportes...</span>
      </div>
    );
  }

  const citasPorMes = (stats?.citasPorMes ?? []).map((v: any) => ({
    month: MONTHS[v.mes.split("-")[1]] || v.mes,
    citas: v.total_citas,
  }));

  const pacientesPorMes = (stats?.pacientesPorMes ?? []).map((v: any) => ({
    month: MONTHS[v.mes.split("-")[1]] || v.mes,
    nuevos: v.nuevos,
  }));

  const citasPorTipo = stats?.citasPorTipo ?? [];
  const topMedicamentos = stats?.topMedicamentos ?? [];
  const insumosAlerta = stats?.insumosAlerta ?? [];

  const kpiData = [
    { title: "Pacientes Registrados", value: stats?.totalPacientes ?? 0, icon: Users, color: "text-blue-600" },
    { title: "Citas de Hoy", value: stats?.citasHoy ?? 0, icon: Calendar, color: "text-green-600" },
    { title: "Insumos con Stock Bajo", value: stats?.stockBajo ?? 0, icon: Package, color: "text-orange-600" },
    { title: "Medicamentos Recetados", value: topMedicamentos.length, icon: TrendingUp, color: "text-cyan-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Reportes y Análisis</h1>
          <p className="text-muted-foreground mt-1">
            Estadísticas reales de la clínica
          </p>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="medications">Medicamentos</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
        </TabsList>

        {/* TAB: Citas */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Citas por Mes (últimos 6 meses)</CardTitle>
              </CardHeader>
              <CardContent>
                {citasPorMes.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">Sin datos aún</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={citasPorMes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                      <Line type="monotone" dataKey="citas" stroke="#0284c7" strokeWidth={2} name="Citas" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Citas por Tipo / Motivo</CardTitle>
              </CardHeader>
              <CardContent>
                {citasPorTipo.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">Sin datos aún</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={citasPorTipo}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        dataKey="count"
                        nameKey="tipo"
                      >
                        {citasPorTipo.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any, props: any) => [value, props.payload.tipo]} />
                      <Legend formatter={(_: any, entry: any) => entry.payload.tipo} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: Pacientes */}
        <TabsContent value="patients" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Nuevos Pacientes por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                {pacientesPorMes.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">Sin datos aún</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pacientesPorMes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                      <Bar dataKey="nuevos" fill="#0284c7" name="Nuevos Pacientes" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Resumen de Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">Total Registrados</p>
                      <p className="text-sm text-muted-foreground">En el sistema</p>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{stats?.totalPacientes ?? 0}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">Citas Activas Hoy</p>
                      <p className="text-sm text-muted-foreground">No canceladas ni ausentes</p>
                    </div>
                    <div className="text-3xl font-bold text-green-600">{stats?.citasHoy ?? 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: Medicamentos */}
        <TabsContent value="medications" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Medicamentos Más Recetados</CardTitle>
            </CardHeader>
            <CardContent>
              {topMedicamentos.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">Sin recetas registradas aún</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topMedicamentos} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="nombre" type="category" stroke="#64748b" width={150} />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                    <Bar dataKey="recetado" fill="#0284c7" name="Veces Recetado" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Inventario */}
        <TabsContent value="inventory" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Insumos con Stock Bajo o Agotado</CardTitle>
            </CardHeader>
            <CardContent>
              {insumosAlerta.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-medium text-green-700">¡Stock en buen estado!</p>
                  <p className="text-sm text-muted-foreground mt-1">Todos los insumos tienen stock suficiente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {insumosAlerta.map((insumo: any, index: number) => {
                    const isAgotado = insumo.stock_actual === 0;
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          isAgotado ? "bg-red-50 dark:bg-red-900/20" : "bg-orange-50 dark:bg-orange-900/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className={`h-5 w-5 ${isAgotado ? "text-red-600" : "text-orange-600"}`} />
                          <div>
                            <p className="font-medium">{insumo.nombre}</p>
                            <p className={`text-sm ${isAgotado ? "text-red-600" : "text-orange-600"}`}>
                              {isAgotado ? "AGOTADO" : "Stock Bajo"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${isAgotado ? "text-red-600" : "text-orange-600"}`}>
                            {insumo.stock_actual}
                          </p>
                          <p className="text-xs text-muted-foreground">Mín: {insumo.stock_minimo}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
