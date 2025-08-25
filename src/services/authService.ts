// Firebase-based AuthService wrapper
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  User,
} from 'firebase/auth';

// These values should be provided via environment variables in a real app.
// For local development, you can paste your Firebase config below or use a .env file with CRA format (REACT_APP_*).
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration:', missingFields);
    throw new Error(`Firebase configuration incomplete. Missing: ${missingFields.join(', ')}. Please check your .env file.`);
  }
};

let app: any;
let auth: any;

try {
  validateFirebaseConfig();
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  // Create a mock auth object for development
  auth = {
    onAuthStateChanged: () => () => {},
    currentUser: null,
  };
}

export class AuthService {
  static onAuthState(callback: (user: User | null) => void) {
    if (!auth || !auth.onAuthStateChanged) {
      console.warn('Firebase not properly configured');
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }

  static async signup(email: string, password: string) {
    if (!auth || !auth.currentUser) {
      throw new Error('Firebase not properly configured. Please check your .env file.');
    }
    
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user && !cred.user.emailVerified) {
        try { 
          await sendEmailVerification(cred.user); 
        } catch (verificationError) {
          console.warn('Failed to send verification email:', verificationError);
        }
      }
      return cred.user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(error.message || 'Failed to create account');
    }
  }

  static async login(email: string, password: string) {
    if (!auth || !auth.currentUser) {
      throw new Error('Firebase not properly configured. Please check your .env file.');
    }
    
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  static async loginWithGoogle() {
    if (!auth || !auth.currentUser) {
      throw new Error('Firebase not properly configured. Please check your .env file.');
    }
    
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);
      return cred.user;
    } catch (e: any) {
      if (e?.code === 'auth/account-exists-with-different-credential') {
        const email = e?.customData?.email as string;
        const pendingCred = GoogleAuthProvider.credentialFromError?.(e);
        const methods = email ? await fetchSignInMethodsForEmail(auth, email) : [];
        if (methods.includes('github.com')) {
          // Sign in with GitHub then link Google
          const ghCred = await signInWithPopup(auth, new GithubAuthProvider());
          if (pendingCred) await linkWithCredential(ghCred.user, pendingCred);
          return ghCred.user;
        }
        if (methods.includes('password')) {
          // Surface pending credential to caller so it can be linked after email sign-in
          const err: any = new Error('This email is registered with Email/Password. Please sign in with email to link Google.');
          err.isLinkWithPassword = true;
          err.email = email;
          err.provider = 'google';
          err.pendingCredential = pendingCred;
          throw err;
        }
        throw new Error('Account exists with a different provider. Please sign in with that provider first, then try again.');
      } else if (e?.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled. Please try again.');
      } else if (e?.code === 'auth/popup-blocked') {
        throw new Error('Google sign-in popup was blocked. Please allow popups for this site.');
      }
      throw e;
    }
  }

  static async loginWithGitHub() {
    if (!auth || !auth.currentUser) {
      throw new Error('Firebase not properly configured. Please check your .env file.');
    }
    
    const provider = new GithubAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);
      return cred.user;
    } catch (e: any) {
      if (e?.code === 'auth/account-exists-with-different-credential') {
        const email = e?.customData?.email as string;
        const pendingCred = GithubAuthProvider.credentialFromError?.(e);
        const methods = email ? await fetchSignInMethodsForEmail(auth, email) : [];
        if (methods.includes('google.com')) {
          // Sign in with Google then link GitHub
          const gCred = await signInWithPopup(auth, new GoogleAuthProvider());
          if (pendingCred) await linkWithCredential(gCred.user, pendingCred);
          return gCred.user;
        }
        if (methods.includes('password')) {
          const err: any = new Error('This email is registered with Email/Password. Please sign in with email to link GitHub.');
          err.isLinkWithPassword = true;
          err.email = email;
          err.provider = 'github';
          err.pendingCredential = pendingCred;
          throw err;
        }
        throw new Error('Account exists with a different provider. Please sign in with that provider first, then try again.');
      } else if (e?.code === 'auth/popup-closed-by-user') {
        throw new Error('GitHub sign-in was cancelled. Please try again.');
      } else if (e?.code === 'auth/popup-blocked') {
        throw new Error('GitHub sign-in popup was blocked. Please allow popups for this site.');
      } else if (e?.code === 'auth/unauthorized-domain') {
        throw new Error('GitHub authentication is not configured for this domain. Please contact support.');
      }
      throw e;
    }
  }

  static async logout() {
    if (!auth || !auth.currentUser) {
      throw new Error('Firebase not properly configured. Please check your .env file.');
    }
    
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  // Helper method to check if Firebase is properly configured
  static isFirebaseConfigured(): boolean {
    return !!(auth && auth.currentUser !== undefined);
  }
}


