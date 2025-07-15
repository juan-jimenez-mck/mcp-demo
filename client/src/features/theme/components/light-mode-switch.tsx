import { Themes } from '@/features/theme/constants';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';

export default function LightModeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === Themes.DARK;

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? Themes.LIGHT : Themes.DARK)}
      className={cn(
        'relative h-7 w-14 cursor-pointer rounded-full p-1 transition-colors duration-300',
        isDark ? 'bg-slate-700' : 'bg-slate-200',
      )}
    >
      <span
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300',
          isDark ? 'translate-x-7' : 'translate-x-0',
        )}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-slate-800" />
        ) : (
          <Sun className="h-3 w-3 text-amber-500" />
        )}
      </span>
    </button>
  );
}
