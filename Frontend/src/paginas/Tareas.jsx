import { useState, useEffect } from 'react';
import { useAuth } from '../contextos/ContextoAutenticacion';
import { useToast } from '../contextos/ContextoNotificaciones';
import api from '../api/cliente';
import '../estilos/Tareas.css';

const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];
const ESTADO_LABEL = {
  PENDIENTE:   '📝 Por Hacer',
  EN_PROGRESO: '⏳ En Progreso',
  COMPLETADA:  '✅ Completadas',
};
const COLOR_PRIORIDAD = { ALTA: '#ef4444', MEDIA: '#f59e0b', BAJA: '#3b82f6' };

const formVacio = () => ({
  titulo: '',
  descripcion: '',
  prioridad: 'MEDIA',
  fechaVencimiento: '',
});

function Tareas() {
  const { user }     = useAuth();
  const { addToast } = useToast();

  const [tareas,            setTareas]            = useState([]);
  const [cargando,          setCargando]          = useState(true);
  const [busqueda,          setBusqueda]          = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando,          setEditando]          = useState(null);
  const [formData,          setFormData]          = useState(formVacio());

  // Carga tareas cuando cambia la búsqueda
  useEffect(() => {
    cargarTareas();
  }, [busqueda]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarTareas = async () => {
    try {
      setCargando(true);
      const params = {};
      if (busqueda.trim()) params.search = busqueda.trim();
      const { data } = await api.get('/tasks', { params });
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      addToast('Error al cargar tareas', 'error');
    } finally {
      setCargando(false);
    }
  };

  // ── CREAR / EDITAR ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) {
      addToast('El título es obligatorio', 'error');
      return;
    }

    // Bug 3 corregido: enviar null si la fecha está vacía
    const payload = {
      titulo:           formData.titulo.trim(),
      descripcion:      formData.descripcion.trim() || null,
      prioridad:        formData.prioridad,
      fechaVencimiento: formData.fechaVencimiento || null,
    };

    try {
      if (editando) {
        // Bug 1 corregido: usar PUT en vez de PATCH para actualizar
        await api.put(`/tasks/${editando.id}`, payload);
        addToast('Tarea actualizada correctamente', 'success');
      } else {
        await api.post('/tasks', payload);
        addToast('Tarea creada correctamente', 'success');
      }
      resetFormulario();
      cargarTareas();
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      addToast(error.response?.data?.message || error.response?.data?.error || 'Error al guardar tarea', 'error');
    }
  };

  const resetFormulario = () => {
    setFormData(formVacio());
    setEditando(null);
    setMostrarFormulario(false);
  };

  const handleEditar = (tarea) => {
    setEditando(tarea);
    setFormData({
      titulo:           tarea.titulo,
      descripcion:      tarea.descripcion || '',
      prioridad:        tarea.prioridad,
      fechaVencimiento: tarea.fechaVencimiento
        ? tarea.fechaVencimiento.split('T')[0]
        : '',
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      addToast('Tarea eliminada', 'success');
      cargarTareas();
    } catch (error) {
      console.error('Error al eliminar:', error);
      addToast(error.response?.data?.message || 'Error al eliminar', 'error');
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/tasks/${id}/status`, { estado: nuevoEstado });
      cargarTareas();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      addToast(error.response?.data?.message || 'Error al cambiar estado', 'error');
    }
  };

  // Bug 2 corregido: filtrar solo localmente para no duplicar lógica
  const obtenerTareasPorEstado = (estado) =>
    tareas.filter((t) => t.estado === estado);

  if (!user) return <div className="tareas-empty">Cargando...</div>;

  return (
    <div className="tareas-container">
      <div className="tareas-header">
        <h1>📋 Mi Tablero de Tareas</h1>
        <div className="tareas-header-acciones">
          <input
            type="text"
            placeholder="🔍 Buscar tareas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="tareas-busqueda-global"
          />
          <button
            className="btn-crear"
            onClick={() => { resetFormulario(); setMostrarFormulario(true); }}
          >
            + Nueva Tarea
          </button>
        </div>
      </div>

      {/* ── Modal formulario ───────────────────────────────────────────── */}
      {mostrarFormulario && (
        <div className="tareas-formulario-modal">
          <div className="tareas-formulario">
            <h2>{editando ? '✏️ Editar Tarea' : '✨ Nueva Tarea'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Título de la tarea *"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="form-control"
                required
                autoFocus
              />
              <textarea
                placeholder="Descripción (opcional)"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="form-control"
                rows="3"
              />
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                className="form-control"
              >
                <option value="BAJA">🔵 Prioridad Baja</option>
                <option value="MEDIA">🟡 Prioridad Media</option>
                <option value="ALTA">🔴 Prioridad Alta</option>
              </select>
              <label style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Fecha de vencimiento (opcional)
              </label>
              <input
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="form-control"
              />
              <div className="form-botones">
                <button type="submit" className="btn-guardar">
                  {editando ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={resetFormulario} className="btn-cancelar">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Tablero kanban ─────────────────────────────────────────────── */}
      {cargando ? (
        <div className="tareas-empty">⏳ Cargando tareas...</div>
      ) : (
        <div className="kanban-board">
          {ESTADOS.map((estado) => {
            const tareasEstado = obtenerTareasPorEstado(estado);
            return (
              <div key={estado} className="kanban-columna">
                <div className="kanban-header">
                  <h3>{ESTADO_LABEL[estado]}</h3>
                  <span className="kanban-count">{tareasEstado.length}</span>
                </div>
                <div className="kanban-tareas">
                  {tareasEstado.length === 0 ? (
                    <div className="kanban-vacio">Sin tareas</div>
                  ) : (
                    tareasEstado.map((tarea) => (
                      <div key={tarea.id} className="kanban-tarea">
                        <div
                          className="tarea-prioridad"
                          style={{ backgroundColor: COLOR_PRIORIDAD[tarea.prioridad] }}
                        />
                        <div className="tarea-contenido">
                          <h4>{tarea.titulo}</h4>
                          {tarea.descripcion && (
                            <p className="tarea-desc">{tarea.descripcion}</p>
                          )}
                          {tarea.fechaVencimiento && (
                            <span className="tarea-fecha">
                              📅 {new Date(tarea.fechaVencimiento).toLocaleDateString('es-CO')}
                            </span>
                          )}
                        </div>
                        <div className="tarea-controles">
                          {estado === 'PENDIENTE' && (
                            <button
                              onClick={() => handleCambiarEstado(tarea.id, 'EN_PROGRESO')}
                              className="btn-mini btn-progreso"
                              title="Comenzar"
                            >▶</button>
                          )}
                          {estado === 'EN_PROGRESO' && (
                            <button
                              onClick={() => handleCambiarEstado(tarea.id, 'COMPLETADA')}
                              className="btn-mini btn-completar"
                              title="Completar"
                            >✓</button>
                          )}
                          {estado !== 'PENDIENTE' && (
                            <button
                              onClick={() => handleCambiarEstado(tarea.id, 'PENDIENTE')}
                              className="btn-mini btn-retroceder"
                              title="Regresar a Pendiente"
                            >↶</button>
                          )}
                          <button
                            onClick={() => handleEditar(tarea)}
                            className="btn-mini btn-editar"
                            title="Editar"
                          >✎</button>
                          <button
                            onClick={() => handleEliminar(tarea.id)}
                            className="btn-mini btn-eliminar"
                            title="Eliminar"
                          >🗑</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tareas;
