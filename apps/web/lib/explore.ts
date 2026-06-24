import api from './api';

export async function fetchExploreCollections() {
  const { data } = await api.get('/explore');
  return data;
}
