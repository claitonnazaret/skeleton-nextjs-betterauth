'use client';

/**
 * Context para gerenciar o header dinâmico do layout de autenticação
 * Permite que as páginas atualizem ícone, título e descrição do CardHeader
 */

import { LucideIcon } from 'lucide-react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface AuthLayoutContextValue {
  icon: LucideIcon | null;
  title: string;
  description: string;
  setHeader: (
    icon: LucideIcon | null,
    title: string,
    description: string
  ) => void;
}

const AuthLayoutContext = createContext<AuthLayoutContextValue | undefined>(
  undefined
);

export function AuthLayoutProvider({ children }: { children: ReactNode }) {
  const [icon, setIcon] = useState<LucideIcon | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const setHeader = useCallback(
    (newIcon: LucideIcon | null, newTitle: string, newDescription: string) => {
      setIcon(() => newIcon);
      setTitle(newTitle);
      setDescription(newDescription);
    },
    []
  );

  return (
    <AuthLayoutContext.Provider value={{ icon, title, description, setHeader }}>
      {children}
    </AuthLayoutContext.Provider>
  );
}

export function useAuthLayout() {
  const context = useContext(AuthLayoutContext);
  if (!context) {
    throw new Error(
      'useAuthLayout deve ser usado dentro de AuthLayoutProvider'
    );
  }
  return context;
}
