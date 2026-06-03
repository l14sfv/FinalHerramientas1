import { Routes, Route } from 'react-router-dom';
import BarraNavegacion from './componentes/BarraNavegacion';
import PiePagina from './componentes/PiePagina';
import RutaProtegida from './componentes/RutaProtegida';
import Inicio from './paginas/Inicio';
import IniciarSesion from './paginas/IniciarSesion';
import Registro from './paginas/Registro';
import Tutores from './paginas/Tutores';
import DetalleTutor from './paginas/DetalleTutor';
import Materias from './paginas/Materias';
import Perfil from './paginas/Perfil';
import Sesiones from './paginas/Sesiones';

function App() {
  return (
    <div className="app-shell">
      <BarraNavegacion />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tutors" element={<Tutores />} />
          <Route path="/tutors/:id" element={<DetalleTutor />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="/register" element={<Registro />} />
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            }
          />
          <Route
            path="/sessions"
            element={
              <RutaProtegida>
                <Sesiones />
              </RutaProtegida>
            }
          />
        </Routes>
      </main>
      <PiePagina />
    </div>
  );
}

export default App;
