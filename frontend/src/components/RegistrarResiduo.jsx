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
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);
  const [token, setToken] = useState(null);

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

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError('⚠️ Tu navegador no soporta geolocalización. Por favor, ingresa tus coordenadas manualmente.');
      return;
    }

    setObteniendoUbicacion(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUbicacion(coords);
        setFormData(prev => ({
          ...prev,
          latitud: position.coords.latitude,
          longitud: position.coords.longitude
        }));
        setObteniendoUbicacion(false);
        setMensaje('📍 Ubicación obtenida correctamente');
        setTimeout(() => setMensaje(''), 3000);
      },
      (err) => {
        setObteniendoUbicacion(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('⚠️ Permiso denegado. Por favor, ingresa tus coordenadas manualmente o permite el acceso a tu ubicación.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('⚠️ Ubicación no disponible. Ingresa tus coordenadas manualmente.');
            break;
          case err.TIMEOUT:
            setError('⚠️ Tiempo agotado. Intenta de nuevo o ingresa tus coordenadas manualmente.');
            break;
          default:
            setError('⚠️ No se pudo obtener la ubicación. Ingresa tus coordenadas manualmente.');
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
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

    if (!formData.tipo) {
      setError('❌ El tipo de residuo es obligatorio');
      setCargando(false);
      return;
    }

    if (!formData.latitud || !formData.longitud) {
      setError('❌ Necesitamos tu ubicación. Haz clic en "Obtener ubicación" para continuar.');
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
    <div className="registro-container-modern">
      <div className="registro-header">
        <span className="registro-header-icon">📦</span>
        <div>
          <h2>Registrar Nuevo Residuo</h2>
          <p className="registro-subtitulo">Completa el formulario para registrar tu residuo electrónico</p>
        </div>
      </div>

      {mensaje && (
        <div className="mensaje-exito-modern">
          {mensaje.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
      {error && <div className="mensaje-error-modern">{error}</div>}

      {!token && (
        <div className="mensaje-error-modern">
          ⚠️ Debes iniciar sesión para registrar un residuo.
          <br />
          <a href="/login" className="link-login">Ir a iniciar sesión</a>
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit} className="registro-form-modern">
          <div className="campo-modern">
            <label htmlFor="tipo">
              <span className="label-icon">📱</span> Tipo de residuo <span className="requerido">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="select-modern"
            >
              <option value="">Selecciona un tipo de residuo</option>
              {tiposResiduo.map(tipo => (
                <option key={tipo.valor} value={tipo.valor}>{tipo.label}</option>
              ))}
            </select>
          </div>

          <div className="campo-modern">
            <label htmlFor="descripcion">
              <span className="label-icon">📝</span> Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe el estado del equipo, marca, modelo, etc."
              rows="3"
              className="textarea-modern"
            />
          </div>

          <div className="campo-modern">
            <label htmlFor="estadoEquipo">
              <span className="label-icon">🔍</span> Estado del equipo
            </label>
            <select
              id="estadoEquipo"
              name="estadoEquipo"
              value={formData.estadoEquipo}
              onChange={handleChange}
              className="select-modern"
            >
              <option value="">Selecciona una opción</option>
              {estadosEquipo.map(estado => (
                <option key={estado.valor} value={estado.valor}>{estado.label}</option>
              ))}
            </select>
          </div>

          <div className="campo-ubicacion-modern">
            <label>
              <span className="label-icon">📍</span> Ubicación <span className="requerido">*</span>
            </label>
            
            {!ubicacion ? (
              <>
                <button 
                  type="button" 
                  onClick={obtenerUbicacion} 
                  className="btn-ubicacion-produccion"
                  disabled={obteniendoUbicacion}
                >
                  {obteniendoUbicacion ? (
                    <><span className="spinner"></span> Obteniendo ubicación...</>
                  ) : (
                    <><span>📡</span> Obtener mi ubicación</>
                  )}
                </button>
                <p className="ubicacion-ayuda">
                  Necesitamos tu ubicación para mostrarte los centros de acopio más cercanos.
                </p>
              </>
            ) : (
              <div className="ubicacion-confirmada-banner">
                <span className="check-icon">✅</span>
                <div>
                  <strong>Ubicación obtenida correctamente</strong>
                  <p>{ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}</p>
                </div>
                <button type="button" onClick={obtenerUbicacion} className="btn-reintentar">
                  🔄
                </button>
              </div>
            )}

            {/* Campos ocultos que se llenan automáticamente */}
            <input
              type="hidden"
              name="latitud"
              value={formData.latitud}
            />
            <input
              type="hidden"
              name="longitud"
              value={formData.longitud}
            />
          </div>

          <div className="acciones-formulario-modern">
            <button type="submit" disabled={cargando} className="btn-registrar-modern">
              {cargando ? '⏳ Registrando...' : '✅ Registrar Residuo'}
            </button>
            <button type="button" onClick={limpiarFormulario} className="btn-limpiar-modern">
              🗑️ Limpiar
            </button>
          </div>
        </form>
      )}

      <div className="mensaje-ambiental-modern">
        <p>🌱 <strong>Recuerda:</strong> Al reciclar tus dispositivos electrónicos, contribuyes a reducir la contaminación por metales pesados y plásticos no biodegradables.</p>
        <p className="datos-impacto-modern">📊 <strong>Dato:</strong> Por cada tonelada de residuos electrónicos reciclados, se evita la extracción de nuevos recursos y se reduce la huella de carbono en un 70%.</p>
      </div>
    </div>
  );
};

export default RegistrarResiduo; 