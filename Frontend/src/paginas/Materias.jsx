import { useEffect, useState } from 'react';
import api from '../api/cliente';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { useToast } from '../contextos/ContextoNotificaciones';

export default function Materias() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [materias, setMaterias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const puedeCrear = user && (user.role === 'ADMIN' || user.role === 'TUTOR');

  const cargarMaterias = () => {
    setCargando(true);
    api
      .get('/subjects')
      .then((res) => setMaterias(res.data))
      .catch(() => setError('No se pudieron cargar las materias'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!puedeCrear) return;
    setEnviando(true);
    setError('');
    try {
      const { data } = await api.post('/subjects', { name: nombre.trim() });
      setMaterias((prev) => [...prev, data]);
      setNombre('');
      addToast(`Materia "${data.name}" creada correctamente.`, 'success');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'No se pudo crear la materia.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1>Materias</h1>
        <p>Consulta las asignaturas disponibles en la plataforma.</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {puedeCrear && (
        <section className="card" style={{ marginBottom: '1.5rem', maxWidth: '480px' }}>
          <h2>Nueva materia</h2>
          <p className="card-meta" style={{ marginBottom: '1rem' }}>
            Agrega una asignatura para que los tutores puedan ofrecerla.
          </p>
          <form onSubmit={handleCrear}>
            <div className="form-group">
              <label htmlFor="nombre-materia">Nombre de la materia</label>
              <input
                id="nombre-materia"
                className="input"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Matemáticas, Física…"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando ? 'Creando…' : 'Crear materia'}
            </button>
          </form>
        </section>
      )}

      {!user && (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          Inicia sesión como tutor o administrador para crear nuevas materias.
        </div>
      )}

      {cargando && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Cargando materias…</p>
        </div>
      )}

      {!cargando && materias.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">📚</div>
          <p>Aún no hay materias registradas.</p>
        </div>
      )}

      {!cargando && materias.length > 0 && (
        <div className="card-grid">
          {materias.map((m) => (
            <article key={m.id} className="card">
              <div className="card-title">{m.name}</div>
              <p className="card-meta">ID: {m.id}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
