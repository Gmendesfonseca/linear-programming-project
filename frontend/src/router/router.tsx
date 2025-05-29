import { FC } from 'react';
import { createRoutes } from './routes';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

export const RenderRoutes: FC = () => {
  return <RouterProvider router={createBrowserRouter(createRoutes())} />;
};
