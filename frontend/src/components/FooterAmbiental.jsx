import './FooterAmbiental.css';

const FooterAmbiental = () => {
  return (
    <footer className="footer-ambiental">
      <div className="footer-contenido">
        <div className="footer-logo">
          <span className="logo-icon">♻️</span>
          <span className="logo-text">Re-Cycle Tech</span>
        </div>
        
        <div className="footer-mensaje">
          <p className="frase-ambiental">
            "Un residuo electrónico reciclado es un recurso que no se pierde."
          </p>
        </div>

        <div className="footer-datos">
          <p className="datos-impacto">
            🌍 Cada año se generan más de <strong>62 millones de toneladas</strong> de residuos electrónicos en el mundo.
          </p>
          <p className="llamada-accion">
            <strong>¡Sé parte de la solución!</strong> Recicla tus dispositivos electrónicos y contribuye a la economía circular.
          </p>
        </div>

        <div className="footer-estadisticas">
          <div className="stat">
            <span className="stat-numero">♻️</span>
            <span className="stat-texto">Residuos reciclados</span>
          </div>
          <div className="stat">
            <span className="stat-numero">🌱</span>
            <span className="stat-texto">Materiales recuperados</span>
          </div>
          <div className="stat">
            <span className="stat-numero">🤝</span>
            <span className="stat-texto">Dispositivos reacondicionados</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Re-Cycle Tech – Agencia AARD</p>
          <p className="footer-aviso">
            💚 Cada dispositivo cuenta. Juntos podemos reducir la contaminación electrónica.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterAmbiental; 