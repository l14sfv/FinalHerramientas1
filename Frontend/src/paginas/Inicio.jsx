import { Link } from 'react-router-dom';
import { useAuth } from '../contextos/ContextoAutenticacion';

export default function Inicio() {
  const { user } = useAuth();

  return (
    <>
      <section className="hero">
        <h1>Aprende con los mejores tutores</h1>
        <p>
          Conecta con expertos en cada materia, agenda sesiones a tu medida y
          gestiona tus tutorías desde un solo lugar.
        </p>
        <div className="hero-actions">
          <Link to="/tutors" className="btn btn-primary">Explorar tutores</Link>
          {user ? (
            <Link to="/sessions" className="btn btn-secondary">Ver mis sesiones</Link>
          ) : (
            <Link to="/register" className="btn btn-secondary">Crear cuenta gratis</Link>
          )}
        </div>
      </section>

      <div className="features">
        <article className="card feature-card">
          <div className="feature-icon" aria-hidden="true">📚</div>
          <h3>Materias variadas</h3>
          <p className="card-meta">Encuentra tutores especializados en la asignatura que necesitas.</p>
        </article>
        <article className="card feature-card">
          <div className="feature-icon" aria-hidden="true">💰</div>
          <h3>Tarifas transparentes</h3>
          <p className="card-meta">Consulta el precio por hora de cada tutor antes de agendar.</p>
        </article>
        <article className="card feature-card">
          <div className="feature-icon" aria-hidden="true">📅</div>
          <h3>Sesiones organizadas</h3>
          <p className="card-meta">Agenda, confirma y da seguimiento al estado de cada sesión.</p>
        </article>
      </div>
    </>
  );
}
