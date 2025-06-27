import { FC, Suspense } from 'react';
import { createRoutes } from './routes';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const RenderRoutes: FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={createBrowserRouter(createRoutes())} />
    </Suspense>
  );
};
