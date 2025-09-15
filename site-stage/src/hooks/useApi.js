import { useAuth } from '../context/AuthContext';

export const useApi = () => {
  const { authenticatedFetch } = useAuth();

  const api = {
    get: async (url) => {
      const response = await authenticatedFetch(url);
      return response.json();
    },
    post: async (url, data) => {
      const response = await authenticatedFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    put: async (url, data) => {
      const response = await authenticatedFetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    patch: async (url, data) => {
      const response = await authenticatedFetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (url) => {
      const response = await authenticatedFetch(url, {
        method: 'DELETE',
      });
      return response.json();
    },
  };

  return api;
};  