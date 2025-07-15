import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useProfileStore } from '../store';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

export type ProfileSheetProps = {
  readonly isOpen: boolean;
  readonly setIsOpen: (isOpen: boolean) => void;
};

export default function ProfileSheet({ isOpen, setIsOpen }: ProfileSheetProps) {
  const { user, setUser } = useProfileStore();
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  /**
   * Handle user change
   * @param value - The value of the user
   */
  const handleUserChange = (value: string) => {
    const user = users?.find((user) => user.id === Number(value));
    if (user) {
      setUser(user);
    }
  };

  /**
   * Set the first user as the default user
   */
  useEffect(() => {
    if (users?.length && !user) {
      setUser(users[0]);
    }
  }, [users, user, setUser]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="px-2" autoFocus={false}>
        <SheetHeader className="pt-8">
          <SheetTitle asChild>
            <h2 className="text-2xl font-bold">Profile</h2>
          </SheetTitle>
          <Separator className="mt-4" />
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
          <Select onValueChange={handleUserChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.role} - {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <p>ID: {user?.id}</p>
            <p>Name: {user?.firstName}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
            {user?.territory && <p>Territory: {user?.territory.name}</p>}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
