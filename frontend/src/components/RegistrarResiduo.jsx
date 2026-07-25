import axios from 'axios';
import { useEffect, useState } from 'react';
import './RegistrarResiduo.css';

const RegistrarResiduo = () => {
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    latitud: '',
    longitud: '',
    estadoEquipo: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [ubicacion, setUbicacion] = useState(null);
  const [token, setToken] = useState(null);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError('⚠️ Debes iniciar sesión para registrar un residuo. Redirigiendo al login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
  }, []);

  // Tipos de residuos (catálogo)
  const tiposResiduo = [
    { valor: 'BATERIA', label: '🔋 Baterías y celdas' },
    { valor: 'SMARTPHONE', label: '📱 Smartphones y tablets' },
    { valor: 'LAPTOP', label: '💻 Laptops y computadoras' },
    { valor: 'MONITOR', label: '🖥️ Monitores y pantallas' },
    { valor: 'PERIFERICO', label: '🖱️ Periféricos (teclados, ratones)' },
    { valor: 'COMPONENTE', label: '🔧 Componentes internos (RAM, discos)' },
    { valor: 'CABLEADO', label: '🔌 Cableado y conectores' },
    { valor: 'TELECOMUNICACIONES', label: '📡 Equipos de telecomunicaciones' },
    { valor: 'ELECTRODOMESTICO', label: '🏠 Electrodomésticos pequeños' }
  ];

  const estadosEquipo = [
    { valor: 'FUNCIONAL', label: '✅ Funcional' },
    { valor: 'DAÑADO', label: '❌ Dañado / No funciona' },
    { valor: 'PARA_PIEZAS', label: '🔩 Para piezas' }
  ];

  // Obtener ubicación del usuario
  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUbicacion(coords);
          setFormData({
            ...formData,
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          });
          setMensaje('📍 Ubicación obtenida correctamente');
          setError('');
        },
        () => {
          setError('⚠️ No se pudo obtener la ubicación. Ingresa las coordenadas manualmente.');
        }
      );
    } else {
      setError('⚠️ Tu navegador no soporta geolocalización.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setMensaje('');

    // Validaciones
    if (!formData.tipo) {
      setError('❌ El tipo de residuo es obligatorio');
      setCargando(false);
      return;
    }

    if (!formData.latitud || !formData.longitud) {
      setError('❌ La ubicación es obligatoria. Usa "Obtener ubicación" o ingresa coordenadas.');
      setCargando(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.');
        setCargando(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/residuos',
        {
          tipo: formData.tipo,
          descripcion: formData.descripcion,
          latitud: parseFloat(formData.latitud),
          longitud: parseFloat(formData.longitud),
          estadoEquipo: formData.estadoEquipo
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMensaje(`✅ ¡Residuo registrado exitosamente! ID: ${response.data.id}`);
      setFormData({
        tipo: '',
        descripcion: '',
        latitud: '',
        longitud: '',
        estadoEquipo: ''
      });
      setUbicacion(null);
      
      // Mensaje de concientización según el tipo de residuo
      const mensajesConcientizacion = {
        'BATERIA': '⚠️ Las baterías contienen metales pesados tóxicos. Almacena en contenedores seguros.',
        'MONITOR': '⚠️ Los monitores contienen mercurio y plomo. Manejar con cuidado.',
        'LAPTOP': '♻️ Las laptops contienen materiales reciclables como oro, plata y cobre.',
        'SMARTPHONE': '♻️ Los smartphones contienen tierras raras y metales preciosos.',
        'PERIFERICO': '♻️ Los periféricos son 100% reciclables en sus componentes plásticos y metálicos.'
      };
      const mensajeAmbiental = mensajesConcientizacion[formData.tipo] || '🌱 Gracias por reciclar. Cada dispositivo cuenta.';
      setMensaje(prev => `${prev}\n${mensajeAmbiental}`);
      
    } catch (err) {
      if (err.response?.status === 401) {
        setError('⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setError(err.response?.data?.error || '❌ Error al registrar el residuo. Intenta nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      tipo: '',
      descripcion: '',
      latitud: '',
      longitud: '',
      estadoEquipo: ''
    });
    setUbicacion(null);
    setMensaje('');
    setError('');
  };

  return (
    <div className="registro-container">
      <h2>📦 Registrar Nuevo Residuo</h2>
      <p className="subtitulo">Completa el formulario para registrar tu residuo electrónico</p>

      {mensaje && <div className="mensaje-exito">{mensaje.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>}
      {error && <div className="mensaje-error">{error}</div>}

      {!token && (
        <div className="mensaje-error">
          ⚠️ Debes iniciar sesión para registrar un residuo.
          <br />
          <a href="/login" className="link-login">Ir a iniciar sesión</a>
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="tipo">Tipo de residuo *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="select-tipo"
            >
              <option value="">Selecciona un tipo de residuo</option>
              {tiposResiduo.map(tipo => (
                <option key={tipo.valor} value={tipo.valor}>{tipo.label}</option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe el estado del equipo, marca, modelo, etc."
              rows="3"
              className="textarea-descripcion"
            />
          </div>

          <div className="campo">
            <label htmlFor="estadoEquipo">Estado del equipo</label>
            <select
              id="estadoEquipo"
              name="estadoEquipo"
              value={formData.estadoEquipo}
              onChange={handleChange}
              className="select-estado"
            >
              <option value="">Selecciona una opción</option>
              {estadosEquipo.map(estado => (
                <option key={estado.valor} value={estado.valor}>{estado.label}</option>
              ))}
            </select>
          </div>

          <div className="campo-ubicacion">
            <label>📍 Ubicación *</label>
            <div className="ubicacion-actions">
              <button type="button" onClick={obtenerUbicacion} className="btn-ubicacion">
                📡 Obtener ubicación
              </button>
              <button type="button" onClick={() => {
                setFormData({
                  ...formData,
                  latitud: '13.791660737396686',
                  longitud: '-89.17922954299647'
                });
                setMensaje('📍 Ubicación de Urbanización Las Orquideas cargada');
              }} className="btn-ubicacion-default">
                🏠 Usar ubicación de ejemplo
              </button>
            </div>
            <div className="coordenadas">
              <input
                type="number"
                id="latitud"
                name="latitud"
                placeholder="Latitud"
                value={formData.latitud}
                onChange={handleChange}
                step="0.00000001"
                className="input-coordenada"
              />
              <input
                type="number"
                id="longitud"
                name="longitud"
                placeholder="Longitud"
                value={formData.longitud}
                onChange={handleChange}
                step="0.00000001"
                className="input-coordenada"
              />
            </div>
            {ubicacion && (
              <span className="ubicacion-confirmada">
                ✅ Ubicación: {ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}
              </span>
            )}
          </div>

          <div className="acciones-formulario">
            <button type="submit" disabled={cargando} className="btn-registrar">
              {cargando ? '⏳ Registrando...' : '✅ Registrar Residuo'}
            </button>
            <button type="button" onClick={limpiarFormulario} className="btn-limpiar">
              🗑️ Limpiar formulario
            </button>
          </div>
        </form>
      )}

      <div className="mensaje-ambiental">
        <p>🌱 <strong>Recuerda:</strong> Al reciclar tus dispositivos electrónicos, contribuyes a reducir la contaminación por metales pesados y plásticos no biodegradables.</p>
        <p className="datos-impacto">📊 <strong>Dato:</strong> Por cada tonelada de residuos electrónicos reciclados, se evita la extracción de nuevos recursos y se reduce la huella de carbono en un 70%.</p>
      </div>
    </div>
  );
};

export default RegistrarResiduo; 