import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { useApp } from '@/contexts/AppContext';

interface AppLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export const AppLayout = ({ children, showBottomNav = false }: AppLayoutProps) => {
  const { isAuthenticated } = useApp();
  const shouldShowBottomNav = showBottomNav && isAuthenticated;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pt-16 ${shouldShowBottomNav ? 'pb-20' : ''}`}>
        {children}
      </main>
      {shouldShowBottomNav && <BottomNav />}
    </div>
  );
};