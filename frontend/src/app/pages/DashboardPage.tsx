import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, Users, Package, Calendar, TrendingUp, TrendingDown, Loader2, AlertTriangle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { statsApi } from "../services/api";

interface DashboardStats {
  totalPacientes: number;
  citasHoy: number;
  stockBajo: number;
  citasPorMes: { mes: string; total_citas: number }[];
  topMedicamentos: { nombre: string; recetado: number }[];
  pacientesPorMes: { mes: string; nuevos: number }[];
  insumosAlerta: { nombre: string; stock_minimo: number; stock_actual: number }[];
}

const MONTHS: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
        <span className="ml-3 text-muted-foreground">Cargando dashboard...</span>
      </div>
    );
  }

  const kpiData = [
    { title: "Pacientes Registrados", value: stats?.totalPacientes ?? 0, icon: Users, trend: "up", change: "" },
    { title: "Citas de Hoy", value: stats?.citasHoy ?? 0, icon: Calendar, trend: "up", change: "" },
    { title: "Insumos con Stock Bajo", value: stats?.stockBajo ?? 0, icon: Package, trend: "down", change: "" },
    { title: "Medicamentos Activos", value: stats?.topMedicamentos?.length ?? 0, icon: Activity, trend: "up", change: "" },
  ];

  const chartData = (stats?.citasPorMes ?? []).map((v) => ({
    month: MONTHS[v.mes.split("-")[1]] || v.mes,
    citas: v.total_citas,
  }));

  const topMedicines = stats?.topMedicamentos ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bienvenido al sistema de gestión de farmacia dental</p>
      </div>

      {(stats?.stockBajo ?? 0) > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{stats?.stockBajo} insumo(s) con stock bajo o agotado. Revisa el inventario.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={kpi.title} className="shadow-sm border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.change && (
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <TrendIcon className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">{kpi.change}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Tendencia de Citas (últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">Sin datos de citas aún</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="citas" stroke="#0284c7" strokeWidth={2} name="Citas" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Medicamentos Más Recetados</CardTitle>
          </CardHeader>
          <CardContent>
            {topMedicines.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">Sin recetas registradas aún</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topMedicines}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="nombre" stroke="#64748b" angle={-30} textAnchor="end" height={80} />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                  <Bar dataKey="recetado" fill="#0284c7" name="Veces Recetado" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}