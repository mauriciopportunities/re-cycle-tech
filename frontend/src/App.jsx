import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import FooterAmbiental from './components/FooterAmbiental';
import MapaCentros from './components/MapaCentros';
import RegistrarResiduo from './components/RegistrarResiduo';
import Trazabilidad from './components/Trazabilidad';
import Login from './pages/Login';
import RegistroUsuario from './pages/RegistroUsuario';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [ultimoResiduoId, setUltimoResiduoId] = useState(1);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    
    if (token) {
      setIsAuthenticated(true);
      setUserName(nombre || 'Usuario');
      obtenerUltimoResiduo(token);
    }
  }, []);

  // Obtener el último residuo registrado por el usuario
  const obtenerUltimoResiduo = async (token) => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/residuos/mis-residuos',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data && response.data.length > 0) {
        // Obtener el residuo con el ID más alto (el último registrado)
        const ultimo = response.data.reduce((max, r) => r.id > max.id ? r : max);
        setUltimoResiduoId(ultimo.id);
        console.log('📌 Último residuo ID:', ultimo.id);
      } else {
        console.log('📌 No hay residuos registrados');
      }
    } catch (error) {
      console.error('❌ Error al obtener residuos:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    setIsAuthenticated(false);
    setUserName('');
    window.location.href = '/';
  };

  // Obtener iniciales del usuario para el avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header-modern">
          <nav className="nav-container">
            {/* Logo */}
            <Link to="/" className="nav-logo-modern">
              <span className="logo-icon">♻️</span>
              <span className="logo-text">Re-Cycle Tech</span>
            </Link>

            {/* Menú de navegación */}
            <div className="nav-menu">
              {/* Enlaces principales */}
              <Link to="/" className="nav-link-modern nav-link-mapa">
                <span className="nav-icon">📍</span> Mapa
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/registrar" className="nav-link-modern nav-link-registrar">
                    <span className="nav-icon">📦</span> Registrar Residuo
                  </Link>
                  {/* ✅ Trazabilidad dinámica: siempre muestra el último residuo */}
                  <Link to={`/trazabilidad/${ultimoResiduoId}`} className="nav-link-modern nav-link-trazabilidad">
                    <span className="nav-icon">🔍</span> Trazabilidad
                  </Link>
                </>
              )}

              {/* Autenticación */}
              {!isAuthenticated ? (
                <div className="nav-auth">
                  <Link to="/login" className="btn-login">
                    <span className="nav-icon">🔐</span> Iniciar Sesión
                  </Link>
                  <Link to="/registro-usuario" className="btn-registro-usuario">
                    <span className="nav-icon">📝</span> Registrarse
                  </Link>
                </div>
              ) : (
                <div className="nav-auth">
                  <div className="nav-user-badge">
                    <div className="user-avatar">{getInitials(userName)}</div>
                    <span className="user-name">{userName}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-logout-modern">
                    <span className="nav-icon">🚪</span> Salir
                  </button>
                </div>
              )}
            </div>

            {/* Menú móvil (toggle) */}
            <button className="nav-toggle" id="navToggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<MapaCentros />} />
            <Route path="/registrar" element={<RegistrarResiduo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro-usuario" element={<RegistroUsuario />} />
            <Route path="/trazabilidad/:id" element={<Trazabilidad />} />
          </Routes>
        </main>

        <FooterAmbiental />
      </div>
    </Router>
  );
}

export default App; 