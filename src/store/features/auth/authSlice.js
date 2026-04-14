import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login } from '../../../api/authApi';

const AUTH_STORAGE_KEY = 'pos_auth';

const roleAliasMap = {
  kitech: 'kitchen',
  chef: 'kitchen',
};

export const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toLowerCase();
  return roleAliasMap[normalized] || normalized;
};

export const getRoleHomePath = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'waiter') return '/waiter';
  if (normalizedRole === 'kitchen') return '/kitchen';
  if (normalizedRole === 'cashier') return '/cashier';
  if (normalizedRole === 'admin') return '/admin';
  return '/login';
};

const readPersistedAuth = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const user = parsed?.user ?? null;
    const accessToken = parsed?.accessToken ?? '';
    const refreshToken = parsed?.refreshToken ?? '';

    if (!user || !accessToken) {
      return null;
    }

    return {
      user: {
        ...user,
        role: normalizeRole(user?.role),
      },
      accessToken,
      refreshToken,
      isAuthenticated: true,
    };
  } catch {
    return null;
  }
};

const persistAuth = (payload) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

const clearPersistedAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem('user');
};

const persistedAuth = readPersistedAuth();

const initialState = {
  user: persistedAuth?.user ?? null,
  accessToken: persistedAuth?.accessToken ?? '',
  refreshToken: persistedAuth?.refreshToken ?? '',
  isAuthenticated: Boolean(persistedAuth?.isAuthenticated),
  isLoading: false,
  error: '',
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const result = await login({ identifier, password });
      const role = normalizeRole(result?.user?.role);

      return {
        user: {
          ...(result?.user || {}),
          role,
        },
        accessToken: result?.tokens?.accessToken || '',
        refreshToken: result?.tokens?.refreshToken || '',
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Unable to login';
      return rejectWithValue(message);
    }
  },
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshTokenThunk',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentRefreshToken = state.auth.refreshToken;
      
      if (!currentRefreshToken) {
        return rejectWithValue('No refresh token available');
      }

      // We use fetch or an un-intercepted axios call to avoid endless loops
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://orderly-backend-hy15.onrender.com/api')}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh token invalid or expired');
      }

      const data = await response.json();
      
      // Assuming backend returns { data: { accessToken, refreshToken, user... } }
      const payloadData = data?.data || data;
      
      return {
        accessToken: payloadData?.tokens?.accessToken || payloadData?.accessToken || '',
        refreshToken: payloadData?.tokens?.refreshToken || payloadData?.refreshToken || currentRefreshToken,
        user: payloadData?.user || state.auth.user, // optionally update user if provided
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to refresh token');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = '';
      state.refreshToken = '';
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = '';
      clearPersistedAuth();
    },
    clearAuthError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = '';

        persistAuth({
          user,
          accessToken,
          refreshToken,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.accessToken = '';
        state.refreshToken = '';
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload || 'Unable to login';
        clearPersistedAuth();
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        if (user) {
           state.user = {
            ...user,
            role: normalizeRole(user?.role),
          };
        }

        persistAuth({
          user: state.user,
          accessToken,
          refreshToken,
        });
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.user = null;
        state.accessToken = '';
        state.refreshToken = '';
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = 'Session expired, please login again';
        clearPersistedAuth();
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
