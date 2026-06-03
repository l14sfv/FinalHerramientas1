import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/cliente';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { ETIQUETAS_ESTADO, claseBadgeEstado } from '../utilidades/etiquetas';
import MensajeWhatsApp from '../componentes/MensajeWhatsApp';
import { buildSessionWhatsAppMessage } from '../utilidades/whatsapp';

export default function Sesiones() {
  const { user } = useAuth();
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [errorAccion, setErrorAccion] = useState('');

  const cargarSesiones = () => {
    setCargando(true);
    api
      .get('/sessions/mine')
      .then((res) => setSesiones(res.data))
      .catch(() => setError('No se pudieron cargar las sesiones'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarSesiones();
  }, []);

  const cambiarEstado = async (id, status) => {
    setErrorAccion('');
    try {
      await api.patch(`/sessions/${id}/status`, { status });
      setSesiones((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    } catch (err) {
      console.error(err);
      setErrorAccion('No se pudo actualizar el estado de la sesión.');
    }
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' });

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
          <Link to="/tutors" className="btn btn-primary btn-sm">+ Agendar nueva sesión</Link>
        </p>
      )}

      {errorAccion && <div className="alert alert-error">{errorAccion}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {cargando && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Cargando sesiones…</p>
        </div>
      )}

      {!cargando && !error && sesiones.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">📅</div>
          <p>No tienes sesiones aún.</p>
          {user.role === 'STUDENT' && (
            <Link to="/tutors" className="btn btn-primary" style={{ marginTop: '1rem' }}>Buscar un tutor</Link>
          )}
        </div>
      )}

      {!cargando && sesiones.length > 0 && (
        <div className="sessions-list">
          {sesiones.map((s) => (
            <article key={s.id} className="card session-card">
              <div className="session-card-header">
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{s.subject?.name || 'Materia'}</h2>
                <span className={claseBadgeEstado(s.status)}>{ETIQUETAS_ESTADO[s.status] || s.status}</span>
              </div>

              <div className="session-meta">
                <span>📅 {formatearFecha(s.scheduledAt)}</span>
                {user.role === 'STUDENT' && s.tutor && <span>👤 Tutor: {s.tutor.name}</span>}
                {user.role !== 'STUDENT' && s.student && <span>👤 Estudiante: {s.student.name}</span>}
                {s.notes && <span>📝 {s.notes}</span>}
              </div>

              {user.role !== 'STUDENT' && s.status === 'PENDING' && (
                <div className="btn-group">
                  <button type="button" className="btn btn-success btn-sm" onClick={() => cambiarEstado(s.id, 'CONFIRMED')}>Confirmar</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => cambiarEstado(s.id, 'CANCELLED')}>Cancelar</button>
                </div>
              )}

              {user.role !== 'STUDENT' && s.status === 'CONFIRMED' && (
                <div className="btn-group">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => cambiarEstado(s.id, 'COMPLETED')}>Marcar completada</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => cambiarEstado(s.id, 'CANCELLED')}>Cancelar</button>
                </div>
              )}

              {(() => {
                const contacto = user.role === 'STUDENT' ? s.tutor : s.student;
                if (!contacto) return null;
                return (
                  <div className="session-whatsapp">
                    <MensajeWhatsApp
                      phone={contacto.phone}
                      recipientName={contacto.name}
                      defaultMessage={buildSessionWhatsAppMessage({
                        senderName: user.name,
                        recipientName: contacto.name,
                        subjectName: s.subject?.name,
                        scheduledAt: s.scheduledAt,
                      })}
                      hint={`${contacto.name} no tiene WhatsApp registrado.`}
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
