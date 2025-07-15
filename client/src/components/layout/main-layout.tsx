import { Outlet } from 'react-router';
import { SidebarProvider } from '../ui/sidebar';
import { SidebarInset } from '@/components/ui/sidebar';

import NavigationSidebar from '@/features/navigation/components/navigation-sidebar';
import Header from './header';
import { useNavigationStore } from '@/features/navigation/store';

export default function MainLayout() {
  const { openSidebar, setOpenSidebar } = useNavigationStore();

  return (
    <SidebarProvider open={openSidebar} onOpenChange={setOpenSidebar}>
      <NavigationSidebar />
      <SidebarInset className="overflow-x-hidden">
        <div className="flex h-screen flex-col overflow-hidden">
          <Header />
          <main className="h-full flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
