import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import FooterAmbiental from './components/FooterAmbiental';
import MapaCentros from './components/MapaCentros';
import RegistrarResiduo from './components/RegistrarResiduo';
import Login from './pages/Login';
import RegistroUsuario from './pages/RegistroUsuario';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <nav className="nav-principal">
            <Link to="/" className="nav-logo">♻️ Re-Cycle Tech</Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">📍 Mapa</Link>
              <Link to="/registrar" className="nav-link">📦 Registrar</Link>
              <Link to="/login" className="nav-link">🔐 Login</Link>
            </div>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<MapaCentros />} />
            <Route path="/registrar" element={<RegistrarResiduo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro-usuario" element={<RegistroUsuario />} />
          </Routes>
        </main>

        <FooterAmbiental />
      </div>
    </Router>
  );
}

export default App; 