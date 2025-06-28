import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
const Home = lazy(() => import('@/pages/Home'));
const BasicMethods = lazy(() => import('@/pages/BasicMethods'));
const GeneticAlgorithms = lazy(() => import('@/pages/GeneticAlgorithms'));
const ReportsController = lazy(() => import('@/pages/Reports'));
// import Encosta from '@/pages/Encosta';

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
      path: '/reports',
      element: <ReportsController />,
    },
    // {
    //   path: '/encosta',
    //   element: <Encosta />,
    // },
  ];

  return routes;
}
