import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ListaResiduos = () => {
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResiduos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/residuos/todos',
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setResiduos(response.data);
      } catch (err) {
        setError('Error al cargar residuos');
      } finally {
        setLoading(false);
      }
    };
    fetchResiduos();
  }, []);

  if (loading) return <div className="cargando">⏳ Cargando residuos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="lista-residuos-container">
      <h2>📋 Todos los Residuos</h2>
      
      {residuos.length === 0 ? (
        <p className="sin-registros">No hay residuos registrados</p>
      ) : (
        <table className="tabla-residuos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {residuos.map(residuo => (
              <tr key={residuo.id}>
                <td>#{residuo.id}</td>
                <td>{residuo.tipo}</td>
                <td>
                  <span className={`estado-badge estado-${residuo.estado.toLowerCase()}`}>
                    {residuo.estado}
                  </span>
                </td>
                <td>{residuo.usuario?.nombre || 'Desconocido'}</td>
                <td>{new Date(residuo.fechaRegistro).toLocaleDateString()}</td>
                <td>
                  <Link to={`/trazabilidad/${residuo.id}`} className="btn-ver-trazabilidad">
                    🔍 Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaResiduos; 