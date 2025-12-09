'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { ControlledLoginDialog } from './modal';

export interface LoginModalOptions {
  title?: string;
  description?: string;
}

interface LoginModalContextType {
  isOpen: boolean;
  showLoginModal: (options?: LoginModalOptions) => void;
  hideLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(
  undefined
);

interface LoginModalProviderProps {
  children: ReactNode;
  onLogin?: () => void | Promise<void>;
}

export function LoginModalProvider({
  children,
  onLogin,
}: LoginModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<LoginModalOptions>({
    title: 'Login Required',
    description:
      'You need to be logged in to continue. Please login to proceed.',
  });

  const showLoginModal = (newOptions?: LoginModalOptions) => {
    if (newOptions) {
      setOptions((prev) => ({ ...prev, ...newOptions }));
    }
    setIsOpen(true);
  };

  const hideLoginModal = () => {
    setIsOpen(false);
  };

  const handleLogin = async () => {
    if (onLogin) {
      await onLogin();
    }
    setIsOpen(false);
  };

  return (
    <LoginModalContext.Provider
      value={{
        isOpen,
        showLoginModal,
        hideLoginModal,
      }}
    >
      {children}

      {/* Global login modal */}
      <ControlledLoginDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={options.title}
        description={options.description}
        onLogin={handleLogin}
      />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (context === undefined) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }

  return context;
}
