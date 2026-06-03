import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('No se pudo crear la cuenta. El email podría estar en uso.');
    } finally {
      setLoading(false);
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
          <input
            id="name"
            className="input"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Quiero registrarme como</label>
          <select
            id="role"
            className="select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="STUDENT">Estudiante</option>
            <option value="TUTOR">Tutor</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="phone">
            WhatsApp {form.role === 'TUTOR' ? '(obligatorio)' : '(opcional)'}
          </label>
          <input
            id="phone"
            className="input"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required={form.role === 'TUTOR'}
            placeholder="Ej. 573001234567"
            autoComplete="tel"
          />
          <p className="card-meta" style={{ marginTop: '0.35rem', marginBottom: 0 }}>
            Incluye código de país, sin espacios ni símbolos.
          </p>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
