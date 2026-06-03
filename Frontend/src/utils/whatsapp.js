/** Normaliza teléfono a solo dígitos (código de país incluido). */
export function normalizePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
}

/** URL wa.me con mensaje opcional prellenado. */
export function buildWhatsAppUrl(phone, message = '') {
  const digits = normalizePhone(phone);
  if (!digits) return null;
  const base = `https://wa.me/${digits}`;
  const text = message?.trim();
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export const SUPPORT_WHATSAPP = import.meta.env.VITE_WHATSAPP_SUPPORT || '';

export function buildSessionWhatsAppMessage({ senderName, recipientName, subjectName, scheduledAt }) {
  const fecha = scheduledAt
    ? new Date(scheduledAt).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })
    : '';
  return `Hola ${recipientName}, soy ${senderName}. Te escribo por la sesión de ${subjectName || 'tutoría'}${fecha ? ` programada para ${fecha}` : ''}. ¿Podemos coordinar?`;
}

export function buildTutorWhatsAppMessage({ studentName, tutorName, subjectName }) {
  const quien = studentName || 'un estudiante';
  const materia = subjectName ? ` en ${subjectName}` : '';
  return `Hola ${tutorName}, soy ${quien}. Me interesa una tutoría${materia} en la plataforma. ¿Tienes disponibilidad?`;
}
