import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { User, Settings, HelpCircle, LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import ProfileSheet from './profile-sheet';
import { useProfileStore } from '../store';
import { getUserInitials } from '../utils';

export default function UserAvatar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useProfileStore();

  const handleProfileSheetOpen = (isOpen: boolean) => {
    // Always update the profile sheet state
    setIsOpen(isOpen);

    // If closing the profile sheet, ensure dropdown is also closed
    if (!isOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer" onClick={() => setMenuOpen(true)}>
            <AvatarFallback className="text-sm">
              {user ? (
                getUserInitials(user)
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            {user?.firstName} {user?.lastName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(true);
                setMenuOpen(false);
              }}
            >
              <User />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to="/support">
                <HelpCircle />
                <span>Support</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileSheet isOpen={isOpen} setIsOpen={handleProfileSheetOpen} />
    </>
  );
}
