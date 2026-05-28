import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Save, RotateCcw, Info, Download } from "lucide-react";
import { odontogramaApi } from "../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type Condition =
  | "healthy"       // Sano
  | "caries"        // Caries (Rojo)
  | "restored"      // Obturado/Restaurado (Azul)
  | "crown"         // Corona (Amarillo dorado)
  | "extracted"     // Extraído (X gris)
  | "absent"        // Ausente (sin erupcionar)
  | "fracture"      // Fractura (Naranja)
  | "implant"       // Implante (Morado)
  | "root_canal"    // Tratamiento de conductos (Verde)
  | "to_extract";   // Indicado para extracción (Rojo oscuro)

export type Surface = "top" | "left" | "center" | "right" | "bottom";

export interface ToothData {
  number: number;
  surfaces: Record<Surface, Condition>;
  globalCondition?: Condition; // Para condiciones que afectan todo el diente
  notes?: string;
}

interface OdontogramaProps {
  patientId: string | number;
  readOnly?: boolean;
}

// ─── CONDITION CONFIG ──────────────────────────────────────────────────────────
const CONDITIONS: Record<Condition, { label: string; color: string; bgColor: string; textColor: string }> = {
  healthy:     { label: "Sano",             color: "#e5e7eb", bgColor: "bg-gray-100",        textColor: "text-gray-700" },
  caries:      { label: "Caries",           color: "#ef4444", bgColor: "bg-red-500",         textColor: "text-white" },
  restored:    { label: "Restaurado",       color: "#3b82f6", bgColor: "bg-blue-500",        textColor: "text-white" },
  crown:       { label: "Corona",           color: "#f59e0b", bgColor: "bg-amber-400",       textColor: "text-white" },
  extracted:   { label: "Extraído",         color: "#9ca3af", bgColor: "bg-gray-400",        textColor: "text-white" },
  absent:      { label: "Ausente",          color: "#d1d5db", bgColor: "bg-gray-200",        textColor: "text-gray-500" },
  fracture:    { label: "Fractura",         color: "#f97316", bgColor: "bg-orange-500",      textColor: "text-white" },
  implant:     { label: "Implante",         color: "#8b5cf6", bgColor: "bg-violet-500",      textColor: "text-white" },
  root_canal:  { label: "Endodoncia",       color: "#10b981", bgColor: "bg-emerald-500",     textColor: "text-white" },
  to_extract:  { label: "A Extraer",        color: "#dc2626", bgColor: "bg-red-700",         textColor: "text-white" },
};

const CONDITION_KEYS = Object.keys(CONDITIONS) as Condition[];

// ─── TOOTH NUMBERS (FDI / ISO 3950 System) ───────────────────────────────────
// Upper jaw: 18-11 | 21-28 (right to left from patient view)
// Lower jaw: 48-41 | 31-38
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];

const ALL_TEETH = [...UPPER_RIGHT, ...UPPER_LEFT, ...LOWER_RIGHT, ...LOWER_LEFT];

const createDefaultTooth = (number: number): ToothData => ({
  number,
  surfaces: {
    top:    "healthy",
    left:   "healthy",
    center: "healthy",
    right:  "healthy",
    bottom: "healthy",
  },
});

const createDefaultChart = (): Record<number, ToothData> => {
  const chart: Record<number, ToothData> = {};
  ALL_TEETH.forEach((n) => { chart[n] = createDefaultTooth(n); });
  return chart;
};

// ─── SINGLE TOOTH SVG ────────────────────────────────────────────────────────
interface ToothProps {
  data: ToothData;
  selected: boolean;
  onSurfaceClick: (surface: Surface) => void;
  onClick: () => void;
  isExtracted: boolean;
}

function ToothSvg({ data, selected, onSurfaceClick, onClick, isExtracted }: ToothProps) {
  const s = data?.surfaces || {
    top: "healthy",
    left: "healthy",
    center: "healthy",
    right: "healthy",
    bottom: "healthy",
  };
  const size = 44;
  const center = size / 2;
  const r = 8; // inner pentagon radius

  const getColor = (cond: Condition) => CONDITIONS[cond].color;

  // Polygon paths for each surface (trapezoid shaped)
  // top surface = mesial/occlusal top strip
  const topPath    = `M4,4 L${size-4},4 L${size-4-7},${center-r} L${center-r},${center-r} Z`;
  const bottomPath = `M4,${size-4} L${size-4},${size-4} L${size-4-7},${center+r} L${center-r},${center+r} Z`;
  const leftPath   = `M4,4 L4,${size-4} L${center-r},${center+r} L${center-r},${center-r} Z`;
  const rightPath  = `M${size-4},4 L${size-4},${size-4} L${size-4-7},${center+r} L${size-4-7},${center-r} Z`;
  const centerPath = `M${center-r},${center-r} L${size-4-7},${center-r} L${size-4-7},${center+r} L${center-r},${center+r} Z`;

  if (isExtracted) {
    return (
      <div
        className={`relative cursor-pointer select-none transition-all duration-150 ${selected ? "scale-110 z-10" : "hover:scale-105"}`}
        onClick={onClick}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect x="2" y="2" width={size-4} height={size-4} rx="4" fill="#f3f4f6" stroke={selected ? "#6366f1" : "#d1d5db"} strokeWidth={selected ? 2 : 1} />
          <line x1="8" y1="8" x2={size-8} y2={size-8} stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={size-8} y1="8" x2="8" y2={size-8} stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="absolute bottom-full mb-0.5 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 font-medium">{data.number}</div>
      </div>
    );
  }

  return (
    <div
      className={`relative select-none transition-all duration-150 ${selected ? "scale-110 z-10" : "hover:scale-105"}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ cursor: "pointer" }}>
        {/* Outer border */}
        <rect x="1" y="1" width={size-2} height={size-2} rx="5" fill="white" stroke={selected ? "#6366f1" : "#e5e7eb"} strokeWidth={selected ? 2.5 : 1.5} />

        {/* Top surface */}
        <path d={topPath} fill={getColor(s.top)} fillOpacity="0.9" stroke="white" strokeWidth="0.5"
          onClick={(e) => { e.stopPropagation(); onSurfaceClick("top"); }} style={{ cursor: "pointer" }} />
        {/* Bottom surface */}
        <path d={bottomPath} fill={getColor(s.bottom)} fillOpacity="0.9" stroke="white" strokeWidth="0.5"
          onClick={(e) => { e.stopPropagation(); onSurfaceClick("bottom"); }} style={{ cursor: "pointer" }} />
        {/* Left surface */}
        <path d={leftPath} fill={getColor(s.left)} fillOpacity="0.9" stroke="white" strokeWidth="0.5"
          onClick={(e) => { e.stopPropagation(); onSurfaceClick("left"); }} style={{ cursor: "pointer" }} />
        {/* Right surface */}
        <path d={rightPath} fill={getColor(s.right)} fillOpacity="0.9" stroke="white" strokeWidth="0.5"
          onClick={(e) => { e.stopPropagation(); onSurfaceClick("right"); }} style={{ cursor: "pointer" }} />
        {/* Center (Occlusal) */}
        <path d={centerPath} fill={getColor(s.center)} fillOpacity="0.9" stroke="white" strokeWidth="0.5"
          onClick={(e) => { e.stopPropagation(); onSurfaceClick("center"); }} style={{ cursor: "pointer" }} />
      </svg>
      {/* Tooth number label */}
      <div className="absolute bottom-full mb-0.5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 font-semibold whitespace-nowrap">{data.number}</div>
    </div>
  );
}

// ─── MAIN ODONTOGRAMA COMPONENT ───────────────────────────────────────────────
export default function Odontograma({ patientId, readOnly = false }: OdontogramaProps) {
  const [chart, setChart] = useState<Record<number, ToothData>>(createDefaultChart());
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<Condition>("caries");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Load from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await odontogramaApi.getByPaciente(patientId);
        if (res?.datos) {
          // Parse if it came as a string from the backend
          const parsedDatos = typeof res.datos === 'string' ? JSON.parse(res.datos) : res.datos;
          
          // Merge with defaults so new teeth are always initialized
          const defaultChart = createDefaultChart();
          const merged: Record<number, ToothData> = { ...defaultChart };
          Object.entries(parsedDatos).forEach(([key, val]) => {
            merged[parseInt(key)] = val as ToothData;
          });
          setChart(merged);
        }
      } catch (err) {
        console.error("Error loading odontograma:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const handleSurfaceClick = useCallback((toothNum: number, surface: Surface) => {
    if (readOnly) return;
    setChart((prev) => {
      const tooth = prev[toothNum];
      if (!tooth) return prev;
      return {
        ...prev,
        [toothNum]: {
          ...tooth,
          surfaces: { ...tooth.surfaces, [surface]: selectedCondition },
        },
      };
    });
    setHasChanges(true);
  }, [selectedCondition, readOnly]);

  const handleToothClick = useCallback((toothNum: number) => {
    if (readOnly) return;
    setSelectedTooth((prev) => (prev === toothNum ? null : toothNum));
  }, [readOnly]);

  const handleMarkAllSurfaces = useCallback((toothNum: number) => {
    if (readOnly) return;
    setChart((prev) => {
      const tooth = prev[toothNum];
      if (!tooth) return prev;
      return {
        ...prev,
        [toothNum]: {
          ...tooth,
          surfaces: {
            top: selectedCondition,
            left: selectedCondition,
            center: selectedCondition,
            right: selectedCondition,
            bottom: selectedCondition,
          },
        },
      };
    });
    setHasChanges(true);
  }, [selectedCondition, readOnly]);

  const handleReset = useCallback((toothNum: number) => {
    setChart((prev) => ({
      ...prev,
      [toothNum]: createDefaultTooth(toothNum),
    }));
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await odontogramaApi.save(patientId, chart);
      setHasChanges(false);
      toast.success("Odontograma guardado correctamente");
    } catch (err) {
      toast.error("Error al guardar el odontograma");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!chartRef.current) return;
    try {
      toast.info("Generando PDF, por favor espera...", { id: "pdf-toast" });
      
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.setFontSize(16);
      pdf.text(`Odontograma Clínico - Paciente #${patientId}`, 14, 20);
      pdf.setFontSize(10);
      pdf.text(`Generado el: ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`, 14, 28);
      
      // Add a dividing line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(14, 32, pdfWidth - 14, 32);
      
      pdf.addImage(imgData, "PNG", 14, 40, pdfWidth - 28, pdfHeight * ((pdfWidth - 28) / pdfWidth));
      
      pdf.save(`odontograma_paciente_${patientId}.pdf`);
      toast.success("PDF descargado exitosamente", { id: "pdf-toast" });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF", { id: "pdf-toast" });
    }
  };

  const selectedToothData = selectedTooth ? chart[selectedTooth] : null;
  const isExtracted = (n: number) =>
    Object.values(chart[n]?.surfaces ?? {}).every((s) => s === "extracted");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground animate-pulse">Cargando odontograma...</div>
      </div>
    );
  }

  const renderRow = (teeth: number[], label: string, labelPosition: "above" | "below") => (
    <div className="flex flex-col items-center gap-1">
      {labelPosition === "above" && (
        <div className="text-xs font-semibold text-muted-foreground tracking-widest mb-1">{label}</div>
      )}
      <div className="flex gap-1 items-center">
        {teeth.map((n) => (
          <ToothSvg
            key={n}
            data={chart[n]}
            selected={selectedTooth === n}
            isExtracted={isExtracted(n)}
            onClick={() => handleToothClick(n)}
            onSurfaceClick={(surface) => handleSurfaceClick(n, surface)}
          />
        ))}
      </div>
      {labelPosition === "below" && (
        <div className="text-xs font-semibold text-muted-foreground tracking-widest mt-1">{label}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base">Odontograma Interactivo</h3>
          <Badge variant="outline" className="text-xs">Sistema FDI</Badge>
          {hasChanges && !readOnly && (
            <Badge className="text-xs bg-amber-500 text-white">Cambios sin guardar</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPDF}
            className="text-gray-700 bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exportar PDF
          </Button>
          {!readOnly && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          )}
        </div>
      </div>

      {/* Condition Palette */}
      {!readOnly && (
        <div className="p-3 rounded-xl border bg-card">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Condición activa → haz clic en una superficie del diente
          </p>
          <div className="flex flex-wrap gap-2">
            {CONDITION_KEYS.map((cond) => {
              const cfg = CONDITIONS[cond];
              const isActive = selectedCondition === cond;
              return (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border-2 transition-all duration-150 ${
                    isActive
                      ? "border-indigo-500 shadow-md scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: cfg.color + "30" }}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart Grid */}
      <div
        ref={chartRef}
        className="rounded-2xl border bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/20 dark:to-background p-8 overflow-x-auto"
        style={{ minWidth: "min-content" }}
      >
        <div className="flex flex-col items-center gap-0" style={{ minWidth: 740 }}>
          {/* UPPER JAW */}
          <div className="flex items-end gap-2">
            <div className="text-[10px] text-muted-foreground font-semibold w-12 text-right pb-2">DERECHO</div>
            <div className="flex gap-1">
              {renderRow(UPPER_RIGHT, "", "above")}
              <div className="w-px bg-border mx-1 self-stretch" />
              {renderRow(UPPER_LEFT, "", "above")}
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold w-12 text-left pb-2">IZQUIERDO</div>
          </div>

          {/* Mid separator - represents the gum line */}
          <div className="flex items-center gap-2 my-8 w-full px-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
            <span className="text-[9px] text-rose-400 font-semibold uppercase tracking-widest whitespace-nowrap px-2">— Línea de Oclusión —</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
          </div>

          {/* LOWER JAW */}
          <div className="flex items-start gap-2">
            <div className="text-[10px] text-muted-foreground font-semibold w-12 text-right pt-2">DERECHO</div>
            <div className="flex gap-1">
              {renderRow(LOWER_RIGHT, "", "below")}
              <div className="w-px bg-border mx-1 self-stretch" />
              {renderRow(LOWER_LEFT, "", "below")}
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold w-12 text-left pt-2">IZQUIERDO</div>
          </div>
        </div>
      </div>

      {/* Selected Tooth Panel */}
      {selectedTooth && selectedToothData && !readOnly && (
        <div className="rounded-xl border bg-card p-4 shadow-sm animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-sm">
                Diente #{selectedTooth}
                <span className="text-muted-foreground font-normal ml-2 text-xs">
                  ({getToothName(selectedTooth)})
                </span>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Selecciona una superficie en el diente o usa las acciones rápidas
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setSelectedTooth(null)}
            >
              ✕
            </Button>
          </div>

          {/* Surface status grid */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {(["top", "left", "center", "right", "bottom"] as Surface[]).map((surf) => {
              const cond = selectedToothData.surfaces[surf];
              const cfg = CONDITIONS[cond];
              const labels: Record<Surface, string> = {
                top: "Mesial", left: "Vestib.", center: "Oclusal", right: "Lingual", bottom: "Distal"
              };
              return (
                <button
                  key={surf}
                  onClick={() => handleSurfaceClick(selectedTooth, surf)}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-lg border hover:border-indigo-400 transition-all"
                >
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-[9px] text-muted-foreground">{labels[surf]}</span>
                </button>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 flex-1"
              onClick={() => handleMarkAllSurfaces(selectedTooth)}
            >
              Marcar todo como "{CONDITIONS[selectedCondition].label}"
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => handleReset(selectedTooth)}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Limpiar
            </Button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="rounded-xl border bg-muted/30 p-3">
        <div className="flex items-center gap-1 mb-2">
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">Leyenda de colores</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
          {CONDITION_KEYS.map((cond) => {
            const cfg = CONDITIONS[cond];
            return (
              <div key={cond} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TOOTH NAMES (FDI) ────────────────────────────────────────────────────────
function getToothName(num: number): string {
  const names: Record<number, string> = {
    11: "Incisivo Central Sup. Derecho", 12: "Incisivo Lateral Sup. Derecho",
    13: "Canino Sup. Derecho",           14: "Primer Premolar Sup. Derecho",
    15: "Segundo Premolar Sup. Derecho", 16: "Primer Molar Sup. Derecho",
    17: "Segundo Molar Sup. Derecho",    18: "Tercer Molar (Cordal) Sup. Derecho",
    21: "Incisivo Central Sup. Izquierdo", 22: "Incisivo Lateral Sup. Izquierdo",
    23: "Canino Sup. Izquierdo",           24: "Primer Premolar Sup. Izquierdo",
    25: "Segundo Premolar Sup. Izquierdo", 26: "Primer Molar Sup. Izquierdo",
    27: "Segundo Molar Sup. Izquierdo",    28: "Tercer Molar (Cordal) Sup. Izquierdo",
    31: "Incisivo Central Inf. Izquierdo", 32: "Incisivo Lateral Inf. Izquierdo",
    33: "Canino Inf. Izquierdo",           34: "Primer Premolar Inf. Izquierdo",
    35: "Segundo Premolar Inf. Izquierdo", 36: "Primer Molar Inf. Izquierdo",
    37: "Segundo Molar Inf. Izquierdo",    38: "Tercer Molar (Cordal) Inf. Izquierdo",
    41: "Incisivo Central Inf. Derecho", 42: "Incisivo Lateral Inf. Derecho",
    43: "Canino Inf. Derecho",           44: "Primer Premolar Inf. Derecho",
    45: "Segundo Premolar Inf. Derecho", 46: "Primer Molar Inf. Derecho",
    47: "Segundo Molar Inf. Derecho",    48: "Tercer Molar (Cordal) Inf. Derecho",
  };
  return names[num] || `Diente ${num}`;
}
