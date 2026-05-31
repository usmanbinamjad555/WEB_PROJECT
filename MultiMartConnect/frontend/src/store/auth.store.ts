import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface IdentityPayload {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SELLER' | 'CUSTOMER';
}

interface AuthState {
  accessToken: string | null;
  user: IdentityPayload | null;
  setSession: (token: string, profile: IdentityPayload) => void;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: (token, profile) => set({ accessToken: token, user: profile }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearSession: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'multimart-auth-vault',
      storage: createJSONStorage(() => localStorage),
    }
  )
);