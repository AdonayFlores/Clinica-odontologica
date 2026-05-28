import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { KeyRound, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "../services/api";

interface ChangePasswordModalProps {
  portal: "staff" | "patient";
}

export function ChangePasswordModal({ portal }: ChangePasswordModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar si el usuario logueado requiere cambio de contraseña
    const key = portal === "patient" ? "patientData" : "userData";
    const rawData = localStorage.getItem(key);
    if (rawData) {
      try {
        const user = JSON.parse(rawData);
        if (user && user.requiere_cambio_password) {
          setEmail(user.correo);
          setIsOpen(true);
        }
      } catch (e) {
        console.error("Error parsing user data in ChangePasswordModal:", e);
      }
    }
  }, [portal]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Por favor ingresa tu contraseña temporal actual.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("La confirmación de la contraseña no coincide.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("La nueva contraseña debe ser diferente a la temporal actual.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.cambiarPasswordTemporal({
        correo: email,
        password_actual: currentPassword,
        password_nueva: newPassword
      });

      toast.success(res.message || "Contraseña actualizada exitosamente.");

      // Actualizar localStorage para desactivar la bandera
      const key = portal === "patient" ? "patientData" : "userData";
      const rawData = localStorage.getItem(key);
      if (rawData) {
        const user = JSON.parse(rawData);
        user.requiere_cambio_password = false;
        localStorage.setItem(key, JSON.stringify(user));
      }

      setIsOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar contraseña";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (portal === "patient") {
      localStorage.removeItem("patientToken");
      localStorage.removeItem("patientData");
      window.location.href = "/patient/login";
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-amber-200 dark:border-amber-900/50">
        <CardHeader className="space-y-3 text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Actualización Obligatoria</CardTitle>
          <CardDescription className="text-sm">
            Para la seguridad de tu cuenta, debes cambiar la contraseña temporal proporcionada por el administrador antes de continuar.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="current-pass">Contraseña Temporal Actual</Label>
              <div className="relative">
                <Input
                  id="current-pass"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa la contraseña temporal"
                  required
                  className="pr-10 border-amber-200 focus:border-amber-400 dark:border-amber-900/40"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-pass">Nueva Contraseña Segura</Label>
              <div className="relative">
                <Input
                  id="new-pass"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="pr-10 border-blue-200 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-pass">Confirmar Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirm-pass"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  className="pr-10 border-blue-200 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-lg text-xs border border-amber-100 dark:border-amber-900/30">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>
                Usa una contraseña que no uses en otros sitios. Debe tener letras, números y al menos 6 caracteres.
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium shadow-md shadow-amber-600/10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando contraseña...
                </>
              ) : (
                "Guardar Nueva Contraseña"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              Cancelar y Cerrar Sesión
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
