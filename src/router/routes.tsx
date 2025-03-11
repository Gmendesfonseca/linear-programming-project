import { Navigate, RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import BasicMethods from '../pages/BasicMethods';
import GeneticAlgorithms from '../pages/GeneticAlgorithms';
import ProblemDescription from '../pages/ProblemDescription';

export type RouteType = {
  path: string;
  element?: React.ReactNode;
  options?: Omit<RouteObject, 'path' | 'element' | 'children'>;
  permissions?: string[] | (string | string[])[];
  children?: RouteType[];
};

export function createRoutes() {
  const routes: RouteType[] = [
    {
      path: '/*',
      element: <Navigate to={'/home'} replace />,
    },
    {
      path: '/',
      element: <Navigate to={'/home'} replace />,
    },
    {
      path: '/home',
      element: <Home />,
    },
    {
      path: '/basic-methods',
      element: <BasicMethods />,
    },
    {
      path: '/genetic-algorithms',
      element: <GeneticAlgorithms />,
    },
    {
      path: '/problem-description',
      element: <ProblemDescription />,
    },
  ];

  return routes;
}
