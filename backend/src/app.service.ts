const uid = () => Math.random().toString(36).slice(2, 10);

export class AppService {
  private db = {
    users: [{ id: 'u1', username: 'demo', password: '123456', avatar: 'https://i.pravatar.cc/120?img=3', joinedAt: new Date().toISOString(), karma: 120 }],
    communities: [
      { id: 'c1', name: 'reactjs', description: 'All things React', members: ['u1'] },
      { id: 'c2', name: 'frontend', description: 'Frontend discussion', members: ['u1'] },
    ],
    posts: [{ id: 'p1', title: 'Welcome to Reddit Clone', content: 'This is a portfolio-ready demo app with ReactJS.', communityId: 'c1', authorId: 'u1', imageUrl: '', votes: { u1: 1 }, createdAt: new Date().toISOString() }],
    comments: [] as any[],
  };

  bootstrap() { return this.db; }
  register({ username, password }: any) { if (this.db.users.some((u) => u.username === username)) return { ok: false, message: 'Username exists' }; const user = { id: uid(), username, password, avatar: `https://i.pravatar.cc/120?u=${username}`, joinedAt: new Date().toISOString(), karma: 0 }; this.db.users.push(user); return { ok: true, user }; }
  login({ username, password }: any) { const user = this.db.users.find((u) => u.username === username && u.password === password); if (!user) return { ok: false, message: 'Invalid credentials' }; return { ok: true, user }; }
  createCommunity({ name, description, userId }: any) { if (this.db.communities.some((c) => c.name.toLowerCase() === String(name).toLowerCase())) return this.db; this.db.communities.push({ id: uid(), name, description, members: [userId] }); return this.db; }
  joinLeaveCommunity(id: string, userId: string) { this.db.communities = this.db.communities.map((c) => c.id === id ? { ...c, members: c.members.includes(userId) ? c.members.filter((m) => m !== userId) : [...c.members, userId] } : c); return this.db; }
  createPost(post: any) { this.db.posts.unshift({ ...post, id: uid(), createdAt: new Date().toISOString(), votes: {} }); return this.db; }
  updatePost(id: string, patch: any) { this.db.posts = this.db.posts.map((p) => p.id === id ? { ...p, ...patch } : p); return this.db; }
  deletePost(id: string) { this.db.posts = this.db.posts.filter((p) => p.id !== id); this.db.comments = this.db.comments.filter((c) => c.postId !== id); return this.db; }
  votePost(id: string, userId: string, value: number) { this.db.posts = this.db.posts.map((p) => { if (p.id !== id) return p; const votes: any = { ...p.votes }; votes[userId] = votes[userId] === value ? 0 : value; return { ...p, votes }; }); return this.db; }
  addComment({ postId, content, parentId = null, userId }: any) { this.db.comments.push({ id: uid(), postId, content, parentId, authorId: userId, createdAt: new Date().toISOString() }); return this.db; }
  deleteComment(id: string) { this.db.comments = this.db.comments.filter((c) => c.id !== id && c.parentId !== id); return this.db; }
}
