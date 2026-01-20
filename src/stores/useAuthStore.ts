import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TOKEN_EXPIRY_DAYS = 30;

interface DriveInfo {
  rootFolderId: string;
  schedulesFolderId: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: {
    email: string;
    name: string;
    picture: string;
  } | null;
  accessToken: string | null;
  tokenExpiry: number | null;
  driveInfo: DriveInfo | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: AuthState['user'], accessToken: string) => void;
  setDriveInfo: (driveInfo: DriveInfo) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isTokenValid: () => boolean;
  clearExpiredToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      tokenExpiry: null,
      driveInfo: null,
      isLoading: false,
      error: null,

      setUser: (user, accessToken) => {
        const expiryTime = Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        set({
          isLoggedIn: true,
          user,
          accessToken,
          tokenExpiry: expiryTime,
          error: null,
        });
      },

      setDriveInfo: (driveInfo) => set({ driveInfo }),

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          tokenExpiry: null,
          driveInfo: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      isTokenValid: () => {
        const { tokenExpiry, accessToken } = get();
        if (!accessToken || !tokenExpiry) return false;
        return Date.now() < tokenExpiry;
      },

      clearExpiredToken: () => {
        const { isTokenValid } = get();
        if (!isTokenValid()) {
          set({
            isLoggedIn: false,
            user: null,
            accessToken: null,
            tokenExpiry: null,
            driveInfo: null,
          });
        }
      },
    }),
    {
      name: 'schedule-auth',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
        tokenExpiry: state.tokenExpiry,
        driveInfo: state.driveInfo,
      }),
    }
  )
);
