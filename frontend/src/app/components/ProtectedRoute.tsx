import { useEffect } from "react";
import { useNavigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      navigate("/login", { replace: true });
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      try {
        const user = JSON.parse(userData);
        if (!allowedRoles.includes(user.rol)) {
          navigate("/login", { replace: true });
        }
      } catch {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, allowedRoles]);

  const token = localStorage.getItem("authToken");
  if (!token) return null;

  return <>{children}</>;
}

// Guard específico para el portal del paciente
export function PatientProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("patientToken");
    if (!token) {
      navigate("/patient/login", { replace: true });
    }
  }, [navigate]);

  const token = localStorage.getItem("patientToken");
  if (!token) return null;

  return <>{children}</>;
}
