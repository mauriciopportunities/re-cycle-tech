import axios from 'axios';
import { useEffect, useState } from 'react';

const Trazabilidad = ({ residuoId }) => {
  const [trazabilidad, setTrazabilidad] = useState([]);
  const [residuo, setResiduo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const estados = [
    'REGISTRADO',
    'PENDIENTE_ENTREGA',
    'RECIBIDO_EN_CENTRO',
    'CLASIFICADO',
    'DONADO',
    'RECICLADO',
    'REACONDICIONADO',
    'DESTRUCCION_SEGURA'
  ];

  const coloresEstados = {
    'REGISTRADO': '#3498db',
    'PENDIENTE_ENTREGA': '#f39c12',
    'RECIBIDO_EN_CENTRO': '#2ecc71',
    'CLASIFICADO': '#9b59b6',
    'DONADO': '#27ae60',
    'RECICLADO': '#1abc9c',
    'REACONDICIONADO': '#2980b9',
    'DESTRUCCION_SEGURA': '#e74c3c'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        const token = localStorage.getItem('token');
        
        // Obtener detalles del residuo
        const residuoRes = await axios.get(
          `http://localhost:8000/api/residuos/${residuoId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setResiduo(residuoRes.data);

        // Obtener trazabilidad
        const trazaRes = await axios.get(
          `http://localhost:8000/api/trazabilidad/${residuoId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setTrazabilidad(trazaRes.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar la trazabilidad');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    if (residuoId) {
      fetchData();
    }
  }, [residuoId]);

  const handleCambiarEstado = async (e) => {
    e.preventDefault();
    if (!nuevoEstado) {
      setError('Selecciona un estado');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/trazabilidad/${residuoId}/estado`,
        null,
        {
          params: { nuevoEstado, observaciones },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // Refrescar datos
      const trazaRes = await axios.get(
        `http://localhost:8000/api/trazabilidad/${residuoId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setTrazabilidad(trazaRes.data);
      setNuevoEstado('');
      setObservaciones('');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar estado');
    }
  };

  const getEstadoIcono = (estado) => {
    const iconos = {
      'REGISTRADO': '📌',
      'PENDIENTE_ENTREGA': '⏳',
      'RECIBIDO_EN_CENTRO': '📦',
      'CLASIFICADO': '🔧',
      'DONADO': '🤝',
      'RECICLADO': '♻️',
      'REACONDICIONADO': '🔄',
      'DESTRUCCION_SEGURA': '🔥'
    };
    return iconos[estado] || '📌';
  };

  if (cargando) return <div className="cargando">Cargando trazabilidad...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trazabilidad-container">
      <h2>🔍 Trazabilidad del Residuo</h2>
      
      {residuo && (
        <div className="residuo-info">
          <p><strong>ID:</strong> #{residuo.id}</p>
          <p><strong>Tipo:</strong> {residuo.tipo}</p>
          <p><strong>Estado actual:</strong> 
            <span className="estado-actual" style={{ backgroundColor: coloresEstados[residuo.estado] }}>
              {getEstadoIcono(residuo.estado)} {residuo.estado}
            </span>
          </p>
          <p><strong>Descripción:</strong> {residuo.descripcion || 'Sin descripción'}</p>
          <p><strong>Fecha registro:</strong> {new Date(residuo.fechaRegistro).toLocaleString()}</p>
        </div>
      )}

      <div className="linea-tiempo">
        <h3>📋 Historial de cambios</h3>
        {trazabilidad.length === 0 ? (
          <p className="sin-registros">No hay registros de trazabilidad</p>
        ) : (
          trazabilidad.map((item) => (
            <div key={item.id} className="evento">
              <div className="evento-icono">
                {getEstadoIcono(item.estadoNuevo)}
              </div>
              <div className="evento-contenido">
                <div className="evento-estado" style={{ backgroundColor: coloresEstados[item.estadoNuevo] }}>
                  {item.estadoNuevo}
                </div>
                <div className="evento-detalle">
                  <span className="evento-fecha">{new Date(item.fechaCambio).toLocaleString()}</span>
                  {item.estadoAnterior && (
                    <span className="evento-transicion">
                      desde {item.estadoAnterior}
                    </span>
                  )}
                  {item.observaciones && (
                    <p className="evento-observaciones">📝 {item.observaciones}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario para cambiar estado (solo operadores) */}
      <div className="cambiar-estado">
        <h3>🔄 Cambiar estado del residuo</h3>
        <form onSubmit={handleCambiarEstado}>
          <select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
          >
            <option value="">Selecciona un estado</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Observaciones (opcional)"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
          <button type="submit" className="btn-cambiar-estado">
            Cambiar estado
          </button>
        </form>
        <p className="mensaje-inmutabilidad">
          🔒 <strong>Nota:</strong> El historial de trazabilidad es inmutable. Los cambios registrados no pueden ser modificados ni eliminados.
        </p>
      </div>
    </div>
  );
};

export default Trazabilidad; 