import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Moon, Sun, User, Loader2, KeyRound, Copy } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { authApi } from "../services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function PatientLoginPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

  // Estados para recuperar contraseña
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [recovering, setRecovering] = useState(false);
  const [tempPasswordReveal, setTempPasswordReveal] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: formData.correo, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      if (data.usuario.rol !== "paciente") {
        toast.error("Esta área es solo para pacientes. Usa el login del personal.");
        return;
      }

      localStorage.setItem("patientToken", data.token);
      localStorage.setItem("patientData", JSON.stringify(data.usuario));
      toast.success(`Bienvenido, ${data.usuario.nombre}`);
      navigate("/patient/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecovering(true);
    setTempPasswordReveal(null);
    try {
      const res = await authApi.recuperarPassword(forgotEmail);
      setTempPasswordReveal(res.passwordTemp);
      toast.success("Contraseña temporal generada con éxito.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al recuperar contraseña";
      toast.error(msg);
    } finally {
      setRecovering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
            <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Portal del Paciente</CardTitle>
          <CardDescription>Ingresa con tu correo y contraseña</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="tu@correo.com"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 h-auto text-xs text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    setTempPasswordReveal(null);
                    setForgotEmail("");
                    setForgotOpen(true);
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Ingresando...</> : "Iniciar Sesión"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿No tienes cuenta? </span>
              <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700" onClick={() => navigate("/patient/register")}>
                Regístrate aquí
              </Button>
            </div>
            <div className="text-center">
              <Button type="button" variant="link" className="text-sm text-muted-foreground" onClick={() => window.location.href = "http://127.0.0.1:8082/index.html"}>
                ← Volver al inicio
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Dialog Recuperar Contraseña */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-600" />
              Recuperar Contraseña
            </DialogTitle>
            <DialogDescription>
              {tempPasswordReveal 
                ? "Tu contraseña ha sido restablecida correctamente."
                : "Ingresa tu correo electrónico registrado y te proporcionaremos una contraseña temporal de acceso."}
            </DialogDescription>
          </DialogHeader>

          {tempPasswordReveal ? (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-900/40 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2">Nueva Contraseña Temporal</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-mono font-bold tracking-wider select-all">{tempPasswordReveal}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(tempPasswordReveal);
                      toast.success("Contraseña copiada al portapapeles");
                    }}
                    title="Copiar contraseña"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs mt-3">
                  Inicia sesión con esta contraseña temporal. El sistema te exigirá cambiarla inmediatamente por tu seguridad.
                </p>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={() => {
                    setFormData({ ...formData, correo: forgotEmail, password: "" });
                    setForgotOpen(false);
                  }}
                >
                  Entendido, ir al Login
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleRecover}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Correo Electrónico *</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setForgotOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700" 
                  disabled={recovering}
                >
                  {recovering ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Restableciendo...</> : "Obtener Clave Temporal"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
