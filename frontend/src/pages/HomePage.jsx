import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MapaCentros from '../components/MapaCentros';
import './HomePage.css';

const HomePage = () => {
  const [textoCompleto] = useState('Dale una segunda vida a tus dispositivos electrónicos');
  const [textoMostrado, setTextoMostrado] = useState('');
  const [indice, setIndice] = useState(0);
  const [mostrarCursor, setMostrarCursor] = useState(true);

  // Efecto de máquina de escribir
  useEffect(() => {
    if (indice < textoCompleto.length) {
      const timer = setTimeout(() => {
        setTextoMostrado(prev => prev + textoCompleto[indice]);
        setIndice(prev => prev + 1);
      }, 50); // Velocidad de escritura
      return () => clearTimeout(timer);
    }
  }, [indice, textoCompleto]);

  // Efecto de parpadeo del cursor
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setMostrarCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="homepage">
      {/* ===== SECCIÓN HERO ===== */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">♻️ Economía Circular</div>
          <h1 className="hero-title">
            <span className="highlight">
              {textoMostrado}
              <span className="cursor">{mostrarCursor ? '|' : ''}</span>
            </span>
          </h1>
          <p className="hero-description">
            Re-Cycle Tech te conecta con centros de acopio cercanos para que puedas reciclar 
            tus residuos electrónicos de forma responsable y trazable.
          </p>
          <div className="hero-buttons">
            <Link to="/registro-usuario" className="btn-hero-primary">
              Comienza ahora <span className="arrow">→</span>
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Iniciar Sesión
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">62M+</span>
              <span className="stat-label">Toneladas de e-waste al año</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Centros de acopio cerca de ti</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Trazabilidad garantizada</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN CÓMO FUNCIONA ===== */}
      <section className="how-it-works">
        <h2>¿Cómo funciona?</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">📱</div>
            <h3>1. Registra tu residuo</h3>
            <p>Ingresa el tipo de dispositivo, su estado y ubicación.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">📍</div>
            <h3>2. Encuentra un centro</h3>
            <p>Ubica el centro de acopio más cercano en el mapa.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">♻️</div>
            <h3>3. Entrega y seguimiento</h3>
            <p>Lleva tu residuo y sigue su trazabilidad hasta el destino final.</p>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN MAPA ===== */}
      <section className="map-section">
        <div className="section-header">
          <h2>📍 Centros de Acopio Cercanos</h2>
          <p>Encuentra el centro más cercano a tu ubicación</p>
        </div>
        <div className="map-container">
          <MapaCentros />
        </div>
      </section>

      {/* ===== SECCIÓN IMPACTO AMBIENTAL ===== */}
      <section className="impact-section">
        <div className="impact-content">
          <h2>🌱 Tu impacto en el mundo</h2>
          <p>
            Cada dispositivo que reciclas ayuda a reducir la contaminación por metales pesados 
            y plásticos no biodegradables. ¡Sé parte del cambio!
          </p>
          <div className="impact-numbers">
            <div className="impact-item">
              <span className="impact-number">70%</span>
              <span className="impact-label">Menos huella de carbono</span>
            </div>
            <div className="impact-item">
              <span className="impact-number">100%</span>
              <span className="impact-label">Reciclaje responsable</span>
            </div>
            <div className="impact-item">
              <span className="impact-number">♻️</span>
              <span className="impact-label">Economía circular</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN CTA FINAL ===== */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para empezar?</h2>
          <p>Únete a la comunidad de reciclaje responsable y contribuye al cuidado del planeta.</p>
          <Link to="/registro-usuario" className="btn-cta">
            Regístrate gratis
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 