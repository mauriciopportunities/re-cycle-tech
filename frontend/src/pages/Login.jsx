import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password
      });

      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuarioId', response.data.usuarioId);
      localStorage.setItem('nombre', response.data.nombre);
      localStorage.setItem('rol', response.data.rol);

      // Redirigir al formulario de registro
      navigate('/registrar');
    } catch (err) {
      setError('❌ Credenciales incorrectas. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Iniciar Sesión</h2>
      <p className="subtitulo">Ingresa tus credenciales para acceder</p>

      {error && <div className="mensaje-error">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
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
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" disabled={cargando} className="btn-login">
          {cargando ? '⏳ Iniciando sesión...' : '🔓 Iniciar Sesión'}
        </button>
      </form>

      <p className="registro-link">
        ¿No tienes cuenta? <a href="/registro-usuario">Regístrate aquí</a>
      </p>

      <div className="mensaje-ambiental-login">
        <p>♻️ <strong>Re-Cycle Tech</strong> - Plataforma de Economía Circular</p>
        <p className="datos-impacto">🌱 Gestiona tus residuos electrónicos de manera responsable.</p>
      </div>
    </div>
  );
};

export default Login; 