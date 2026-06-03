import { Link } from 'react-router-dom';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { buildWhatsAppUrl, WHATSAPP_SOPORTE } from '../utilidades/whatsapp';

const MENSAJE_SOPORTE = 'Hola, necesito ayuda con la Plataforma de Tutorías.';

export default function PiePagina() {
  const { user } = useAuth();
  const urlSoporte = WHATSAPP_SOPORTE
    ? buildWhatsAppUrl(WHATSAPP_SOPORTE, MENSAJE_SOPORTE)
    : null;
  const anio = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link to="/" className="navbar-brand">
            <span className="navbar-brand-icon" aria-hidden="true">T</span>
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
            {urlSoporte ? (
              <a
                href={urlSoporte}
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
        <p>© {anio} Plataforma de Tutorías. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
