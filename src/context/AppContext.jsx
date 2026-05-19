import { createContext, useContext, useMemo, useState } from 'react';
import { loadData, saveData } from '../utils/storage';

const AppContext = createContext();

const uid = () => Math.random().toString(36).slice(2, 10);

export function AppProvider({ children }) {
  const [db, setDb] = useState(loadData());
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('reddit_clone_user') || null);

  const persist = (updater) => {
    setDb((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveData(next);
      return next;
    });
  };

  const register = ({ username, password }) => {
    if (db.users.some((u) => u.username === username)) return { ok: false, message: 'Username exists' };
    const user = { id: uid(), username, password, avatar: `https://i.pravatar.cc/120?u=${username}`, joinedAt: new Date().toISOString(), karma: 0 };
    persist((prev) => ({ ...prev, users: [...prev.users, user] }));
    return login({ username, password });
  };

  const login = ({ username, password }) => {
    const user = db.users.find((u) => u.username === username && u.password === password);
    if (!user) return { ok: false, message: 'Invalid credentials' };
    setCurrentUserId(user.id);
    localStorage.setItem('reddit_clone_user', user.id);
    return { ok: true };
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('reddit_clone_user');
  };

  const createCommunity = ({ name, description }) => {
    const exists = db.communities.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) return;
    persist((prev) => ({ ...prev, communities: [...prev.communities, { id: uid(), name, description, members: [currentUserId] }] }));
  };

  const joinLeaveCommunity = (communityId) => {
    persist((prev) => ({
      ...prev,
      communities: prev.communities.map((c) => c.id === communityId ? { ...c, members: c.members.includes(currentUserId) ? c.members.filter((m) => m !== currentUserId) : [...c.members, currentUserId] } : c),
    }));
  };

  const createPost = (post) => persist((prev) => ({ ...prev, posts: [{ ...post, id: uid(), authorId: currentUserId, createdAt: new Date().toISOString(), votes: {} }, ...prev.posts] }));
  const updatePost = (postId, patch) => persist((prev) => ({ ...prev, posts: prev.posts.map((p) => p.id === postId ? { ...p, ...patch } : p) }));
  const deletePost = (postId) => persist((prev) => ({ ...prev, posts: prev.posts.filter((p) => p.id !== postId), comments: prev.comments.filter((c) => c.postId !== postId) }));

  const votePost = (postId, value) => persist((prev) => ({
    ...prev,
    posts: prev.posts.map((p) => {
      if (p.id !== postId) return p;
      const votes = { ...p.votes };
      votes[currentUserId] = votes[currentUserId] === value ? 0 : value;
      return { ...p, votes };
    }),
  }));

  const addComment = ({ postId, content, parentId = null }) => persist((prev) => ({ ...prev, comments: [...prev.comments, { id: uid(), postId, content, parentId, authorId: currentUserId, createdAt: new Date().toISOString() }] }));
  const deleteComment = (commentId) => persist((prev) => ({ ...prev, comments: prev.comments.filter((c) => c.id !== commentId && c.parentId !== commentId) }));

  const currentUser = db.users.find((u) => u.id === currentUserId) || null;

  const value = useMemo(() => ({ db, currentUser, register, login, logout, createCommunity, joinLeaveCommunity, createPost, updatePost, deletePost, votePost, addComment, deleteComment }), [db, currentUser]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
