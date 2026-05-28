import { useState } from "react";
import { Bell, Check, X, Clock, Calendar, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Badge } from "./ui/badge";
import { useNotifications } from "../contexts/NotificationContext";
import { ScrollArea } from "./ui/scroll-area";

interface NotificationPanelProps {
  userType: "doctor" | "patient";
  onAcceptAppointment?: (appointmentId: string, notificationId: string) => void;
  onRejectAppointment?: (appointmentId: string, notificationId: string) => void;
}

export function NotificationPanel({
  userType,
  onAcceptAppointment,
  onRejectAppointment,
}: NotificationPanelProps) {
  const { notifications, markAsRead, removeNotification } =
    useNotifications();

  // Filtrar notificaciones por tipo de usuario
  const userNotifications = notifications.filter((n) => n.userType === userType);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    userNotifications.forEach((n) => {
      if (!n.read) markAsRead(n.id);
    });
  };

  const handleAccept = (appointmentId: string, notificationId: string) => {
    if (onAcceptAppointment) {
      onAcceptAppointment(appointmentId, notificationId);
    }
    removeNotification(notificationId);
  };

  const handleReject = (appointmentId: string, notificationId: string) => {
    if (onRejectAppointment) {
      onRejectAppointment(appointmentId, notificationId);
    }
    removeNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment_request":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case "appointment_accepted":
        return <Check className="h-4 w-4 text-green-600" />;
      case "appointment_rejected":
        return <X className="h-4 w-4 text-red-600" />;
      case "appointment_opened":
        return <Clock className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 z-50">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {userNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 opacity-30" />
              <p className="text-sm">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="divide-y">
              {userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      
                      {notification.appointmentData && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs space-y-1">
                          <p>
                            <span className="font-medium">Fecha:</span>{" "}
                            {new Date(notification.appointmentData.date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                          <p>
                            <span className="font-medium">Hora:</span> {notification.appointmentData.time}
                          </p>
                          <p>
                            <span className="font-medium">Tipo:</span> {notification.appointmentData.type}
                          </p>
                          {notification.appointmentData.notes && (
                            <p>
                              <span className="font-medium">Motivo:</span>{" "}
                              {notification.appointmentData.notes}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Botones de acción solo para solicitudes de citas del doctor */}
                      {notification.type === "appointment_request" && userType === "doctor" && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(notification.appointmentId, notification.id);
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(notification.appointmentId, notification.id);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
