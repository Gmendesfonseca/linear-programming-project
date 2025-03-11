import { Link } from 'react-router-dom';

export const Header = () => {
  const path = window.location.pathname;
  const title: { [key: string]: string } = {
    '/home': 'Menu Principal',
    '/basic-methods': 'Métodos Básicos',
    '/genetic-algorithms': 'Algoritmos Genéticos',
    '/problem-description': 'Descrição do Problema',
  };
  return (
    <header>
      <h2>{title[path]}</h2>
      {path !== '/home' && (
        <Link to={'/home'} replace>
          Home
        </Link>
      )}
    </header>
  );
};
