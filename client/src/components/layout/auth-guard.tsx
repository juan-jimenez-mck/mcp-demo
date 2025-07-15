import { useProfileStore } from '@/features/profile/store';
import api from '@/lib/api';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/profile/api';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useProfileStore();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  useEffect(() => {
    if (users?.length && !user) {
      const defaultUser = users[0];
      setUser(defaultUser);
      api.set_AuthToken(defaultUser.id.toString());
    }
  }, [user, users, setUser]);

  if (!user) {
    return <Loader2 className="animate-spin" />;
  }

  return <>{children}</>;
}
