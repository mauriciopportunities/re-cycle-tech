import axios from 'axios';
import { useEffect, useState } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (rol !== 'ADMIN') {
      window.location.href = '/';
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, centrosRes] = await Promise.all([
          axios.get('http://localhost:8000/api/admin/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/centros', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        setUsuarios(usersRes.data);
        setCentros(centrosRes.data);
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

  if (loading) return <div className="admin-loading">⏳ Cargando panel de administración...</div>;
  if (error) return <div className="admin-error">{error}</div>;

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
          <span className="stat-number">0</span>
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
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Capacidad</th>
              </tr>
            </thead>
            <tbody>
              {centros.map(centro => (
                <tr key={centro.id}>
                  <td>{centro.id}</td>
                  <td>{centro.nombre}</td>
                  <td>{centro.direccion}</td>
                  <td>{centro.capacidad}</td>
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