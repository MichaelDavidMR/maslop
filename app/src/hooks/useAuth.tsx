import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import { toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface ProfileRow {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (supabaseSession: Session | null) => {
    if (!supabaseSession) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    setSession(supabaseSession);

    const db = supabase as any;

    const { data: profile, error } = await db
      .from('profiles')
      .select('id, email, name, role')
      .eq('id', supabaseSession.user.id)
      .maybeSingle();

    const typedProfile = profile as ProfileRow | null;

    if (typedProfile) {
      setUser({
        id: typedProfile.id,
        email: typedProfile.email,
        name: typedProfile.name ?? typedProfile.email.split('@')[0],
        role: typedProfile.role ?? 'user',
      });
    } else {
      console.warn('Profile not found', supabaseSession.user.id, error);
      setUser({
        id: supabaseSession.user.id,
        email: supabaseSession.user.email ?? '',
        name: supabaseSession.user.email?.split('@')[0] ?? 'Usuario',
        role: 'user',
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      loadProfile(s);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        loadProfile(s);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      toast.error('Credenciales incorrectas');
      setLoading(false);
      return false;
    }

    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    const db = supabase as any;

    const { data: profile } = await db
      .from('profiles')
      .select('role, name')
      .eq('id', data.user.id)
      .maybeSingle();

    const typedProfile = profile as { role?: string | null; name?: string | null } | null;

    if (!typedProfile || typedProfile.role !== 'admin') {
      await supabase.auth.signOut();
      toast.error('No tienes permisos de administrador');
      setLoading(false);
      return false;
    }

    toast.success(`Bienvenido, ${typedProfile.name ?? 'Administrador'}`);
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    toast.info('Sesión cerrada');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}