import { FC } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoutes } from './routes';

export const RenderRoutes: FC = () => {
  return <RouterProvider router={createBrowserRouter(createRoutes())} />;
};
