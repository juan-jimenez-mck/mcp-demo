import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useEffect, type ComponentProps } from 'react';
import { MAIN_ROUTES, INTERNAL_ROUTES } from '../constants';
import { Link, useLocation, useNavigate } from 'react-router';
import logo from '@/assets/logo.png';
import { useSidebar } from '@/hooks/use-sidebar';
import { useProfileStore } from '@/features/profile/store';
import { Loader2, MoreHorizontal, Trash } from 'lucide-react';
import { useChatStore } from '@/features/chat/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type NavigationSidebarProps = ComponentProps<typeof Sidebar>;

export default function NavigationSidebar({
  ...props
}: NavigationSidebarProps) {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { user } = useProfileStore();
  const { sessions, fetchUserSessions, isLoading } = useChatStore();

  useEffect(() => {
    if (user?.id) {
      fetchUserSessions();
    }
  }, [user?.id, fetchUserSessions]);

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader>
        <div
          className="flex items-center gap-3 px-1 pt-2 pb-4"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
          {open && <h1 className="xs:hidden text-lg font-bold">ChaQi</h1>}
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-4">
        {MAIN_ROUTES.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === '/'
                          ? pathname === item.path
                          : pathname.includes(item.path) && item.path !== '/'
                      }
                    >
                      <Link to={item.path}>
                        <item.Icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarSeparator />
        {open && (
          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(sessions || []).length > 0 ? (
                  sessions?.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <div className="flex w-full items-end justify-between gap-2">
                        <SidebarMenuButton
                          asChild
                          className="block min-w-0 flex-1 truncate"
                        >
                          <Link to={`/chat/${item.id}`} className="truncate">
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="size-6" asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Trash /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <SidebarMenuItem />
                )}
                {isLoading && (
                  <SidebarMenuItem>
                    <Loader2 className="animate-spin" />
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        {INTERNAL_ROUTES.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === '/'
                          ? pathname === item.path
                          : pathname.includes(item.path) && item.path !== '/'
                      }
                    >
                      <Link to={item.path}>
                        <item.Icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
