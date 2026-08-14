import { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import FooterAmbiental from './components/FooterAmbiental';
import ListaResiduos from './components/ListaResiduos';
import RegistrarResiduo from './components/RegistrarResiduo';
import Trazabilidad from './components/Trazabilidad';
import AdminPanel from './pages/AdminPanel';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import MisResiduos from './pages/MisResiduos';
import RegistroUsuario from './pages/RegistroUsuario';

function Navbar({ isAuthenticated, userName, rol, handleLogout, getInitials }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon, label, className = '' }) => (
    <Link 
      to={to} 
      className={`nav-link-modern ${className} ${isActive(to) ? 'nav-link-active' : ''}`}
      onClick={() => setIsOpen(false)}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </Link>
  );

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">♻️</span>
          <span className="navbar-logo-text">
            Re-Cycle <span className="logo-highlight">Tech</span>
          </span>
        </Link>

        {/* Botón hamburguesa */}
        <button 
          className={`navbar-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Menú de navegación */}
        <nav className={`navbar-menu ${isOpen ? 'show' : ''}`}>
          <NavLink to="/" icon="📍" label="Mapa" />
          
          {isAuthenticated && (
            <>
              <NavLink to="/registrar" icon="📦" label="Registrar Residuo" />
              <NavLink to="/mis-residuos" icon="🗂️" label="Mis Residuos" />
              
              {(rol === 'OPERADOR_CENTRO' || rol === 'OPERADOR_TECNICO' || rol === 'ADMIN') && (
                <NavLink to="/residuos" icon="📋" label="Todos los Residuos" />
              )}
              
              {rol === 'ADMIN' && (
                <NavLink to="/admin" icon="⚙️" label="Administrar" className="nav-link-admin" />
              )}
            </>
          )}

          {/* Autenticación */}
          {!isAuthenticated ? (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-btn navbar-btn-login">
                <span className="nav-icon">🔐</span>
                <span>Iniciar Sesión</span>
              </Link>
              <Link to="/registro-usuario" className="navbar-btn navbar-btn-register">
                <span className="nav-icon">📝</span>
                <span>Registrarse</span>
              </Link>
            </div>
          ) : (
            <div className="navbar-user">
              <div className="navbar-user-badge">
                <span className="navbar-avatar">{getInitials(userName)}</span>
                <span className="navbar-user-info">
                  <span className="navbar-user-name">{userName}</span>
                  <span className="navbar-user-role">{rol.replace(/_/g, ' ')}</span>
                </span>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="navbar-btn-logout"
                title="Cerrar sesión"
              >
                <span className="nav-icon">🚪</span>
                <span className="nav-label">Salir</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    const userRol = localStorage.getItem('rol');
    
    if (token) {
      setIsAuthenticated(true);
      setUserName(nombre || 'Usuario');
      setRol(userRol || '');
    }
  }, []);

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
    if (!name) return 'U';
    const partes = name.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isAuthenticated={isAuthenticated}
          userName={userName}
          rol={rol}
          handleLogout={handleLogout}
          getInitials={getInitials}
        />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registrar" element={<RegistrarResiduo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro-usuario" element={<RegistroUsuario />} />
            <Route path="/mis-residuos" element={<MisResiduos />} />
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