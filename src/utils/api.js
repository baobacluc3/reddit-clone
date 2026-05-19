const BASE_URL = 'http://localhost:3001/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'API request failed');
  }
  return data;
}

export const api = {
  bootstrap: () => req('/bootstrap'),
  register: (payload) => req('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => req('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  createCommunity: (payload) => req('/communities', { method: 'POST', body: JSON.stringify(payload) }),
  joinLeaveCommunity: (id, payload) => req(`/communities/${id}/join`, { method: 'PATCH', body: JSON.stringify(payload) }),
  createPost: (payload) => req('/posts', { method: 'POST', body: JSON.stringify(payload) }),
  updatePost: (id, payload) => req(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deletePost: (id) => req(`/posts/${id}`, { method: 'DELETE' }),
  votePost: (id, payload) => req(`/posts/${id}/vote`, { method: 'PATCH', body: JSON.stringify(payload) }),
  addComment: (payload) => req('/comments', { method: 'POST', body: JSON.stringify(payload) }),
  deleteComment: (id) => req(`/comments/${id}`, { method: 'DELETE' }),
};
