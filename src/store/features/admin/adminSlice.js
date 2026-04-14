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
export const fetchOrderStatistics = createAsyncThunk(
  'admin/fetchOrderStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders/statistics');
      return response.data?.byStatus || response.data?.data?.byStatus || response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order statistics');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchAdminOrders',
  async (params = { page: 1, limit: 5, sortBy: 'createdAt', order: 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/orders', { params });
      
      const payloadData = response.data;
      const paginationData = response.pagination || payloadData?.pagination;
      
      // If interceptor unwrapped it or it doesn't have a wrapper
      if (Array.isArray(payloadData)) {
        return { 
          list: payloadData, 
          pagination: paginationData || { total: payloadData.length, page: params.page || 1, limit: params.limit || 5 } 
        };
      }
      
      return {
        list: payloadData?.data || [],
        pagination: paginationData || { total: 0, page: params.page || 1, limit: params.limit || 5 }
      };
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

export const updateAdminUser = createAsyncThunk(
  'admin/updateAdminUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteAdminUser = createAsyncThunk(
  'admin/deleteAdminUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return { id, ...(response.data?.data || response.data) };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const fetchAdminUserById = createAsyncThunk(
  'admin/fetchAdminUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

// 4. Menu Thunks
export const fetchAdminMenuItems = createAsyncThunk(
  'admin/fetchAdminMenuItems',
  async (params = { page: 1, limit: 50 }, { rejectWithValue }) => {
    try {
      // remove empty category to avoid filtering by empty string
      const cleanParams = { ...params };
      if (!cleanParams.category) {
        delete cleanParams.category;
      }
      const response = await axiosInstance.get('/menu-items', { params: cleanParams });
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu items');
    }
  }
);

export const createAdminMenuItem = createAsyncThunk(
  'admin/createAdminMenuItem',
  async (menuData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/menu-items', menuData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create menu item');
    }
  }
);

export const updateAdminMenuItem = createAsyncThunk(
  'admin/updateAdminMenuItem',
  async ({ id, menuData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/menu-items/${id}`, menuData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update menu item');
    }
  }
);

export const deleteAdminMenuItem = createAsyncThunk(
  'admin/deleteAdminMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/menu-items/${id}`);
      return { id, ...(response.data?.data || response.data) };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete menu item');
    }
  }
);

export const fetchAdminCategories = createAsyncThunk(
  'admin/fetchAdminCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/categories');
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchAdminAnalytics = createAsyncThunk(
  'admin/fetchAdminAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/analytics');
      return response.data?.data || response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
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
    pagination: {
      total: 0,
      page: 1,
      limit: 5
    },
    total: 0,
    loading: false,
    error: null,
  },
  orderStats: {
    data: null,
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
  categories: {
    list: [],
    loading: false,
    error: null,
  },
  analytics: {
    data: null,
    loading: false,
    error: null,
  }
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
        state.orders.list = action.payload.list || [];
        state.orders.pagination = action.payload.pagination;
        state.orders.total = action.payload.pagination?.total || 0;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.orders.loading = false;
        state.orders.error = action.payload;
      });

    // Order Statistics
    builder
      .addCase(fetchOrderStatistics.pending, (state) => {
        state.orderStats.loading = true;
        state.orderStats.error = null;
      })
      .addCase(fetchOrderStatistics.fulfilled, (state, action) => {
        state.orderStats.loading = false;
        state.orderStats.data = action.payload;
      })
      .addCase(fetchOrderStatistics.rejected, (state, action) => {
        state.orderStats.loading = false;
        state.orderStats.error = action.payload;
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
      })
      .addCase(updateAdminUser.fulfilled, (state, action) => {
        const index = state.users.list.findIndex((u) => (u.id || u._id) === (action.payload.id || action.payload._id));
        if (index !== -1) {
          state.users.list[index] = { ...state.users.list[index], ...action.payload };
        }
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.users.list = state.users.list.filter((u) => (u.id || u._id) !== action.payload.id);
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
      })
      .addCase(createAdminMenuItem.fulfilled, (state, action) => {
        state.menuItems.list.push(action.payload);
      })
      .addCase(updateAdminMenuItem.fulfilled, (state, action) => {
        const index = state.menuItems.list.findIndex((m) => (m.id || m._id) === (action.payload.id || action.payload._id));
        if (index !== -1) {
          state.menuItems.list[index] = { ...state.menuItems.list[index], ...action.payload };
        }
      })
      .addCase(deleteAdminMenuItem.fulfilled, (state, action) => {
        state.menuItems.list = state.menuItems.list.filter((m) => (m.id || m._id) !== action.payload.id);
      })
      // Admin Categories
      .addCase(fetchAdminCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.list = action.payload.categories || action.payload || [];
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })
      // Admin Analytics
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.analytics.loading = true;
        state.analytics.error = null;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false;
        state.analytics.data = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
