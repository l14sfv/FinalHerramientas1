import { useEffect, useState } from 'react';
import api from '../api/cliente';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { useToast } from '../contextos/ContextoNotificaciones';

export default function Materias() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [materias, setMaterias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const puedeCrear = user && (user.role === 'ADMIN' || user.role === 'TUTOR');

  const cargarMaterias = () => {
    setCargando(true);
    setError('');
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
      const { data } = await api.post('/subjects', {
        name: nombre.trim(),
        description: descripcion.trim() || undefined,
      });
      const materia = data.materia || data;
      setMaterias((prev) => [...prev, materia]);
      setNombre('');
      setDescripcion('');
      addToast(`Materia "${materia.name}" creada correctamente.`, 'success');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'No se pudo crear la materia.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setEnviando(false);
    }
  };

  const iniciarEdicion = (materia) => {
    setEditandoId(materia.id);
    setEditNombre(materia.name);
    setEditDescripcion(materia.description || '');
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditNombre('');
    setEditDescripcion('');
  };

  const guardarEdicion = async (id) => {
    if (!editNombre.trim()) return;
    setEditLoading(true);
    setError('');
    try {
      const { data } = await api.put(`/subjects/${id}`, {
        name: editNombre.trim(),
        description: editDescripcion.trim() || null,
      });
      const materiaActualizada = data.materia || data;
      setMaterias((prev) => prev.map((m) => (m.id === materiaActualizada.id ? materiaActualizada : m)));
      addToast(`Materia "${materiaActualizada.name}" actualizada correctamente.`, 'success');
      cancelarEdicion();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'No se pudo actualizar la materia.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setEditLoading(false);
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
            <div className="form-group">
              <label htmlFor="descripcion-materia">Descripción</label>
              <textarea
                id="descripcion-materia"
                className="textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe brevemente la materia"
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
          {materias.map((materia) => (
            <article key={materia.id} className="card">
              {editandoId === materia.id ? (
                <>
                  <div className="form-group">
                    <label htmlFor={`edit-name-${materia.id}`}>Nombre</label>
                    <input
                      id={`edit-name-${materia.id}`}
                      className="input"
                      type="text"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`edit-description-${materia.id}`}>Descripción</label>
                    <textarea
                      id={`edit-description-${materia.id}`}
                      className="textarea"
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                    />
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-secondary" type="button" onClick={cancelarEdicion} disabled={editLoading}>
                      Cancelar
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => guardarEdicion(materia.id)}
                      disabled={editLoading}
                    >
                      {editLoading ? 'Guardando…' : 'Guardar'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="card-title">{materia.name}</div>
                  {materia.description ? (
                    <p className="card-meta">{materia.description}</p>
                  ) : (
                    <p className="card-meta">Sin descripción</p>
                  )}
                  {puedeCrear && (
                    <div className="card-actions">
                      <button className="btn btn-secondary" type="button" onClick={() => iniciarEdicion(materia)}>
                        Editar
                      </button>
                    </div>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
