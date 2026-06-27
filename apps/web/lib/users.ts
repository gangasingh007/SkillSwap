import api from './api';

export async function fetchUserProfile(userId: string) {
  const { data } = await api.get(`/users/${userId}`);
  return data;
}

export async function fetchUserListings(userId: string) {
  const { data } = await api.get(`/listings`, { params: { userId } });
  return data;
}

export async function followUser(userId: string) {
  const { data } = await api.post(`/users/${userId}/follow`);
  return data;
}

export async function unfollowUser(userId: string) {
  const { data } = await api.delete(`/users/${userId}/follow`);
  return data;
}

export async function submitVouch(userId: string, vouchData: any) {
  const { data } = await api.post(`/vouches`, { recipientId: userId, ...vouchData });
  return data;
}

export async function updateUserProfile(profileData: any) {
  const { data } = await api.put(`/users/me`, profileData);
  return data;
}
