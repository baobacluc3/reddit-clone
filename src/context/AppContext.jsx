import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [db, setDb] = useState({ users: [], communities: [], posts: [], comments: [] });
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('reddit_clone_user') || null);

  useEffect(() => {
    api.bootstrap().then(setDb).catch(() => {});
  }, []);

  const register = async ({ username, password }) => {
    const result = await api.register({ username, password });
    if (!result.ok) return result;
    setCurrentUserId(result.user.id);
    localStorage.setItem('reddit_clone_user', result.user.id);
    setDb((prev) => ({ ...prev, users: [...prev.users, result.user] }));
    return { ok: true };
  };

  const login = async ({ username, password }) => {
    const result = await api.login({ username, password });
    if (!result.ok) return result;
    setCurrentUserId(result.user.id);
    localStorage.setItem('reddit_clone_user', result.user.id);
    if (!db.users.some((u) => u.id === result.user.id)) {
      setDb((prev) => ({ ...prev, users: [...prev.users, result.user] }));
    }
    return { ok: true };
  };

  const logout = () => { setCurrentUserId(null); localStorage.removeItem('reddit_clone_user'); };

  const createCommunity = async ({ name, description }) => setDb(await api.createCommunity({ name, description, userId: currentUserId }));
  const joinLeaveCommunity = async (communityId) => setDb(await api.joinLeaveCommunity(communityId, { userId: currentUserId }));
  const createPost = async (post) => setDb(await api.createPost({ ...post, authorId: currentUserId }));
  const updatePost = async (postId, patch) => setDb(await api.updatePost(postId, patch));
  const deletePost = async (postId) => setDb(await api.deletePost(postId));
  const votePost = async (postId, value) => setDb(await api.votePost(postId, { userId: currentUserId, value }));
  const addComment = async ({ postId, content, parentId = null }) => setDb(await api.addComment({ postId, content, parentId, userId: currentUserId }));
  const deleteComment = async (commentId) => setDb(await api.deleteComment(commentId));

  const currentUser = db.users.find((u) => u.id === currentUserId) || null;

  const value = useMemo(() => ({ db, currentUser, register, login, logout, createCommunity, joinLeaveCommunity, createPost, updatePost, deletePost, votePost, addComment, deleteComment }), [db, currentUser]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
