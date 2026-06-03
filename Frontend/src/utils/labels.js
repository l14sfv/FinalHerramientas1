export const ROLE_LABELS = {
  STUDENT: 'Estudiante',
  TUTOR: 'Tutor',
  ADMIN: 'Administrador',
};

export const STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
};

export function statusBadgeClass(status) {
  const map = {
    PENDING: 'badge-pending',
    CONFIRMED: 'badge-confirmed',
    CANCELLED: 'badge-cancelled',
    COMPLETED: 'badge-completed',
  };
  return `badge ${map[status] || 'badge-pending'}`;
}
