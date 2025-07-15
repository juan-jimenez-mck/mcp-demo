import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@radix-ui/react-separator';
import { SidebarTrigger } from '../ui/sidebar';
import { useLocation } from 'react-router';
import LightModeSwitch from '@/features/theme/components/light-mode-switch';
import SearchDialog from '@/features/search/components/search-dialog';
import UserAvatar from '@/features/profile/components/user-avatar';
import { Fragment, useEffect } from 'react';
import { useProfileStore } from '@/features/profile/store';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/profile/api';

export default function Header() {
  const pathname = useLocation().pathname;
  const pathParts = pathname.split('/').filter(Boolean);

  const { user, setUser } = useProfileStore();
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  /**
   * Set the first user as the default user
   */
  useEffect(() => {
    if (users?.length && !user) {
      setUser(users[0]);
    }
  }, [users, user, setUser]);

  const breadcrumbItems = pathParts.map((part, index) => {
    const isLast = index === pathParts.length - 1;
    return (
      <Fragment key={part}>
        <BreadcrumbItem className="hidden md:block">
          {isLast ? (
            <BreadcrumbPage className="capitalize">{part}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              href={`/${pathParts.slice(0, index + 1).join('/')}`}
            >
              <span className="capitalize">{part}</span>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </Fragment>
    );
  });

  return (
    <header className="bg-background sticky top-0 z-11 flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbItems}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <SearchDialog />
        <LightModeSwitch />
        <UserAvatar />
      </div>
    </header>
  );
}
