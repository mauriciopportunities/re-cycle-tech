import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '500px'
};

// Coordenadas de Urbanización Las Orquideas (ubicación por defecto)
const UBICACION_DEFAULT = {
  lat: 13.791660737396686,
  lng: -89.17922954299647
};

const MapaCentros = () => {
  const [ubicacion, setUbicacion] = useState(UBICACION_DEFAULT);
  const [centros, setCentros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mostrarInfoUsuario, setMostrarInfoUsuario] = useState(false);

  // Obtener ubicación del usuario (si permite geolocalización)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacion({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Usando ubicación por defecto: Urbanización Las Orquideas');
          // Mantener la ubicación por defecto
        }
      );
    }
  }, []);

  // Consultar centros cercanos
  useEffect(() => {
    const fetchCentros = async () => {
      try {
        setCargando(true);
        const response = await axios.get(
          `http://localhost:8000/api/centros/cercanos?lat=${ubicacion.lat}&lng=${ubicacion.lng}&limite=5`
        );
        setCentros(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los centros');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    fetchCentros();
  }, [ubicacion]);

  if (cargando) return <div className="cargando">Cargando centros cercanos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="mapa-container">
        <h2>📍 Centros de Acopio Cercanos</h2>
        <p className="info-ubicacion">
          📌 Tu ubicación: {ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}
        </p>
        <p className="info-radio">Mostrando los {centros.length} centros más cercanos a tu ubicación</p>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={ubicacion}
          zoom={14}
        >
          {/* Marcador de ubicación del usuario (azul) con InfoWindow */}
          <Marker
            position={ubicacion}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
            onClick={() => setMostrarInfoUsuario(!mostrarInfoUsuario)}
          />

          {/* InfoWindow para el marcador azul */}
          {mostrarInfoUsuario && (
            <InfoWindow
              position={ubicacion}
              onCloseClick={() => setMostrarInfoUsuario(false)}
            >
              <div className="info-window-usuario">
                <h3>📍 Tu ubicación</h3>
                <p><strong>Latitud:</strong> {ubicacion.lat.toFixed(8)}</p>
                <p><strong>Longitud:</strong> {ubicacion.lng.toFixed(8)}</p>
                <p className="ubicacion-referencia">🏠 Urbanización Las Orquideas</p>
                <p className="ubicacion-pais">🇸🇻 El Salvador</p>
              </div>
            </InfoWindow>
          )}

          {/* Marcadores de centros de acopio (rojos) */}
          {centros.map((centro) => (
            <Marker
              key={centro.id}
              position={{
                lat: centro.latitud,
                lng: centro.longitud
              }}
              title={centro.nombre}
              onClick={() => setSelected(centro)}
            />
          ))}

          {/* InfoWindow para los centros de acopio */}
          {selected && (
            <InfoWindow
              position={{ lat: selected.latitud, lng: selected.longitud }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="info-window-centro">
                <h3>{selected.nombre}</h3>
                <p>{selected.direccion}</p>
                <p><strong>📏 {selected.distanciaKm.toFixed(2)} km</strong></p>
                <p>📞 {selected.telefono}</p>
                <p>🕐 {selected.horario}</p>
                <p>📦 Capacidad: {selected.capacidad}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        <ul className="lista-centros">
          {centros.map((centro) => (
            <li key={centro.id}>
              <strong>{centro.nombre}</strong> - {centro.distanciaKm.toFixed(2)} km
              <br />
              <small>{centro.direccion}</small>
            </li>
          ))}
        </ul>
      </div>
    </LoadScript>
  );
};

export default MapaCentros; 