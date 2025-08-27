// Deprecated Firebase-based auth removed. Keeping a thin facade for future use if needed.
export const AuthService = {
  isFirebaseConfigured: () => false,
  loginWithGoogle: async () => { throw new Error('Google/Firebase auth removed. Use Auth0.'); },
  logout: async () => { throw new Error('Firebase auth removed. Use Auth0.'); },
  onAuthState: (_callback: (_user: unknown) => void) => () => {},
};