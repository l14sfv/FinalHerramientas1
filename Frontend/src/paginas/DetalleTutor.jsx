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
  const [subjects, setSubjects] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [reserva, setReserva] = useState({ subjectId: '', scheduledAt: '', notes: '' });
  const [errorReserva, setErrorReserva] = useState('');
  const [exitoReserva, setExitoReserva] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [asignacion, setAsignacion] = useState({ subjectId: '', hourlyRate: '' });
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const cargarTutor = () => {
    setCargando(true);
    api.get(`/tutors/${id}`)
      .then((res) => setTutor(res.data))
      .catch(console.error)
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarTutor();
    api.get('/subjects').then((res) => setSubjects(res.data)).catch(console.error);
  }, [id]);

  const puedeAsignar =
    user &&
    (user.role === 'ADMIN' || (user.role === 'TUTOR' && String(user.id) === String(id)));
  const puedeReservar = user?.role === 'STUDENT';

  const materiaSeleccionada = tutor?.subjects?.find(
    (s) => String(s.id) === String(reserva.subjectId)
  );

  const materiasDisponibles = subjects.filter(
    (subject) => !tutor?.subjects?.some((ts) => ts.id === subject.id)
  );

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

  const handleAsignacionChange = (e) => {
    setAsignacion((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAsignar = async (e) => {
    e.preventDefault();
    setAssignError('');
    setAssignSuccess('');
    setAssignLoading(true);
    try {
      await api.post(`/tutors/${id}/subjects`, {
        subjectId: Number(asignacion.subjectId),
        hourlyRate: Number(asignacion.hourlyRate),
      });
      setAssignSuccess('Materia asignada correctamente.');
      setAsignacion({ subjectId: '', hourlyRate: '' });
      cargarTutor();
    } catch (err) {
      console.error(err);
      setAssignError(err.response?.data?.message || 'No se pudo asignar la materia.');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoverMateria = async (subjectId) => {
    setAssignError('');
    setAssignSuccess('');
    setRemoveLoading(true);
    try {
      await api.delete(`/tutors/${id}/subjects/${subjectId}`);
      setAssignSuccess('Materia removida correctamente.');
      cargarTutor();
    } catch (err) {
      console.error(err);
      setAssignError(err.response?.data?.message || 'No se pudo remover la materia.');
    } finally {
      setRemoveLoading(false);
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
                  <div>
                    <strong>{ts.name}</strong>
                    {ts.description && <p className="subject-description">{ts.description}</p>}
                  </div>
                  <div className="subject-meta">
                    {ts.TutorSubject && (
                      <span className="subject-rate">${ts.TutorSubject.hourlyRate}/hora</span>
                    )}
                    {puedeAsignar && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-small"
                        onClick={() => handleRemoverMateria(ts.id)}
                        disabled={removeLoading}
                      >
                        {removeLoading ? 'Removiendo…' : 'Remover'}
                      </button>
                    )}
                  </div>
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

        {puedeAsignar && (
          <aside className="card">
            <h2>Asignar materia</h2>
            {assignSuccess && <div className="alert alert-success">{assignSuccess}</div>}
            {assignError && <div className="alert alert-error">{assignError}</div>}
            <form onSubmit={handleAsignar}>
              <div className="form-group">
                <label htmlFor="assign-subject">Materia</label>
                <select
                  id="assign-subject"
                  className="select"
                  name="subjectId"
                  value={asignacion.subjectId}
                  onChange={handleAsignacionChange}
                  required
                >
                  <option value="">Selecciona una materia</option>
                  {materiasDisponibles.length > 0 ? (
                    materiasDisponibles.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hay materias disponibles para asignar
                    </option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="hourlyRate">Precio por hora</label>
                <input
                  id="hourlyRate"
                  className="input"
                  type="number"
                  step="0.01"
                  name="hourlyRate"
                  value={asignacion.hourlyRate}
                  onChange={handleAsignacionChange}
                  placeholder="Ej. 25"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={assignLoading || materiasDisponibles.length === 0}>
                {assignLoading ? 'Asignando…' : 'Asignar materia'}
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
