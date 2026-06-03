import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import WhatsAppMessage from '../components/WhatsAppMessage';
import { buildTutorWhatsAppMessage } from '../utils/whatsapp';

export default function TutorDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    subjectId: '',
    scheduledAt: '',
    notes: '',
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/tutors/${id}`)
      .then((res) => setTutor(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookingChange = (e) => {
    setBooking((b) => ({ ...b, [e.target.name]: e.target.value }));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);
    setSubmitting(true);
    try {
      await api.post('/sessions', {
        tutorId: Number(id),
        subjectId: Number(booking.subjectId),
        scheduledAt: new Date(booking.scheduledAt).toISOString(),
        notes: booking.notes || undefined,
      });
      setBookingSuccess(true);
      setBooking({ subjectId: '', scheduledAt: '', notes: '' });
    } catch (err) {
      console.error(err);
      setBookingError('No se pudo agendar la sesión. Verifica los datos e intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
        <Link to="/tutors" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Volver a tutores
        </Link>
      </div>
    );
  }

  const canBook = user?.role === 'STUDENT';

  const selectedSubject = tutor.subjects?.find(
    (s) => String(s.id) === String(booking.subjectId)
  );

  const whatsappMessage = buildTutorWhatsAppMessage({
    studentName: user?.name,
    tutorName: tutor.name,
    subjectName: selectedSubject?.name,
  });

  return (
    <>
      <header className="page-header">
        <Link to="/tutors" className="card-meta" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
          ← Volver a tutores
        </Link>
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
                    <span className="subject-rate">
                      ${ts.TutorSubject.hourlyRate}/hora
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {canBook && tutor.subjects?.length > 0 && (
          <aside className="card">
            <h2>Agendar sesión</h2>
            {bookingSuccess && (
              <div className="alert alert-success" role="status">
                Sesión solicitada correctamente.{' '}
                <Link to="/sessions">Ver mis sesiones</Link>
              </div>
            )}
            {bookingError && (
              <div className="alert alert-error" role="alert">{bookingError}</div>
            )}
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label htmlFor="subjectId">Materia</label>
                <select
                  id="subjectId"
                  className="select"
                  name="subjectId"
                  value={booking.subjectId}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="">Selecciona una materia</option>
                  {tutor.subjects.map((ts) => (
                    <option key={ts.id} value={ts.id}>
                      {ts.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="scheduledAt">Fecha y hora</label>
                <input
                  id="scheduledAt"
                  className="input"
                  type="datetime-local"
                  name="scheduledAt"
                  value={booking.scheduledAt}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notas (opcional)</label>
                <textarea
                  id="notes"
                  className="textarea"
                  name="notes"
                  value={booking.notes}
                  onChange={handleBookingChange}
                  placeholder="Tema a repasar, dudas…"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Agendando…' : 'Solicitar sesión'}
              </button>
            </form>
          </aside>
        )}

        {canBook && !tutor.subjects?.length && (
          <aside className="card">
            <p className="card-meta">Este tutor aún no puede recibir reservas.</p>
          </aside>
        )}

        {!user && (
          <aside className="card">
            <h2>¿Quieres agendar?</h2>
            <p className="card-meta" style={{ marginBottom: '1rem' }}>
              Inicia sesión como estudiante para reservar una sesión con este tutor.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Iniciar sesión
            </Link>
          </aside>
        )}

        <aside className="card">
          <WhatsAppMessage
            phone={tutor.phone}
            recipientName={tutor.name}
            defaultMessage={whatsappMessage}
            hint="Este tutor aún no registró su número de WhatsApp."
          />
        </aside>
      </div>
    </>
  );
}
