import { FC, PropsWithChildren } from 'react';
import { Header } from '../Header';
import './style.css';

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='main-layout'>
      <Header />
      <div className='children'>{children}</div>
    </div>
  );
};
