// src/contexts/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth0, User as Auth0User } from '@auth0/auth0-react';

interface AuthContextType {
  currentUser: Auth0User | undefined;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isLoading, loginWithRedirect, logout } = useAuth0();

  const signInWithGoogle = async () => {
    await loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } });
  };

  const signInWithGithub = async () => {
    await loginWithRedirect({ authorizationParams: { connection: 'github' } });
  };

  const signOut = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const value: AuthContextType = {
    currentUser: user,
    loading: isLoading,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
