import axios from 'axios';
import { useEffect, useState } from 'react';
import './MapaCentros.css';

const MapaCentros = () => {
  const [centros, setCentros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const lat = 13.791660737396686;
  const lng = -89.17922954299647;

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        setCargando(true);
        const response = await axios.get(
          `http://localhost:8000/api/centros/cercanos?lat=${lat}&lng=${lng}&limite=10`
        );
        setCentros(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar centros:', err);
        setError('Error al cargar los centros');
      } finally {
        setCargando(false);
      }
    };

    fetchCentros();
  }, [lat, lng]);

  const searchUrl = `https://www.google.com/maps/search/centros+de+acopio/@${lat},${lng},13z`;

  if (cargando) {
    return <div className="cargando">⏳ Cargando centros de acopio...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="mapa-container">
      <h2>📍 Centros de Acopio Cercanos</h2>
      <p className="info-ubicacion">
        📌 Tu ubicación: {lat.toFixed(6)}, {lng.toFixed(6)}
      </p>

      <div className="mapa-enlace-container">
        <a 
          href={searchUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-maps-enlace"
        >
          🗺️ Buscar centros de acopio cerca de ti
        </a>
        <p className="info-enlace">
          Haz clic para ver todos los centros de acopio en Google Maps.
        </p>
      </div>

      {centros.length === 0 ? (
        <p className="sin-centros">No hay centros de acopio cercanos.</p>
      ) : (
        <ul className="lista-centros">
          {centros.map((centro) => (
            <li key={centro.id}>
              <strong>{centro.nombre}</strong>
              <br />
              <small>
                📍 {centro.direccion}
                <br />
                📞 {centro.telefono || 'No disponible'}
                <br />
                🕐 {centro.horario || 'No disponible'}
                <br />
                <span className="coordenadas">
                  📌 {centro.latitud.toFixed(6)}, {centro.longitud.toFixed(6)}
                </span>
                <br />
                {/* ✅ Enlace con place para Google Maps */}
                <a 
                  href={`https://www.google.com/maps/place/${centro.latitud},${centro.longitud}/@${centro.latitud},${centro.longitud},17z`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-ver-mapa"
                >
                  Ver en mapa
                </a>
              </small>
            </li>
          ))}
        </ul>
      )}

      <div className="mensaje-ambiental-mapa">
        <p>🌱 <strong>Recuerda:</strong> Cada dispositivo electrónico reciclado ayuda a reducir la contaminación por metales pesados y plásticos no biodegradables.</p>
      </div>
    </div>
  );
};

export default MapaCentros;