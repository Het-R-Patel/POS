import axiosInstance from './config';

const extractAuthPayload = (payload = {}) => {
  const source = payload?.data ?? payload;

  return {
    user: source?.user ?? source?.profile ?? null,
    tokens: {
      accessToken:
        source?.tokens?.accessToken ??
        source?.accessToken ??
        source?.token ??
        '',
      refreshToken: source?.tokens?.refreshToken ?? source?.refreshToken ?? '',
    },
  };
};

export const login = async ({ identifier, password }) => {
  const response = await axiosInstance.post('/auth/login', {
    identifier,
    password,
  });

  return extractAuthPayload(response.data);
};

export const refreshToken = async (token) => {
  const response = await axiosInstance.post('/auth/refresh-token', {
    refreshToken: token,
  });

  return extractAuthPayload(response.data);
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  const source = response.data?.data ?? response.data;
  return source?.user ?? source;
};

export const changePassword = async ({ currentPassword, newPassword, confirmNewPassword }) => {
  const response = await axiosInstance.patch('/auth/change-password', {
    currentPassword,
    newPassword,
    confirmNewPassword,
  });

  return extractAuthPayload(response.data);
};

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data?.data ?? response.data;
};
