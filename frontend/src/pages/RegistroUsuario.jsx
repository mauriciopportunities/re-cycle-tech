import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegistroUsuario.css';

const RegistroUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setMensaje('');

    // Validaciones
    if (!nombre || !email || !password) {
      setError('❌ Todos los campos son obligatorios');
      setCargando(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('❌ Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    if (password.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/registro', {
        nombre,
        email,
        password
      });

      setMensaje(`✅ ${response.data.mensaje}`);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response?.data?.error) {
        setError(`❌ ${err.response.data.error}`);
      } else {
        setError('❌ Error al registrar. Intenta nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-usuario-container">
      <h2>📝 Crear Cuenta</h2>
      <p className="subtitulo">Regístrate para gestionar tus residuos electrónicos</p>

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      {error && <div className="mensaje-error">{error}</div>}

      <form onSubmit={handleSubmit} className="registro-form">
        <div className="campo">
          <label htmlFor="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Juan Pérez"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la contraseña"
            required
          />
        </div>

        <button type="submit" disabled={cargando} className="btn-registro-usuario">
          {cargando ? '⏳ Registrando...' : '✅ Registrarse'}
        </button>
      </form>

      <p className="login-link">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>

      <div className="mensaje-ambiental-registro">
        <p>♻️ <strong>Re-Cycle Tech</strong> - Únete a la economía circular</p>
        <p className="datos-impacto">🌱 Cada dispositivo reciclado cuenta. ¡Sé parte del cambio!</p>
      </div>
    </div>
  );
};

export default RegistroUsuario; 