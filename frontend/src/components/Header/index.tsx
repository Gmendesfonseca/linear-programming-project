import { Link } from 'react-router-dom';
import './style.css';

export const Header = () => {
  const path = window.location.pathname;
  // const title: { [key: string]: string } = {
  //   '/home': 'Menu Principal',
  //   '/basic-methods': 'Métodos Básicos',
  //   '/genetic-algorithms': 'Algoritmos Genéticos',
  //   '/problem-description': 'Descrição do Problema',
  // };
  return (
    <header className="header">
      {/* <h2>{title[path]}</h2> */}
      {path === '/home' ? null : (
        <div className="paths">
          {path !== '/home' && (
            <Link to={'/home'} replace>
              Home
            </Link>
          )}
          {path !== '/basic-methods' && (
            <Link to={'/basic-methods'} replace>
              Métodos Básicos
            </Link>
          )}
          {path !== '/genetic-algorithms' && (
            <Link to={'/genetic-algorithms'} replace>
              Algoritmos Genéticos
            </Link>
          )}
          {path !== '/reports' && (
            <Link to={'/reports'} replace>
              Relatórios
            </Link>
          )}
          {/* {path !== '/problem-description' && (
          <Link to={'/problem-description'} replace>
            Descrição do Problema
          </Link>
        )} */}
          {/* {path !== '/encosta' && (
          <Link to={'/encosta'} replace>
            Encosta
          </Link>
        )} */}
        </div>
      )}
    </header>
  );
};
