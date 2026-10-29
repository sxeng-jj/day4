import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isConfigured);
  const [recovering, setRecovering] = useState(false); // 비밀번호 재설정 메일 링크로 들어온 상태

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      if (event === 'SIGNED_OUT') setRecovering(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => {
    const user = session?.user ?? null;
    return {
      configured: isConfigured,
      session,
      user,
      loading,
      recovering,
      nickname: user?.user_metadata?.nickname || user?.email?.split('@')[0] || '',

      // 회원가입: 닉네임은 user_metadata 에 저장된다.
      signUp: (email, password, nickname) =>
        supabase.auth.signUp({
          email,
          password,
          options: { data: { nickname }, emailRedirectTo: `${window.location.origin}/login` },
        }),
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signOut: () => supabase.auth.signOut(),
      updateNickname: (nickname) => supabase.auth.updateUser({ data: { nickname } }),

      // 비밀번호 재설정: 메일 발송 → 링크 클릭 → /reset 에서 새 비밀번호 저장
      sendReset: (email) => supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset` }),
      updatePassword: (password) => supabase.auth.updateUser({ password }),
    };
  }, [session, loading, recovering]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 는 AuthProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
