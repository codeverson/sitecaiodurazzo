import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getAllowedEmails(): string[] {
  const raw = import.meta.env.VITE_FIREBASE_ADMIN_EMAILS ?? "araujo3ve@gmail.com,caiorocker@gmail.com";
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isFirebaseConfigured();
  const allowedEmails = useMemo(() => getAllowedEmails(), []);
  const googleProvider = useMemo(() => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return provider;
  }, []);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    let active = true;
    void setPersistence(auth, browserLocalPersistence).finally(() => {
      if (!active) return;
      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });
    });
    return () => {
      active = false;
    };
  }, [isConfigured]);

  const value = useMemo<AuthContextValue>(() => {
    const email = user?.email?.toLowerCase() ?? "";
    const isAdmin = Boolean(user && (allowedEmails.length === 0 || allowedEmails.includes(email)));
    return {
      user,
      loading,
      isConfigured,
      isAdmin,
      signIn: async () => {
        if (!isConfigured) throw new Error("Firebase não configurado.");
        await setPersistence(auth, browserLocalPersistence);
        await signInWithPopup(auth, googleProvider);
      },
      signOut: async () => {
        if (!isConfigured) return;
        await firebaseSignOut(auth);
      },
    };
  }, [allowedEmails, googleProvider, isConfigured, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
