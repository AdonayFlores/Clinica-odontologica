import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, Moon, Sun, User, Loader2, KeyRound, Copy } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Estados para recuperar contraseña
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [recovering, setRecovering] = useState(false);
  const [tempPasswordReveal, setTempPasswordReveal] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login(email, password);

      // Los pacientes deben usar el portal del paciente
      if (data.usuario.rol === "paciente") {
        toast.error("Esta área es solo para personal de la clínica. Usa el portal del paciente.");
        navigate("/patient/login");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.usuario));
      toast.success(`Bienvenido, ${data.usuario.nombre}!`);
      navigate("/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error(message);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-xl border-blue-100">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Sistema de Farmacia Dental</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@clinica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-400"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Acceso exclusivo para personal autorizado de la clínica.
            </p>
          </div>

          {/* Patient Portal Link */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-muted-foreground mb-3">
              ¿Eres paciente?
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/patient/login")}
            >
              <User className="h-4 w-4 mr-2" />
              Acceder al Portal del Paciente
            </Button>
          </div>
        </CardContent>
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
                    setEmail(forgotEmail);
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
                    placeholder="doctor@clinica.com"
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