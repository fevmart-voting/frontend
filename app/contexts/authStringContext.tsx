'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const AUTH_KEY = '';

type UserKeyContextType = {
  authKey: string | null;
  setAuthKey: (key: string) => void;
  clearAuthKey: () => void;
};

const AuthKeyContext = createContext<UserKeyContextType | undefined>(undefined);

export function AuthKeyProvider({ children }: { children: React.ReactNode }) {
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(AUTH_KEY);
      if (storedKey) {
        setAuthKey(storedKey);
      }
    } catch (error) {
      console.error('Ошибка при чтении localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);


  const updateAuthKey = (key: string) => {
    setAuthKey(key);
    try {
      localStorage.setItem(AUTH_KEY, key);
    } catch (error) {
      console.error('Ошибка при записи в localStorage:', error);
    }
  };

  const clearAuthKey = () => {
    setAuthKey(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.error('Ошибка при удалении из localStorage:', error);
    }
  };

  if (!isLoaded) {
    return <></>
  }

  return (
    <AuthKeyContext.Provider
      value={{
        authKey,
        setAuthKey: updateAuthKey,
        clearAuthKey,
      }}
    >
      {children}
    </AuthKeyContext.Provider>
  );
}

export function useAuthKey() {
  const context = useContext(AuthKeyContext);
  if (context === undefined) {
    throw new Error('useUserKey must be used within a UserKeyProvider');
  }
  return context;
}