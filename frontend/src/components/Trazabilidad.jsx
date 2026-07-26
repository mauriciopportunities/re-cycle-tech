import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Trazabilidad.css';

const Trazabilidad = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trazabilidad, setTrazabilidad] = useState([]); // ✅ Siempre un arreglo
  const [residuo, setResiduo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esOperador, setEsOperador] = useState(false);

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

  const iconosEstados = {
    'REGISTRADO': '📌',
    'PENDIENTE_ENTREGA': '⏳',
    'RECIBIDO_EN_CENTRO': '📦',
    'CLASIFICADO': '🔧',
    'DONADO': '🤝',
    'RECICLADO': '♻️',
    'REACONDICIONADO': '🔄',
    'DESTRUCCION_SEGURA': '🔥'
  };

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol === 'OPERADOR_CENTRO' || rol === 'OPERADOR_TECNICO' || rol === 'ADMIN') {
      setEsOperador(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        setError(null);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('⚠️ No has iniciado sesión. Redirigiendo...');
          setTimeout(() => navigate('/login'), 2000);
          setCargando(false);
          return;
        }

        // 1. Obtener detalles del residuo
        const residuoRes = await axios.get(
          `http://localhost:8000/api/residuos/${id}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setResiduo(residuoRes.data);

        // 2. Obtener trazabilidad
        const trazaRes = await axios.get(
          `http://localhost:8000/api/trazabilidad/${id}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        // ✅ Asegurar que trazabilidad sea un arreglo
        if (Array.isArray(trazaRes.data)) {
          setTrazabilidad(trazaRes.data);
        } else {
          setTrazabilidad([]); // Si no es arreglo, usar arreglo vacío
        }

      } catch (err) {
        console.error("Error al cargar datos:", err);
        if (err.response?.status === 404) {
          setError(`❌ Residuo con ID ${id} no encontrado.`);
        } else if (err.response?.status === 401) {
          setError('⚠️ Sesión expirada. Redirigiendo al login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('❌ Error al cargar la trazabilidad. Verifica tu conexión.');
        }
        setResiduo(null);
        setTrazabilidad([]); // ✅ En caso de error, asegurar arreglo vacío
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError('❌ No se especificó un ID de residuo.');
      setCargando(false);
    }
  }, [id, navigate]);

  const handleCambiarEstado = async (e) => {
    e.preventDefault();
    if (!nuevoEstado) {
      setError('Selecciona un estado');
      return;
    }

    try {
      setMensaje('');
      setError(null);
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/api/trazabilidad/${id}/estado`,
        null,
        {
          params: {
            nuevoEstado,
            observaciones: observaciones || 'Cambio de estado registrado'
          },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // Recargar trazabilidad
      const trazaRes = await axios.get(
        `http://localhost:8000/api/trazabilidad/${id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (Array.isArray(trazaRes.data)) {
        setTrazabilidad(trazaRes.data);
      } else {
        setTrazabilidad([]);
      }

      setResiduo(prev => ({
        ...prev,
        estado: nuevoEstado
      }));

      setNuevoEstado('');
      setObservaciones('');
      setMensaje(`✅ Estado actualizado a: ${nuevoEstado}`);

    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setError(err.response?.data?.error || '❌ Error al cambiar estado');
    }
  };

  // --- RENDERIZADO ---
  if (cargando) {
    return (
      <div className="trazabilidad-container">
        <div className="cargando">⏳ Cargando trazabilidad...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trazabilidad-container">
        <div className="error">{error}</div>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate(-1)} className="btn-volver">← Volver</button>
        </div>
      </div>
    );
  }

  if (!residuo) {
    return (
      <div className="trazabilidad-container">
        <div className="error">❌ No se encontró información para este residuo.</div>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate(-1)} className="btn-volver">← Volver</button>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="trazabilidad-container">
      <h2>🔍 Trazabilidad del Residuo</h2>
      <button onClick={() => navigate(-1)} className="btn-volver">← Volver</button>

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      {/* Información del residuo */}
      <div className="residuo-info">
        <div className="residuo-header">
          <h3>📋 Residuo #{residuo.id}</h3>
          <span className="estado-actual" style={{ backgroundColor: coloresEstados[residuo.estado] || '#95a5a6' }}>
            {(iconosEstados[residuo.estado] || '📌')} {residuo.estado || 'SIN ESTADO'}
          </span>
        </div>
        <div className="residuo-detalles">
          <p><strong>Tipo:</strong> {residuo.tipo || 'No especificado'}</p>
          <p><strong>Descripción:</strong> {residuo.descripcion || 'Sin descripción'}</p>
          <p><strong>Fecha registro:</strong> {residuo.fechaRegistro ? new Date(residuo.fechaRegistro).toLocaleString() : 'No disponible'}</p>
        </div>
      </div>

      {/* Línea de tiempo - ✅ Ahora trazabilidad es siempre un arreglo */}
      <div className="linea-tiempo">
        <h3>📋 Historial de cambios</h3>
        {!trazabilidad || trazabilidad.length === 0 ? (
          <p className="sin-registros">No hay registros de trazabilidad para este residuo</p>
        ) : (
          <div className="timeline">
            {trazabilidad.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-icon">{iconosEstados[item.estadoNuevo] || '📌'}</div>
                <div className="timeline-content">
                  <div className="timeline-estado" style={{ backgroundColor: coloresEstados[item.estadoNuevo] || '#95a5a6' }}>
                    {item.estadoNuevo || 'Cambio de estado'}
                  </div>
                  <div className="timeline-detalle">
                    <span className="timeline-fecha">📅 {item.fechaCambio ? new Date(item.fechaCambio).toLocaleString() : 'Fecha no disponible'}</span>
                    {item.estadoAnterior && (
                      <span className="timeline-transicion">🔄 desde {item.estadoAnterior}</span>
                    )}
                    {item.observaciones && (
                      <p className="timeline-observaciones">📝 {item.observaciones}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario para cambiar estado (solo operadores) */}
      {esOperador && (
        <div className="cambiar-estado">
          <h3>🔄 Cambiar estado del residuo</h3>
          <form onSubmit={handleCambiarEstado}>
            <div className="campo">
              <label htmlFor="nuevoEstado">Nuevo estado</label>
              <select
                id="nuevoEstado"
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="select-estado"
              >
                <option value="">Selecciona un estado</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{iconosEstados[estado] || '📌'} {estado}</option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label htmlFor="observaciones">Observaciones</label>
              <input
                type="text"
                id="observaciones"
                placeholder="Ej: Residuo recibido en centro de acopio"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="input-observaciones"
              />
            </div>

            <button type="submit" className="btn-cambiar-estado">🔄 Cambiar estado</button>
          </form>

          <p className="mensaje-inmutabilidad">
            🔒 <strong>Nota:</strong> El historial de trazabilidad es <strong>inmutable</strong>. Los cambios registrados no pueden ser modificados ni eliminados.
          </p>
        </div>
      )}

      {!esOperador && (
        <div className="mensaje-solo-lectura">
          📖 <strong>Modo de solo lectura:</strong> Solo los operadores pueden cambiar el estado del residuo.
        </div>
      )}

      <div className="mensaje-ambiental-trazabilidad">
        <p>🌱 <strong>La trazabilidad garantiza</strong> que cada residuo tenga un destino final responsable: donación, reciclaje o reacondicionamiento.</p>
        <p className="datos-impacto">📊 <strong>Impacto:</strong> Dispositivos reacondicionados pueden ser donados a escuelas y comunidades, extendiendo su vida útil.</p>
      </div>
    </div>
  );
};

export default Trazabilidad; 