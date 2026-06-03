import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buildWhatsAppUrl, SUPPORT_WHATSAPP } from '../utils/whatsapp';

const SUPPORT_MESSAGE = 'Hola, necesito ayuda con la Plataforma de Tutorías.';

export default function Footer() {
  const { user } = useAuth();
  const supportUrl = SUPPORT_WHATSAPP
    ? buildWhatsAppUrl(SUPPORT_WHATSAPP, SUPPORT_MESSAGE)
    : null;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link to="/" className="navbar-brand">
            <span className="navbar-brand-icon" aria-hidden="true">
              T
            </span>
            Tutoría
          </Link>
          <p className="site-footer-tagline">
            Conecta estudiantes y tutores. Agenda sesiones y comunícate al instante.
          </p>
        </div>

        <nav className="site-footer-nav" aria-label="Pie de página">
          <div className="site-footer-col">
            <h4>Plataforma</h4>
            <Link to="/">Inicio</Link>
            <Link to="/tutors">Tutores</Link>
            {user && <Link to="/sessions">Mis sesiones</Link>}
          </div>
          <div className="site-footer-col">
            <h4>Cuenta</h4>
            {user ? (
              <span className="site-footer-user">{user.name}</span>
            ) : (
              <>
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/register">Registrarse</Link>
              </>
            )}
          </div>
          <div className="site-footer-col">
            <h4>Contacto</h4>
            {supportUrl ? (
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-whatsapp"
              >
                Soporte por WhatsApp
              </a>
            ) : (
              <span className="card-meta">Soporte: configura VITE_WHATSAPP_SUPPORT</span>
            )}
          </div>
        </nav>
      </div>

      <div className="site-footer-bottom">
        <p>© {year} Plataforma de Tutorías. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
