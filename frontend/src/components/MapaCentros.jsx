import axios from 'axios';
import { useEffect, useState } from 'react';
import './MapaCentros.css';

const MapaCentros = () => {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ubicacion, setUbicacion] = useState({
    lat: 13.791661,
    lng: -89.179230
  });
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);
  const [radioKm, setRadioKm] = useState(5);
  const [usandoUbicacionReal, setUsandoUbicacionReal] = useState(false);

  const fetchCentros = async (lat, lng, radio) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/centros/cercanos`,
        {
          params: {
            lat: lat,
            lng: lng,
            radioKm: radio
          }
        }
      );
      setCentros(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los centros cercanos');
      setCentros([]);
    } finally {
      setLoading(false);
    }
  };

  const obtenerUbicacionUsuario = () => {
    if (navigator.geolocation) {
      setObteniendoUbicacion(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacion({ lat: latitude, lng: longitude });
          setUsandoUbicacionReal(true);
          fetchCentros(latitude, longitude, radioKm);
          setObteniendoUbicacion(false);
        },
        () => {
          setError('⚠️ No se pudo obtener tu ubicación. Usando ubicación por defecto.');
          setObteniendoUbicacion(false);
        }
      );
    } else {
      setError('⚠️ Tu navegador no soporta geolocalización.');
    }
  };

  const cambiarRadio = (nuevoRadio) => {
    setRadioKm(nuevoRadio);
    fetchCentros(ubicacion.lat, ubicacion.lng, nuevoRadio);
  };

  useEffect(() => {
    fetchCentros(ubicacion.lat, ubicacion.lng, radioKm);
  }, []);

  const formatDistancia = (distancia) => {
    if (distancia < 1) {
      return `${(distancia * 1000).toFixed(0)} m`;
    }
    return `${distancia.toFixed(1)} km`;
  };

  return (
    <div className="mapa-section-modern">
      {/* Encabezado */}
      <div className="mapa-header-modern">
        <div className="mapa-titulo">
          <span className="mapa-titulo-icon">📍</span>
          <div>
            <h3>Centros de Acopio Cercanos</h3>
            <p className="mapa-subtitulo">Encuentra el centro más cercano a tu ubicación</p>
          </div>
        </div>
        
        <div className="mapa-controles-modern">
          <button 
            onClick={obtenerUbicacionUsuario}
            className={`btn-ubicacion-modern ${usandoUbicacionReal ? 'activo' : ''}`}
            disabled={obteniendoUbicacion}
          >
            {obteniendoUbicacion ? (
              <><span className="spinner"></span> Obteniendo...</>
            ) : (
              <><span className="btn-icon-ubicacion">📡</span> Usar mi ubicación</>
            )}
          </button>
          
          <div className="radio-selector">
            <label className="radio-label">Radio de búsqueda:</label>
            <div className="radio-botones">
              {[1, 3, 5, 10, 20].map(radio => (
                <button
                  key={radio}
                  onClick={() => cambiarRadio(radio)}
                  className={`radio-btn ${radioKm === radio ? 'radio-btn-activo' : ''}`}
                >
                  {radio} km
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info de ubicación */}
      <div className="ubicacion-banner-modern">
        <span className="ubicacion-icon">📍</span>
        <span className="ubicacion-texto">
          Tu ubicación actual: <strong>{ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}</strong>
        </span>
        <span className="ubicacion-badge">
          Radio: {radioKm} km
        </span>
        {usandoUbicacionReal && (
          <span className="ubicacion-real-badge">✓ Ubicación real</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mapa-error-modern">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Contenido */}
      {loading && centros.length === 0 ? (
        <div className="mapa-loading-modern">
          <div className="spinner-grande"></div>
          <p>Buscando centros cercanos...</p>
        </div>
      ) : centros.length === 0 ? (
        <div className="sin-centros-modern">
          <span className="sin-centros-icon">🔍</span>
          <h4>No se encontraron centros</h4>
          <p>No hay centros de acopio en el radio de {radioKm} km.</p>
          <button onClick={() => cambiarRadio(20)} className="btn-ampliar">
            Ampliar a 20 km
          </button>
        </div>
      ) : (
        <>
          <div className="centros-count">
            <span className="count-badge">
              {centros.length} {centros.length === 1 ? 'centro encontrado' : 'centros encontrados'}
            </span>
          </div>
          
          <div className="mapa-centros-grid-modern">
            {centros.map(centro => (
              <div key={centro.id} className="centro-card-modern">
                <div className="centro-card-top">
                  <span className="centro-icon-modern">♻️</span>
                  <span className="centro-distancia-badge">
                    📍 {formatDistancia(centro.distanciaKm)}
                  </span>
                </div>
                
                <h4 className="centro-nombre-modern">{centro.nombre}</h4>
                
                <div className="centro-detalles">
                  <p><span className="detalle-icon">📍</span> {centro.direccion}</p>
                  {centro.telefono && (
                    <p><span className="detalle-icon">📞</span> {centro.telefono}</p>
                  )}
                  {centro.horario && (
                    <p><span className="detalle-icon">🕐</span> {centro.horario}</p>
                  )}
                  {centro.capacidad && (
                    <p><span className="detalle-icon">📦</span> {centro.capacidad}</p>
                  )}
                </div>
                
                <a
                  href={`https://www.google.com/maps?q=${centro.latitud},${centro.longitud}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-como-llegar-modern"
                >
                  🧭 Cómo llegar
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MapaCentros; 