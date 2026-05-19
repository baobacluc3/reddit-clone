import { Injectable, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db!: Database.Database;

  onModuleInit() {
    const dbPath = path.resolve(process.cwd(), 'backend', 'data.sqlite');
    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');
    this.createSchema();
    this.seedIfEmpty();
  }

  get connection() {
    return this.db;
  }

  private createSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar TEXT NOT NULL,
        joined_at TEXT NOT NULL,
        karma INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS communities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS community_members (
        community_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        PRIMARY KEY (community_id, user_id),
        FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        community_id TEXT NOT NULL,
        author_id TEXT NOT NULL,
        image_url TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS votes (
        post_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        value INTEGER NOT NULL CHECK (value IN (-1, 1)),
        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        author_id TEXT NOT NULL,
        content TEXT NOT NULL,
        parent_id TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
      );
    `);
  }

  private seedIfEmpty() {
    const totalUsers = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    if (totalUsers.count > 0) return;

    const now = new Date().toISOString();
    const trx = this.db.transaction(() => {
      this.db.prepare('INSERT INTO users (id, username, password, avatar, joined_at, karma) VALUES (?, ?, ?, ?, ?, ?)').run('u1', 'demo', '123456', 'https://i.pravatar.cc/120?img=3', now, 120);
      this.db.prepare('INSERT INTO communities (id, name, description) VALUES (?, ?, ?)').run('c1', 'reactjs', 'All things React');
      this.db.prepare('INSERT INTO communities (id, name, description) VALUES (?, ?, ?)').run('c2', 'frontend', 'Frontend discussion');
      this.db.prepare('INSERT INTO community_members (community_id, user_id) VALUES (?, ?)').run('c1', 'u1');
      this.db.prepare('INSERT INTO community_members (community_id, user_id) VALUES (?, ?)').run('c2', 'u1');
      this.db.prepare('INSERT INTO posts (id, title, content, community_id, author_id, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run('p1', 'Welcome to Reddit Clone', 'This is a portfolio-ready demo app with ReactJS.', 'c1', 'u1', '', now);
      this.db.prepare('INSERT INTO votes (post_id, user_id, value) VALUES (?, ?, ?)').run('p1', 'u1', 1);
    });

    trx();
  }
}
