import api from './api';
import { useAuthStore } from '@/store/auth';

export const initAuth = async () => {
  const { setAuth, setLoading } = useAuthStore.getState();
  
  try {
    setLoading(true);
    
    // Attempt to get a new access token using the refresh cookie
    const res = await api.post('/auth/refresh');
    const { accessToken } = res.data;
    
    // If successful, fetch the user's profile
    const userRes = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    setAuth(userRes.data, accessToken);
  } catch (error) {
    // If refresh fails, the user is not logged in or the session expired
    setAuth(null, null);
  } finally {
    setLoading(false);
  }
};

export const registerUser = async (data: any) => {
  const { setAuth } = useAuthStore.getState();
  const res = await api.post('/auth/register', data);
  const { accessToken, user } = res.data;
  setAuth(user, accessToken);
  return res.data;
};

export const loginUser = async (data: any) => {
  const { setAuth } = useAuthStore.getState();
  const res = await api.post('/auth/login', data);
  const { accessToken, user } = res.data;
  setAuth(user, accessToken);
  return res.data;
};

export const logoutUser = async () => {
  const { logout } = useAuthStore.getState();
  try {
    await api.post('/auth/logout');
  } finally {
    logout();
    window.location.href = '/';
  }
};
