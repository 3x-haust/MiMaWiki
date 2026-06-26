import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthStore {
  isLoggedIn: boolean;
  user: null | { nickname: string };
  login: (nickname: string, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: null,

  login: (nickname, token) => {
    Cookies.set('authToken', token, { secure: true, sameSite: 'Strict' });
    Cookies.set('user', JSON.stringify({ nickname }), { secure: true, sameSite: 'Strict' });
    set({ isLoggedIn: true, user: { nickname } });
  },

  logout: () => {
    Cookies.remove('authToken');
    Cookies.remove('user');
    set({ isLoggedIn: false, user: null });
  },

  initializeAuth: () => {
    const token = Cookies.get('authToken');
    const user = Cookies.get('user');
    if (token && user) {
      set({ isLoggedIn: true, user: JSON.parse(user) });
    }
  },
}));
