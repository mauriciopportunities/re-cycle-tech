import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 13.68935,
  lng: -89.18718
};

const MapaCentros = () => {
  const [ubicacion, setUbicacion] = useState(center);
  const [centros, setCentros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null); // ← Nuevo estado para InfoWindow

  // Obtener ubicación del usuario
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
          console.log('Usando ubicación por defecto');
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

  if (cargando) return <div>Cargando centros cercanos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div>
        <h2>Centros de Acopio Cercanos</h2>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={ubicacion}
          zoom={12}
        >
          {/* Marcador de ubicación del usuario */}
          <Marker
            position={ubicacion}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />

          {/* Marcadores de centros de acopio */}
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

          {/* InfoWindow al hacer clic en un marcador */}
          {selected && (
            <InfoWindow
              position={{ lat: selected.latitud, lng: selected.longitud }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <h3>{selected.nombre}</h3>
                <p>{selected.direccion}</p>
                <p><strong>{selected.distanciaKm.toFixed(2)} km</strong></p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Lista de centros */}
        <ul>
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