import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/cliente';
import { useAuth } from '../contextos/ContextoAutenticacion';
import MensajeWhatsApp from '../componentes/MensajeWhatsApp';
import { buildTutorWhatsAppMessage } from '../utilidades/whatsapp';

export default function DetalleTutor() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [reserva, setReserva] = useState({ subjectId: '', scheduledAt: '', notes: '' });
  const [errorReserva, setErrorReserva] = useState('');
  const [exitoReserva, setExitoReserva] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.get(`/tutors/${id}`).then((res) => setTutor(res.data)).catch(console.error).finally(() => setCargando(false));
  }, [id]);

  const handleChange = (e) => {
    setReserva((r) => ({ ...r, [e.target.name]: e.target.value }));
  };

  const handleReservar = async (e) => {
    e.preventDefault();
    setErrorReserva('');
    setExitoReserva(false);
    setEnviando(true);
    try {
      await api.post('/sessions', {
        tutorId: Number(id),
        subjectId: Number(reserva.subjectId),
        scheduledAt: new Date(reserva.scheduledAt).toISOString(),
        notes: reserva.notes || undefined,
      });
      setExitoReserva(true);
      setReserva({ subjectId: '', scheduledAt: '', notes: '' });
    } catch (err) {
      console.error(err);
      setErrorReserva('No se pudo agendar la sesión. Verifica los datos e intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Cargando perfil…</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="empty-state">
        <p>Tutor no encontrado.</p>
        <Link to="/tutors" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Volver a tutores</Link>
      </div>
    );
  }

  const puedeReservar = user?.role === 'STUDENT';
  const materiaSeleccionada = tutor.subjects?.find((s) => String(s.id) === String(reserva.subjectId));
  const mensajeWhatsApp = buildTutorWhatsAppMessage({
    studentName: user?.name,
    tutorName: tutor.name,
    subjectName: materiaSeleccionada?.name,
  });

  return (
    <>
      <header className="page-header">
        <Link to="/tutors" className="card-meta" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>← Volver a tutores</Link>
        <h1>{tutor.name}</h1>
        <p>{tutor.email}</p>
      </header>

      <div className="detail-layout">
        <section className="card">
          <h2>Materias y tarifas</h2>
          {!tutor.subjects?.length ? (
            <p className="card-meta">Este tutor aún no tiene materias asignadas.</p>
          ) : (
            <ul className="subject-list">
              {tutor.subjects.map((ts) => (
                <li key={ts.id}>
                  <span>{ts.name}</span>
                  {ts.TutorSubject && (
                    <span className="subject-rate">${ts.TutorSubject.hourlyRate}/hora</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {puedeReservar && tutor.subjects?.length > 0 && (
          <aside className="card">
            <h2>Agendar sesión</h2>
            {exitoReserva && (
              <div className="alert alert-success" role="status">
                Sesión solicitada correctamente. <Link to="/sessions">Ver mis sesiones</Link>
              </div>
            )}
            {errorReserva && <div className="alert alert-error" role="alert">{errorReserva}</div>}
            <form onSubmit={handleReservar}>
              <div className="form-group">
                <label htmlFor="subjectId">Materia</label>
                <select id="subjectId" className="select" name="subjectId" value={reserva.subjectId} onChange={handleChange} required>
                  <option value="">Selecciona una materia</option>
                  {tutor.subjects.map((ts) => (
                    <option key={ts.id} value={ts.id}>{ts.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="scheduledAt">Fecha y hora</label>
                <input id="scheduledAt" className="input" type="datetime-local" name="scheduledAt" value={reserva.scheduledAt} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notas (opcional)</label>
                <textarea id="notes" className="textarea" name="notes" value={reserva.notes} onChange={handleChange} placeholder="Tema a repasar, dudas…" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={enviando}>
                {enviando ? 'Agendando…' : 'Solicitar sesión'}
              </button>
            </form>
          </aside>
        )}

        {puedeReservar && !tutor.subjects?.length && (
          <aside className="card">
            <p className="card-meta">Este tutor aún no puede recibir reservas.</p>
          </aside>
        )}

        {!user && (
          <aside className="card">
            <h2>¿Quieres agendar?</h2>
            <p className="card-meta" style={{ marginBottom: '1rem' }}>Inicia sesión como estudiante para reservar una sesión con este tutor.</p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Iniciar sesión</Link>
          </aside>
        )}

        <aside className="card">
          <MensajeWhatsApp
            phone={tutor.phone}
            recipientName={tutor.name}
            defaultMessage={mensajeWhatsApp}
            hint="Este tutor aún no registró su número de WhatsApp."
          />
        </aside>
      </div>
    </>
  );
}
