import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  IdCard,
  Mail,
  Phone,
  RefreshCw,
  UserRound,
  Users,
} from 'lucide-react';
import InteractiveSurface from './InteractiveSurface';
import Reveal, { RevealGroup } from './Reveal';

async function fetchUsers() {
  const response = await fetch('http://localhost:5000/api/users');

  if (!response.ok) {
    throw new Error('No se pudo cargar el directorio.');
  }

  return response.json();
}

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (requestError) {
      setError(requestError.message || 'Ocurrio un error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialUsers = async () => {
      try {
        const data = await fetchUsers();

        if (isMounted) {
          setUsers(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Ocurrio un error al cargar usuarios.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page users-page">
      <Reveal className="page-intro compact">
        <span className="eyebrow">
          <Users size={16} aria-hidden="true" />
          Usuarios
        </span>
        <h1>Directorio de clientes y colaboradores.</h1>
        <p>
          Consulta datos recuperados desde una API externa con estados de carga y error.
        </p>
      </Reveal>

      <Reveal as={InteractiveSurface} className="directory-toolbar" delay={60} surfaceVariant="panel">
        <div>
          <strong>{users.length}</strong>
          <span>contactos sincronizados</span>
        </div>
        <button className="btn btn-secondary" type="button" onClick={loadUsers}>
          <RefreshCw size={18} aria-hidden="true" />
          Actualizar
        </button>
      </Reveal>

      {loading && (
        <div className="user-grid" aria-live="polite">
          {Array.from({ length: 6 }).map((_, index) => (
            <Reveal key={index} delay={index < 6 ? index * 75 + 80 : 80}>
              <InteractiveSurface as="div" className="user-card skeleton" variant="card">
                <span />
                <strong />
                <p />
                <p />
              </InteractiveSurface>
            </Reveal>
          ))}
        </div>
      )}

      {!loading && error && (
        <Reveal as={InteractiveSurface} className="empty-state error-state" delay={80} surfaceVariant="card">
          <AlertTriangle size={42} aria-hidden="true" />
          <h2>No se pudo cargar el directorio</h2>
          <p>{error}</p>
          <button className="btn btn-primary" type="button" onClick={loadUsers}>
            <RefreshCw size={18} aria-hidden="true" />
            Reintentar
          </button>
        </Reveal>
      )}

      {!loading && !error && (
        <div className="user-grid">
          {users.map((user, index) => (
            <Reveal key={user._id || index} delay={index < 6 ? index * 80 + 80 : 40} rootMargin="0px" threshold={0}>
              <InteractiveSurface as="article" className="user-card" variant="card">
                <div className="user-avatar">
                  <UserRound aria-hidden="true" />
                </div>
                <div className="user-main">
                  <h2>{user.nombre}</h2>
                  <p>{user.empresa}</p>
                </div>
                <div className="user-detail">
                  <Mail size={17} aria-hidden="true" />
                  <a href={`mailto:${user.correo}`}>{user.correo}</a>
                </div>
                {user.dni && (
                  <div className="user-detail">
                    <IdCard size={17} aria-hidden="true" />
                    <span>DNI: {user.dni}</span>
                  </div>
                )}
                {user.telefono && (
                  <div className="user-detail">
                    <Phone size={17} aria-hidden="true" />
                    <span>{user.telefono}</span>
                  </div>
                )}
              </InteractiveSurface>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

export default UserList;
