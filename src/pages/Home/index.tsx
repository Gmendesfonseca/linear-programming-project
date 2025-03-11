import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <Link to={'/basic-methods'} replace>
        Métodos Básicos
      </Link>
      <br />
      <Link to={'/genetic-algorithms'} replace>
        Algoritmos Genéticos
      </Link>
      <br />
      <Link to={'/problem-description'} replace>
        Descrição do Problema
      </Link>
    </MainLayout>
  );
};

export default Home;
