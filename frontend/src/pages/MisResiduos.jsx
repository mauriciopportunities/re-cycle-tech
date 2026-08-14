import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MisResiduos.css';

const MisResiduos = () => {
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    tipo: '',
    descripcion: ''
  });

  const token = localStorage.getItem('token');

  const fetchMisResiduos = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/residuos/mis-residuos',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setResiduos(response.data);
    } catch (err) {
      setError('Error al cargar tus residuos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMisResiduos();
  }, []);

  const iniciarEdicion = (residuo) => {
    setEditandoId(residuo.id);
    setFormEdit({
      tipo: residuo.tipo,
      descripcion: residuo.descripcion || ''
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormEdit({ tipo: '', descripcion: '' });
  };

  const guardarEdicion = async (residuoId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/residuos/${residuoId}`,
        {
          tipo: formEdit.tipo,
          descripcion: formEdit.descripcion,
          latitud: null,
          longitud: null
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMensaje('✅ Residuo actualizado correctamente');
      setEditandoId(null);
      fetchMisResiduos();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar residuo');
      setTimeout(() => setError(''), 3000);
    }
  };

  const eliminarResiduo = async (residuoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este residuo?')) return;
    
    try {
      await axios.delete(
        `http://localhost:8000/api/residuos/${residuoId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMensaje('✅ Residuo eliminado correctamente');
      fetchMisResiduos();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar residuo');
      setTimeout(() => setError(''), 3000);
    }
  };

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

  if (loading) return <div className="cargando">⏳ Cargando tus residuos...</div>;
  if (error && !mensaje) return <div className="error">{error}</div>;

  return (
    <div className="mis-residuos-container">
      <h2>📦 Mis Residuos</h2>
      
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      {error && <div className="mensaje-error">{error}</div>}

      {residuos.length === 0 ? (
        <div className="sin-residuos">
          <p>No tienes residuos registrados.</p>
          <Link to="/registrar" className="btn-registrar-nuevo">
            ➕ Registrar mi primer residuo
          </Link>
        </div>
      ) : (
        <div className="residuos-grid">
          {residuos.map(residuo => (
            <div key={residuo.id} className="residuo-card">
              <div className="residuo-card-header">
                <span className="residuo-icon">{getTipoIcon(residuo.tipo)}</span>
                <span className={`estado-badge estado-${residuo.estado.toLowerCase()}`}>
                  {residuo.estado.replace(/_/g, ' ')}
                </span>
              </div>
              
              {editandoId === residuo.id ? (
                <div className="editar-form">
                  <select
                    value={formEdit.tipo}
                    onChange={(e) => setFormEdit({...formEdit, tipo: e.target.value})}
                    className="edit-select"
                  >
                    <option value="LAPTOP">💻 Laptop</option>
                    <option value="SMARTPHONE">📱 Smartphone</option>
                    <option value="MONITOR">🖥️ Monitor</option>
                    <option value="PERIFERICO">🖱️ Periférico</option>
                    <option value="ELECTRODOMESTICO">🏠 Electrodoméstico</option>
                    <option value="BATERIA">🔋 Batería</option>
                    <option value="COMPONENTE">🔧 Componente</option>
                    <option value="CABLEADO">🔌 Cableado</option>
                    <option value="TELECOMUNICACIONES">📡 Telecomunicaciones</option>
                  </select>
                  <input
                    type="text"
                    value={formEdit.descripcion}
                    onChange={(e) => setFormEdit({...formEdit, descripcion: e.target.value})}
                    placeholder="Descripción"
                    className="edit-input"
                  />
                  <div className="edit-acciones">
                    <button onClick={() => guardarEdicion(residuo.id)} className="btn-guardar">
                      💾 Guardar
                    </button>
                    <button onClick={cancelarEdicion} className="btn-cancelar">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="residuo-card-body">
                    <h3>Residuo #{residuo.id}</h3>
                    <p className="residuo-descripcion">
                      {residuo.descripcion || 'Sin descripción'}
                    </p>
                    <p className="residuo-fecha">
                      📅 {new Date(residuo.fechaRegistro).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="residuo-card-footer">
                    <Link to={`/trazabilidad/${residuo.id}`} className="btn-trazabilidad">
                      🔍 Ver trazabilidad
                    </Link>
                    
                    {residuo.estado === 'REGISTRADO' && (
                      <div className="residuo-acciones">
                        <button 
                          onClick={() => iniciarEdicion(residuo)}
                          className="btn-accion-residuo btn-editar-residuo"
                          title="Editar residuo"
                        >
                          <span className="btn-icon">✏️</span>
                          <span className="btn-texto">Editar</span>
                        </button>
                        <button 
                          onClick={() => eliminarResiduo(residuo.id)}
                          className="btn-accion-residuo btn-eliminar-residuo"
                          title="Eliminar residuo"
                        >
                          <span className="btn-icon">🗑️</span>
                          <span className="btn-texto">Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisResiduos; 