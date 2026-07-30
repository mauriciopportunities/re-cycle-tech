import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import FooterAmbiental from './components/FooterAmbiental';
import ListaResiduos from './components/ListaResiduos';
import MapaCentros from './components/MapaCentros';
import RegistrarResiduo from './components/RegistrarResiduo';
import Trazabilidad from './components/Trazabilidad';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import RegistroUsuario from './pages/RegistroUsuario';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [rol, setRol] = useState('');
  const [ultimoResiduoId, setUltimoResiduoId] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    const userRol = localStorage.getItem('rol');
    
    if (token) {
      setIsAuthenticated(true);
      setUserName(nombre || 'Usuario');
      setRol(userRol || '');
      obtenerUltimoResiduo(token);
    }
  }, []);

  const obtenerUltimoResiduo = async (token) => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/residuos/mis-residuos',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data && response.data.length > 0) {
        const ultimo = response.data.reduce((max, r) => r.id > max.id ? r : max);
        setUltimoResiduoId(ultimo.id);
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
    setRol('');
    window.location.href = '/';
  };

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
              {/* Mapa - Siempre visible */}
              <Link to="/" className="nav-link-modern nav-link-mapa">
                <span className="nav-icon">📍</span> Mapa
              </Link>

              {/* Enlaces para usuarios autenticados */}
              {isAuthenticated && (
                <>
                  <Link to="/registrar" className="nav-link-modern nav-link-registrar">
                    <span className="nav-icon">📦</span> Registrar Residuo
                  </Link>
                  
                  {/* ✅ Lista de residuos (solo para operadores y admin) */}
                  {(rol === 'OPERADOR_CENTRO' || rol === 'OPERADOR_TECNICO' || rol === 'ADMIN') && (
                    <Link to="/residuos" className="nav-link-modern nav-link-residuos">
                      <span className="nav-icon">📋</span> Todos los Residuos
                    </Link>
                  )}
                  
                  <Link to={`/trazabilidad/${ultimoResiduoId}`} className="nav-link-modern nav-link-trazabilidad">
                    <span className="nav-icon">🔍</span> Trazabilidad
                  </Link>
                  
                  {/* ✅ Panel de administración (solo ADMIN) */}
                  {rol === 'ADMIN' && (
                    <Link to="/admin" className="nav-link-modern nav-link-admin">
                      <span className="nav-icon">⚙️</span> Administrar
                    </Link>
                  )}
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

            {/* Menú móvil */}
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
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/residuos" element={<ListaResiduos />} />
          </Routes>
        </main>

        <FooterAmbiental />
      </div>
    </Router>
  );
}

export default App; 