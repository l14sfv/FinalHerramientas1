import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/cliente';
import { useToast } from '../contextos/ContextoNotificaciones';
import CampoWhatsApp from '../componentes/CampoWhatsApp';
import { combinarTelefono, INDICATIVO_POR_DEFECTO } from '../utilidades/indicativos';

export default function Registro() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [formulario, setFormulario] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    indicativo: INDICATIVO_POR_DEFECTO,
    numero: '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormulario((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    if (!formulario.name.trim() || !formulario.email.trim() || !formulario.password) {
      setError('Por favor completa todos los campos requeridos');
      setCargando(false);
      return;
    }

    if (formulario.password !== formulario.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    if (formulario.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }

    const phone = combinarTelefono(formulario.indicativo, formulario.numero);
    const payload = {
      name: formulario.name.trim(),
      email: formulario.email.trim(),
      password: formulario.password,
      phone: phone || null,
    };

    try {
      const { data } = await api.post('/auth/register', payload);
      const msg = data.message || `¡Bienvenido ${data.name}! Ya puedes iniciar sesión.`;
      addToast(msg, 'success');
      navigate('/login');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        (err.request
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté en marcha.'
          : 'No se pudo crear la cuenta. El email podría estar en uso.');
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-card">
      <header className="page-header" style={{ textAlign: 'center' }}>
        <h1>✨ Crear cuenta</h1>
        <p>Únete a Planora y empieza a organizar tus tareas</p>
      </header>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre completo</label>
          <input
            id="name"
            className="input"
            type="text"
            name="name"
            value={formulario.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Tu nombre"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            name="email"
            value={formulario.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="tu@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="input"
            type="password"
            name="password"
            value={formulario.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordConfirm">Confirmar contraseña</label>
          <input
            id="passwordConfirm"
            className="input"
            type="password"
            name="passwordConfirm"
            value={formulario.passwordConfirm}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
          />
        </div>
        <div className="form-group">
          <label>WhatsApp (opcional)</label>
          <CampoWhatsApp
            idPrefix="registro"
            indicativo={formulario.indicativo}
            numero={formulario.numero}
            onIndicativoChange={(v) => setFormulario((f) => ({ ...f, indicativo: v }))}
            onNumeroChange={(v) => setFormulario((f) => ({ ...f, numero: v }))}
            required={false}
          />
          <p className="card-meta" style={{ marginTop: '0.4rem' }}>
            Nos ayuda a contactarte si es necesario
          </p>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={cargando}>
          {cargando ? '⏳ Creando cuenta…' : '🚀 Crear cuenta'}
        </button>
      </form>

      <p className="auth-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}

