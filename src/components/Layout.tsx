import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';

export default (): ReactNode => <div className="min-h-full">
  <NavBar/>
  <main className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
    <Outlet/>
  </main>
</div>