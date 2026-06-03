import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { STATUS_LABELS, statusBadgeClass } from '../utils/labels';
import WhatsAppMessage from '../components/WhatsAppMessage';
import { buildSessionWhatsAppMessage } from '../utils/whatsapp';

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadSessions = () => {
    setLoading(true);
    api
      .get('/sessions/mine')
      .then((res) => setSessions(res.data))
      .catch(() => setError('No se pudieron cargar las sesiones'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleStatusChange = async (id, status) => {
    setActionError('');
    try {
      await api.patch(`/sessions/${id}/status`, { status });
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      console.error(err);
      setActionError('No se pudo actualizar el estado de la sesión.');
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('es', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <>
      <header className="page-header">
        <h1>Mis sesiones</h1>
        <p>
          {user.role === 'STUDENT'
            ? 'Revisa y da seguimiento a las tutorías que has solicitado.'
            : 'Gestiona las solicitudes de sesión de tus estudiantes.'}
        </p>
      </header>

      {user.role === 'STUDENT' && (
        <p style={{ marginBottom: '1.5rem' }}>
          <Link to="/tutors" className="btn btn-primary btn-sm">
            + Agendar nueva sesión
          </Link>
        </p>
      )}

      {actionError && <div className="alert alert-error">{actionError}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Cargando sesiones…</p>
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            📅
          </div>
          <p>No tienes sesiones aún.</p>
          {user.role === 'STUDENT' && (
            <Link to="/tutors" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Buscar un tutor
            </Link>
          )}
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="sessions-list">
          {sessions.map((s) => (
            <article key={s.id} className="card session-card">
              <div className="session-card-header">
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
                  {s.subject?.name || 'Materia'}
                </h2>
                <span className={statusBadgeClass(s.status)}>
                  {STATUS_LABELS[s.status] || s.status}
                </span>
              </div>

              <div className="session-meta">
                <span>📅 {formatDate(s.scheduledAt)}</span>
                {user.role === 'STUDENT' && s.tutor && (
                  <span>👤 Tutor: {s.tutor.name}</span>
                )}
                {user.role !== 'STUDENT' && s.student && (
                  <span>👤 Estudiante: {s.student.name}</span>
                )}
                {s.notes && <span>📝 {s.notes}</span>}
              </div>

              {user.role !== 'STUDENT' && s.status === 'PENDING' && (
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => handleStatusChange(s.id, 'CONFIRMED')}
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusChange(s.id, 'CANCELLED')}
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {user.role !== 'STUDENT' && s.status === 'CONFIRMED' && (
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStatusChange(s.id, 'COMPLETED')}
                  >
                    Marcar completada
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleStatusChange(s.id, 'CANCELLED')}
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {(() => {
                const contact =
                  user.role === 'STUDENT' ? s.tutor : s.student;
                const contactPhone = contact?.phone;
                if (!contact) return null;
                return (
                  <div className="session-whatsapp">
                    <WhatsAppMessage
                      phone={contactPhone}
                      recipientName={contact.name}
                      defaultMessage={buildSessionWhatsAppMessage({
                        senderName: user.name,
                        recipientName: contact.name,
                        subjectName: s.subject?.name,
                        scheduledAt: s.scheduledAt,
                      })}
                      hint={`${contact.name} no tiene WhatsApp registrado.`}
                    />
                  </div>
                );
              })()}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
