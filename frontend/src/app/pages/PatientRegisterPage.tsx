import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Moon, Sun, UserPlus, Loader2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

// le cambie por mi api de base de datos, para usar el viejo aqui esta
//const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
// const API_BASE = import.meta.env.VITE_API_URL || "http://192.168.0.27:3001/api";
const API_BASE = import.meta.env.VITE_API_URL || "http://192.168.0.27:3001/api";

const soloDigitos = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);

const hoy = new Date().toISOString().split("T")[0];
const fechaMinima = new Date(new Date().getFullYear() - 120, 0, 1).toISOString().split("T")[0];

export function PatientRegisterPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    fecha_nacimiento: "",
    sexo: "",
    direccion: "",
    documento_identidad: "",
    tipo_sangre: "",
    alergias: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{9}$/.test(formData.documento_identidad)) {
      toast.error("El DUI debe tener exactamente 9 dígitos");
      return;
    }
    if (formData.telefono && !/^[267]\d{7}$/.test(formData.telefono)) {
      toast.error("El teléfono debe tener 8 dígitos y empezar con 2, 6 o 7");
      return;
    }
    if (formData.fecha_nacimiento > hoy || formData.fecha_nacimiento < fechaMinima) {
      toast.error("La fecha de nacimiento no es válida");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      // Un solo endpoint público — crea usuario + paciente en una transacción
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          password: formData.password,
          telefono: formData.telefono || null,
          fecha_nacimiento: formData.fecha_nacimiento || null,
          sexo: formData.sexo || null,
          direccion: formData.direccion || null,
          documento_identidad: formData.documento_identidad,
          tipo_sangre: formData.tipo_sangre || null,
          alergias: formData.alergias,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");

      // Guardar token y redirigir directamente al portal
      localStorage.setItem("patientToken", data.token);
      localStorage.setItem("patientData", JSON.stringify(data.usuario));
      toast.success("¡Cuenta creada! Bienvenido al portal.");
      navigate("/patient/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error en el registro";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl my-8">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
            <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Registro de Paciente</CardTitle>
          <CardDescription>Completa tus datos para crear tu cuenta</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input id="apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento_identidad">Doc. de Identidad (DUI/Pasaporte) *</Label>
                  <Input id="documento_identidad" inputMode="numeric" maxLength={9} placeholder="9 dígitos, sin guion" value={formData.documento_identidad} onChange={(e) => setFormData({ ...formData, documento_identidad: soloDigitos(e.target.value, 9) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                  <Input id="fecha_nacimiento" type="date" min={fechaMinima} max={hoy} value={formData.fecha_nacimiento} onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <select
                    id="sexo"
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo electrónico *</Label>
                  <Input id="correo" type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" type="tel" inputMode="numeric" maxLength={8} placeholder="8 dígitos, sin guion" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: soloDigitos(e.target.value, 8) })} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alergias">Alergias (escribe "Ninguna" si no tienes) *</Label>
                  <Input id="alergias" value={formData.alergias} onChange={(e) => setFormData({ ...formData, alergias: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_sangre">Tipo de Sangre (Opcional)</Label>
                  <select
                    id="tipo_sangre"
                    value={formData.tipo_sangre}
                    onChange={(e) => setFormData({ ...formData, tipo_sangre: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Seguridad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Registrando...</> : "Registrarme"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700" onClick={() => navigate("/patient/login")}>
                Inicia sesión
              </Button>
            </div>
            <div className="text-center mt-2">
              <Button type="button" variant="link" className="text-sm text-muted-foreground" onClick={() => window.location.href = "http://127.0.0.1:8082/index.html"}>
                ← Volver al inicio
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}