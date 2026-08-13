import { useState } from 'react';
import './MapaCentros.css';

const MapaCentros = () => {
  const [cargando, setCargando] = useState(false);

  const lat = 13.791660737396686;
  const lng = -89.17922954299647;

  // ✅ Datos locales (sin depender del backend)
  const centros = [
    { id: 3, nombre: 'ZARTEX - Gestor Autorizado', direccion: 'Calle Agua Caliente Km 5, Soyapango', latitud: 13.70533385, longitud: -89.15557049, telefono: '503-1234-5678', horario: 'Lun-Vie 8:00-17:00' },
    { id: 4, nombre: 'AUTOCONSA - Gestor Autorizado', direccion: '37 Ave. Sur #543, Col. Flor Blanca, San Salvador', latitud: 13.69701430, longitud: -89.21070491, telefono: '503-1234-5679', horario: 'Lun-Vie 8:00-17:00' },
    { id: 2, nombre: 'SRS - Superintendencia de Regulación Sanitaria', direccion: '75 Av. Sur #214, Col. Escalón, San Salvador', latitud: 13.70113358, longitud: -89.23329936, telefono: '503-2511-7000', horario: 'Lun-Vie 8:00-16:00' },
    { id: 1, nombre: 'MARN - Ministerio de Medio Ambiente', direccion: 'Km 5½ Carretera a Santa Tecla, Col. Las Mercedes, San Salvador', latitud: 13.68792636, longitud: -89.23142434, telefono: '503-2132-6000', horario: 'Lun-Vie 7:30-15:30' }
  ];

  const searchUrl = `https://www.google.com/maps/search/centros+de+acopio/@${lat},${lng},13z`;

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

      <div className="mensaje-ambiental-mapa">
        <p>🌱 <strong>Recuerda:</strong> Cada dispositivo electrónico reciclado ayuda a reducir la contaminación por metales pesados y plásticos no biodegradables.</p>
      </div>
    </div>
  );
};

export default MapaCentros; 