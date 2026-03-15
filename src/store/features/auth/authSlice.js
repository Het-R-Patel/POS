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
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
