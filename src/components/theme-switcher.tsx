'use client';

import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeSwitcher = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  const ICON_SIZE = 16;

  // Determina o tema atual para exibição
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" suppressHydrationWarning>
          {currentTheme === 'light' ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          ) : currentTheme === 'dark' ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
