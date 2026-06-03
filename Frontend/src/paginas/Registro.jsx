import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/cliente';
import { useToast } from '../contextos/ContextoNotificaciones';

export default function Registro() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [formulario, setFormulario] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STUDENT',
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
    try {
      const { data } = await api.post('/auth/register', formulario);
      const msg = data.message || `Cuenta creada para ${data.name}. Ya puedes iniciar sesión.`;
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
        <h1>Crear cuenta</h1>
        <p>Únete como estudiante o tutor</p>
      </header>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre completo</label>
          <input id="name" className="input" type="text" name="name" value={formulario.name} onChange={handleChange} required autoComplete="name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" name="email" value={formulario.email} onChange={handleChange} required autoComplete="email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input id="password" className="input" type="password" name="password" value={formulario.password} onChange={handleChange} required autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label htmlFor="role">Quiero registrarme como</label>
          <select id="role" className="select" name="role" value={formulario.role} onChange={handleChange}>
            <option value="STUDENT">Estudiante</option>
            <option value="TUTOR">Tutor</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="phone">WhatsApp {formulario.role === 'TUTOR' ? '(obligatorio)' : '(opcional)'}</label>
          <input id="phone" className="input" type="tel" name="phone" value={formulario.phone} onChange={handleChange} required={formulario.role === 'TUTOR'} placeholder="Ej. 573001234567" autoComplete="tel" />
          <p className="card-meta" style={{ marginTop: '0.35rem', marginBottom: 0 }}>Incluye código de país, sin espacios ni símbolos.</p>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={cargando}>
          {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
