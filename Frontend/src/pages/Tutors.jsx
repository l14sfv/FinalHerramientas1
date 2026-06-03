import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/subjects').then((res) => setSubjects(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = subjectId ? { subjectId } : {};
    api
      .get('/tutors', { params })
      .then((res) => setTutors(res.data))
      .catch(() => setError('No se pudieron cargar los tutores'))
      .finally(() => setLoading(false));
  }, [subjectId]);

  return (
    <>
      <header className="page-header">
        <h1>Tutores disponibles</h1>
        <p>Explora perfiles y encuentra el experto ideal para tu materia.</p>
      </header>

      <div className="filter-bar">
        <div className="form-group">
          <label htmlFor="subject-filter">Filtrar por materia</label>
          <select
            id="subject-filter"
            className="select"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Todas las materias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Cargando tutores…</p>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && tutors.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            👤
          </div>
          <p>No hay tutores registrados{subjectId ? ' para esta materia' : ''}.</p>
        </div>
      )}

      {!loading && tutors.length > 0 && (
        <div className="card-grid">
          {tutors.map((t) => (
            <Link key={t.id} to={`/tutors/${t.id}`} className="card card-link">
              <div className="card-title">{t.name}</div>
              {t.subjects?.length > 0 ? (
                <p className="card-meta">
                  {t.subjects.map((s) => s.name).join(' · ')}
                </p>
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
