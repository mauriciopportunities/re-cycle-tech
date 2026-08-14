import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ListaResiduos.css';

const ListaResiduos = () => {
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResiduos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/residuos/todos',
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setResiduos(response.data);
      } catch (err) {
        setError('Error al cargar residuos');
      } finally {
        setLoading(false);
      }
    };
    fetchResiduos();
  }, []);

  const getTipoIcon = (tipo) => {
    const iconos = {
      'LAPTOP': '💻',
      'SMARTPHONE': '📱',
      'MONITOR': '🖥️',
      'PERIFERICO': '🖱️',
      'ELECTRODOMESTICO': '🏠',
      'BATERIA': '🔋',
      'COMPONENTE': '🔧',
      'CABLEADO': '🔌',
      'TELECOMUNICACIONES': '📡'
    };
    return iconos[tipo] || '📦';
  };

  const getIniciales = (nombre) => {
    if (!nombre) return '?';
    const partes = nombre.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  if (loading) return <div className="cargando">⏳ Cargando residuos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="lista-residuos-container">
      <div className="lista-residuos-header">
        <h2>📋 Todos los Residuos</h2>
        <div className="lista-residuos-stats">
          <span className="stat-badge">
            <span className="icon">📦</span>
            {residuos.length} residuos registrados
          </span>
          <span className="stat-badge">
            <span className="icon">♻️</span>
            {residuos.filter(r => ['DONADO', 'RECICLADO', 'REACONDICIONADO'].includes(r.estado)).length} procesados
          </span>
        </div>
      </div>
      
      {residuos.length === 0 ? (
        <p className="sin-registros">No hay residuos registrados</p>
      ) : (
        <table className="tabla-residuos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {residuos.map(residuo => (
              <tr key={residuo.id}>
                <td>
                  <span className="residuo-id">#{residuo.id}</span>
                </td>
                <td>
                  <div className="residuo-tipo">
                    <span className="tipo-icon">{getTipoIcon(residuo.tipo)}</span>
                    {residuo.tipo}
                  </div>
                </td>
                <td>
                  <span className={`estado-badge estado-${residuo.estado.toLowerCase()}`}>
                    {residuo.estado.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <div className="residuo-usuario">
                    <span className="usuario-avatar">
                      {getIniciales(residuo.usuarioNombre)}
                    </span>
                    <span className="usuario-nombre">{residuo.usuarioNombre || 'Sin asignar'}</span>
                  </div>
                </td>
                <td>
                  <span className="fecha-residuo">
                    {new Date(residuo.fechaRegistro).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <Link to={`/trazabilidad/${residuo.id}`} className="btn-ver-trazabilidad">
                    🔍 Ver trazabilidad
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaResiduos; 