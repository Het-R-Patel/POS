import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/config';

// 1. Dashboard Thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const [orderStats, tableStats] = await Promise.all([
        axiosInstance.get('/orders/statistics').catch(() => ({ data: { data: {} } })),
        axiosInstance.get('/tables/statistics').catch(() => ({ data: { data: {} } }))
      ]);

      return {
        orderStats: orderStats.data?.data || orderStats.data || {},
        tableStats: tableStats.data?.data || tableStats.data || {},
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

// 2. Orders Thunks
export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchAdminOrders',
  async (params = { page: 1, limit: 10, sortBy: 'createdAt', order: 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders', { params });
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin orders');
    }
  }
);

// 3. Users Thunks
export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchAdminUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users').catch(() => ({ data: { data: [] } }));
      // Using mock fallback if endpoint doesn't exist
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const createAdminUser = createAsyncThunk(
  'admin/createAdminUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// 4. Menu Thunks
export const fetchAdminMenuItems = createAsyncThunk(
  'admin/fetchAdminMenuItems',
  async (params = { page: 1, limit: 50 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/menu-items', { params });
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu items');
    }
  }
);

const initialState = {
  dashboard: {
    stats: null,
    loading: false,
    error: null,
  },
  orders: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  },
  users: {
    list: [],
    loading: false,
    error: null,
  },
  menuItems: {
    list: [],
    loading: false,
    error: null,
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.payload;
      });

    // Admin Orders
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.orders.loading = true;
        state.orders.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders.loading = false;
        state.orders.list = action.payload.orders || action.payload || [];
        state.orders.total = action.payload.total || 0;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.orders.loading = false;
        state.orders.error = action.payload;
      });

    // Admin Users
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.list = action.payload.users || action.payload || [];
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.users.list.push(action.payload);
      });

    // Admin Menu Items
    builder
      .addCase(fetchAdminMenuItems.pending, (state) => {
        state.menuItems.loading = true;
        state.menuItems.error = null;
      })
      .addCase(fetchAdminMenuItems.fulfilled, (state, action) => {
        state.menuItems.loading = false;
        state.menuItems.list = action.payload.menuItems || action.payload || [];
      })
      .addCase(fetchAdminMenuItems.rejected, (state, action) => {
        state.menuItems.loading = false;
        state.menuItems.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
