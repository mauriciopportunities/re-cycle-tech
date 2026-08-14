import axios from 'axios';
import { useEffect, useState } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [centros, setCentros] = useState([]);
  const [residuosTotales, setResiduosTotales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  // Estados para CRUD de centros
  const [mostrarFormularioCentro, setMostrarFormularioCentro] = useState(false);
  const [editandoCentro, setEditandoCentro] = useState(null);
  const [centroForm, setCentroForm] = useState({
    nombre: '',
    direccion: '',
    latitud: '',
    longitud: '',
    telefono: '',
    horario: '',
    capacidad: ''
  });

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (rol !== 'ADMIN') {
      window.location.href = '/';
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, centrosRes, residuosRes] = await Promise.all([
          axios.get('http://localhost:8000/api/admin/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/centros', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/residuos/todos', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        setUsuarios(usersRes.data);
        setCentros(centrosRes.data);
        setResiduosTotales(residuosRes.data.length);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, rol]);

  const cambiarRol = async (usuarioId, nuevoRol) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/usuarios/${usuarioId}/rol`,
        { rol: nuevoRol },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const response = await axios.get('http://localhost:8000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsuarios(response.data);
      setMensaje('✅ Rol actualizado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError('Error al cambiar rol');
    }
  };

  const eliminarUsuario = async (usuarioId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await axios.delete(
        `http://localhost:8000/api/admin/usuarios/${usuarioId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const response = await axios.get('http://localhost:8000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsuarios(response.data);
      setMensaje('✅ Usuario eliminado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  // ============ CRUD DE CENTROS ============

  const handleCentroChange = (e) => {
    setCentroForm({
      ...centroForm,
      [e.target.name]: e.target.value
    });
  };

  const abrirFormularioCrear = () => {
    setCentroForm({
      nombre: '',
      direccion: '',
      latitud: '',
      longitud: '',
      telefono: '',
      horario: '',
      capacidad: ''
    });
    setEditandoCentro(null);
    setMostrarFormularioCentro(true);
  };

  const abrirFormularioEditar = (centro) => {
    setCentroForm({
      nombre: centro.nombre,
      direccion: centro.direccion,
      latitud: centro.latitud,
      longitud: centro.longitud,
      telefono: centro.telefono || '',
      horario: centro.horario || '',
      capacidad: centro.capacidad || ''
    });
    setEditandoCentro(centro.id);
    setMostrarFormularioCentro(true);
  };

  const cerrarFormularioCentro = () => {
    setMostrarFormularioCentro(false);
    setEditandoCentro(null);
  };

  const guardarCentro = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!centroForm.nombre || !centroForm.direccion) {
      setError('❌ Nombre y dirección son obligatorios');
      return;
    }
    if (!centroForm.latitud || !centroForm.longitud) {
      setError('❌ Latitud y longitud son obligatorias');
      return;
    }
    
    // Validaciones de coordenadas (FASE 4)
    const lat = parseFloat(centroForm.latitud);
    const lng = parseFloat(centroForm.longitud);
    
    if (lat < -90 || lat > 90) {
      setError('❌ Latitud debe estar entre -90 y 90');
      return;
    }
    if (lng < -180 || lng > 180) {
      setError('❌ Longitud debe estar entre -180 y 180');
      return;
    }

    const datosCentro = {
      nombre: centroForm.nombre,
      direccion: centroForm.direccion,
      latitud: lat,
      longitud: lng,
      telefono: centroForm.telefono || null,
      horario: centroForm.horario || null,
      capacidad: centroForm.capacidad || null
    };

    try {
      if (editandoCentro) {
        // Actualizar centro existente
        await axios.put(
          `http://localhost:8000/api/centros/${editandoCentro}`,
          datosCentro,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setMensaje('✅ Centro actualizado correctamente');
      } else {
        // Crear centro nuevo
        await axios.post(
          'http://localhost:8000/api/centros',
          datosCentro,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setMensaje('✅ Centro creado correctamente');
      }

      // Recargar centros
      const response = await axios.get('http://localhost:8000/api/centros');
      setCentros(response.data);
      
      setMostrarFormularioCentro(false);
      setEditandoCentro(null);
      setError('');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError('❌ Error al guardar centro');
    }
  };

  const eliminarCentro = async (centroId) => {
    if (!window.confirm('¿Estás seguro de eliminar este centro?')) return;
    
    try {
      await axios.delete(
        `http://localhost:8000/api/centros/${centroId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const response = await axios.get('http://localhost:8000/api/centros');
      setCentros(response.data);
      setMensaje('✅ Centro eliminado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError('❌ Error al eliminar centro');
    }
  };

  if (loading) return <div className="admin-loading">⏳ Cargando panel de administración...</div>;
  if (error && !mensaje) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-panel">
      <h2>👥 Panel de Administración</h2>
      
      {mensaje && <div className="admin-mensaje-exito">{mensaje}</div>}
      {error && <div className="admin-mensaje-error">{error}</div>}

      {/* Estadísticas */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{usuarios.length}</span>
          <span className="stat-label">Usuarios registrados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{centros.length}</span>
          <span className="stat-label">Centros de acopio</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{residuosTotales}</span>
          <span className="stat-label">Residuos totales</span>
        </div>
      </div>

      {/* Gestión de usuarios */}
      <h3>📋 Usuarios registrados</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.rol.toLowerCase()}`}>
                    {user.rol}
                  </span>
                </td>
                <td>
                  <select 
                    onChange={(e) => cambiarRol(user.id, e.target.value)}
                    defaultValue={user.rol}
                    className="role-select"
                  >
                    <option value="CIUDADANO">Ciudadano</option>
                    <option value="OPERADOR_CENTRO">Operador Centro</option>
                    <option value="OPERADOR_TECNICO">Operador Técnico</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                  <button 
                    onClick={() => eliminarUsuario(user.id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Centros de acopio */}
      <div className="admin-centros-section">
        <h3>📍 Centros de acopio</h3>
        
        <button onClick={abrirFormularioCrear} className="btn-crear-centro">
          ➕ Crear Centro
        </button>

        {mostrarFormularioCentro && (
          <div className="formulario-centro">
            <h4>{editandoCentro ? '✏️ Editar Centro' : '➕ Crear Centro'}</h4>
            <form onSubmit={guardarCentro}>
              <div className="form-grid">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del centro"
                  value={centroForm.nombre}
                  onChange={handleCentroChange}
                  required
                />
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={centroForm.direccion}
                  onChange={handleCentroChange}
                  required
                />
                <input
                  type="number"
                  name="latitud"
                  placeholder="Latitud (-90 a 90)"
                  value={centroForm.latitud}
                  onChange={handleCentroChange}
                  step="0.0001"
                  required
                />
                <input
                  type="number"
                  name="longitud"
                  placeholder="Longitud (-180 a 180)"
                  value={centroForm.longitud}
                  onChange={handleCentroChange}
                  step="0.0001"
                  required
                />
                <input
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  value={centroForm.telefono}
                  onChange={handleCentroChange}
                />
                <input
                  type="text"
                  name="horario"
                  placeholder="Horario"
                  value={centroForm.horario}
                  onChange={handleCentroChange}
                />
                <input
                  type="text"
                  name="capacidad"
                  placeholder="Capacidad"
                  value={centroForm.capacidad}
                  onChange={handleCentroChange}
                />
              </div>
              <div className="form-acciones">
                <button type="submit" className="btn-guardar-centro">
                  💾 Guardar
                </button>
                <button type="button" onClick={cerrarFormularioCentro} className="btn-cancelar">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Capacidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {centros.map(centro => (
                <tr key={centro.id}>
                  <td>{centro.id}</td>
                  <td>{centro.nombre}</td>
                  <td>{centro.direccion}</td>
                  <td>{centro.capacidad}</td>
                  <td>
                    <div className="acciones-centro">
                      <button 
                        onClick={() => abrirFormularioEditar(centro)}
                        className="btn-accion btn-editar"
                        title="Editar centro"
                      >
                        <span className="btn-icon">✏️</span>
                        <span className="btn-texto">Editar</span>
                      </button>
                      <button 
                        onClick={() => eliminarCentro(centro.id)}
                        className="btn-accion btn-eliminar"
                        title="Eliminar centro"
                      >
                        <span className="btn-icon">🗑️</span>
                        <span className="btn-texto">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 