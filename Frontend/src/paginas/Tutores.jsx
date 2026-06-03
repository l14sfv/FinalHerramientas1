import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/cliente';

export default function Tutores() {
  const [tutores, setTutores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [materiaId, setMateriaId] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/subjects').then((res) => setMaterias(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setCargando(true);
    setError('');
    const params = materiaId ? { subjectId: materiaId } : {};
    api
      .get('/tutors', { params })
      .then((res) => setTutores(res.data))
      .catch(() => setError('No se pudieron cargar los tutores'))
      .finally(() => setCargando(false));
  }, [materiaId]);

  return (
    <>
      <header className="page-header">
        <h1>Tutores disponibles</h1>
        <p>Explora perfiles y encuentra el experto ideal para tu materia.</p>
      </header>

      <div className="filter-bar">
        <div className="form-group">
          <label htmlFor="subject-filter">Filtrar por materia</label>
          <select id="subject-filter" className="select" value={materiaId} onChange={(e) => setMateriaId(e.target.value)}>
            <option value="">Todas las materias</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {cargando && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Cargando tutores…</p>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!cargando && !error && tutores.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">👤</div>
          <p>No hay tutores registrados{materiaId ? ' para esta materia' : ''}.</p>
        </div>
      )}

      {!cargando && tutores.length > 0 && (
        <div className="card-grid">
          {tutores.map((t) => (
            <Link key={t.id} to={`/tutors/${t.id}`} className="card card-link">
              <div className="card-title">{t.name}</div>
              {t.subjects?.length > 0 ? (
                <p className="card-meta">{t.subjects.map((s) => s.name).join(' · ')}</p>
              ) : (
                <p className="card-meta">Sin materias asignadas</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
