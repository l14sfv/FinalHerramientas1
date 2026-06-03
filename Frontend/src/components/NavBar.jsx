import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../utils/labels';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon" aria-hidden="true">
            T
          </span>
          Tutoría
        </Link>

        <nav className="navbar-links" aria-label="Principal">
          <NavLink to="/" className="nav-link" end>
            Inicio
          </NavLink>
          <NavLink to="/tutors" className="nav-link">
            Tutores
          </NavLink>
          {user && (
            <NavLink to="/sessions" className="nav-link">
              Mis sesiones
            </NavLink>
          )}
        </nav>

        <div className="navbar-user">
          {user ? (
            <>
              <span className="user-pill">
                {user.name}
                <span className={`badge badge-role`}>
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
