/**
 * useAuth — authentication hook
 * Adapted from dfl-learn's AuthContext (most complete implementation).
 * Supabase client is injected via AuthProvider — not hardcoded.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import type { SupabaseClient, User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  onboarding_completed_at: string | null;
}

/**
 * The `profiles` columns the provider reads. Never `*`: on DFL prod the
 * `authenticated` role has no SELECT on `profiles.email`, so `select("*")`
 * fails with 42501 ("permission denied for table profiles") and `profile`
 * stayed null in every app (measured 2026-11-10). `email` comes from the
 * session user instead.
 */
export const PROFILE_COLUMNS =
  "id, name, avatar_url, created_at, updated_at, onboarding_completed_at";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  supabase: SupabaseClient;
  /** Optional: table name for profiles. Defaults to 'profiles'. */
  profilesTable?: string;
  /** Optional: columns to read. Defaults to PROFILE_COLUMNS (never `*`). */
  profileColumns?: string;
}

export const AuthProvider = ({
  children,
  supabase,
  profilesTable = "profiles",
  profileColumns = PROFILE_COLUMNS,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const userRef = useRef<User | null>(null);

  const isLoading = authLoading || profileLoading;

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await (supabase as any)
          .from(profilesTable)
          .select(profileColumns)
          .eq("id", userId)
          .single();
        if (error) throw error;
        const email = (data as { email?: string | null }).email ?? userRef.current?.email ?? "";
        setProfile({ ...(data as UserProfile), email });
      } catch {
        // Profile fetch failure is non-fatal
        setProfile(null);
      }
    },
    [supabase, profilesTable, profileColumns]
  );

  const refreshProfile = useCallback(async () => {
    if (userRef.current) {
      await fetchProfile(userRef.current.id);
    }
  }, [fetchProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      fetchProfile(user.id).finally(() => setProfileLoading(false));
    } else {
      setProfile(null);
    }
  }, [user?.id, fetchProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error as Error | null };
    },
    [supabase]
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error: error as Error | null };
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isLoading,
      login,
      signup,
      logout,
      refreshProfile,
    }),
    [user, session, profile, isLoading, login, signup, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const useSession = (): Session | null => {
  const { session } = useAuth();
  return session;
};
