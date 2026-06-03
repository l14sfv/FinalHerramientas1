import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/cliente';

const ContextoAutenticacion = createContext(null);

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioStr = localStorage.getItem('user');

    if (token && usuarioStr) {
      setUsuario(JSON.parse(usuarioStr));
    }
    setCargando(false);
  }, []);

  const iniciarSesion = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUsuario(user);
    return user;
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsuario(null);
  };

  return (
    <ContextoAutenticacion.Provider
      value={{ user: usuario, loading: cargando, login: iniciarSesion, logout: cerrarSesion }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAuth() {
  return useContext(ContextoAutenticacion);
}
