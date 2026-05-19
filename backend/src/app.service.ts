import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';

const uid = () => Math.random().toString(36).slice(2, 10);

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  private hydrate() {
    const db = this.databaseService.connection;
    const users = db.prepare('SELECT id, username, password, avatar, joined_at as joinedAt, karma FROM users').all();

    const communities = db.prepare(`
      SELECT c.id, c.name, c.description,
      COALESCE(json_group_array(cm.user_id) FILTER (WHERE cm.user_id IS NOT NULL), json('[]')) as members
      FROM communities c
      LEFT JOIN community_members cm ON cm.community_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all() as any[];

    const postsRaw = db.prepare('SELECT id, title, content, community_id as communityId, author_id as authorId, image_url as imageUrl, created_at as createdAt FROM posts ORDER BY datetime(created_at) DESC').all() as any[];
    const votesRaw = db.prepare('SELECT post_id as postId, user_id as userId, value FROM votes').all() as any[];
    const votesMap = new Map<string, Record<string, number>>();
    for (const row of votesRaw) {
      const current = votesMap.get(row.postId) ?? {};
      current[row.userId] = row.value;
      votesMap.set(row.postId, current);
    }

    const posts = postsRaw.map((p) => ({ ...p, votes: votesMap.get(p.id) ?? {} }));
    const comments = db.prepare('SELECT id, post_id as postId, author_id as authorId, content, parent_id as parentId, created_at as createdAt FROM comments ORDER BY datetime(created_at) DESC').all();

    return {
      users,
      communities: communities.map((c) => ({ ...c, members: JSON.parse(c.members) })),
      posts,
      comments,
    };
  }

  bootstrap() { return this.hydrate(); }

  register({ username, password }: any) {
    if (!username || !password) throw new BadRequestException('username and password are required');
    const db = this.databaseService.connection;
    const existed = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existed) return { ok: false, message: 'Username exists' };
    const user = { id: uid(), username, password, avatar: `https://i.pravatar.cc/120?u=${username}`, joinedAt: new Date().toISOString(), karma: 0 };
    db.prepare('INSERT INTO users (id, username, password, avatar, joined_at, karma) VALUES (?, ?, ?, ?, ?, ?)').run(user.id, user.username, user.password, user.avatar, user.joinedAt, user.karma);
    return { ok: true, user };
  }

  login({ username, password }: any) {
    const db = this.databaseService.connection;
    const user = db.prepare('SELECT id, username, password, avatar, joined_at as joinedAt, karma FROM users WHERE username = ? AND password = ?').get(username, password);
    if (!user) return { ok: false, message: 'Invalid credentials' };
    return { ok: true, user };
  }

  createCommunity({ name, description, userId }: any) {
    if (!name || !userId) throw new BadRequestException('name and userId are required');
    const db = this.databaseService.connection;
    const exists = db.prepare('SELECT id FROM communities WHERE LOWER(name) = LOWER(?)').get(name);
    if (exists) return this.hydrate();
    const id = uid();
    const trx = db.transaction(() => {
      db.prepare('INSERT INTO communities (id, name, description) VALUES (?, ?, ?)').run(id, name, description ?? '');
      db.prepare('INSERT INTO community_members (community_id, user_id) VALUES (?, ?)').run(id, userId);
    });
    trx();
    return this.hydrate();
  }

  joinLeaveCommunity(id: string, userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    const db = this.databaseService.connection;
    const membership = db.prepare('SELECT 1 FROM community_members WHERE community_id = ? AND user_id = ?').get(id, userId);
    if (membership) db.prepare('DELETE FROM community_members WHERE community_id = ? AND user_id = ?').run(id, userId);
    else db.prepare('INSERT INTO community_members (community_id, user_id) VALUES (?, ?)').run(id, userId);
    return this.hydrate();
  }

  createPost(post: any) {
    if (!post?.title || !post?.content || !post?.communityId || !post?.authorId) throw new BadRequestException('title, content, communityId, authorId are required');
    const db = this.databaseService.connection;
    const communityExists = db.prepare('SELECT id FROM communities WHERE id = ?').get(post.communityId);
    if (!communityExists) throw new NotFoundException('community not found');
    db.prepare('INSERT INTO posts (id, title, content, community_id, author_id, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(uid(), post.title, post.content, post.communityId, post.authorId, post.imageUrl ?? '', new Date().toISOString());
    return this.hydrate();
  }

  updatePost(id: string, patch: any) {
    const db = this.databaseService.connection;
    db.prepare('UPDATE posts SET title = ?, content = ?, image_url = ? WHERE id = ?').run(patch.title, patch.content, patch.imageUrl ?? '', id);
    return this.hydrate();
  }

  deletePost(id: string) {
    this.databaseService.connection.prepare('DELETE FROM posts WHERE id = ?').run(id);
    return this.hydrate();
  }

  votePost(id: string, userId: string, value: number) {
    const db = this.databaseService.connection;
    const existed = db.prepare('SELECT value FROM votes WHERE post_id = ? AND user_id = ?').get(id, userId) as any;
    if (existed?.value === value) db.prepare('DELETE FROM votes WHERE post_id = ? AND user_id = ?').run(id, userId);
    else db.prepare('INSERT INTO votes (post_id, user_id, value) VALUES (?, ?, ?) ON CONFLICT(post_id, user_id) DO UPDATE SET value = excluded.value').run(id, userId, value);
    return this.hydrate();
  }

  addComment({ postId, content, parentId = null, userId }: any) {
    if (!postId || !content || !userId) throw new BadRequestException('postId, content and userId are required');
    this.databaseService.connection.prepare('INSERT INTO comments (id, post_id, author_id, content, parent_id, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(uid(), postId, userId, content, parentId, new Date().toISOString());
    return this.hydrate();
  }

  deleteComment(id: string) {
    this.databaseService.connection.prepare('DELETE FROM comments WHERE id = ?').run(id);
    return this.hydrate();
  }
}
