import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CreatePostPage() {
  const { db, createPost } = useApp();
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', communityId: db.communities[0]?.id || '' });
  const nav = useNavigate();
  return <main className="container card"><h2>Create Post</h2><form className="form" onSubmit={(e) => { e.preventDefault(); createPost(form); nav('/'); }}><input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /><input placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /><select value={form.communityId} onChange={(e) => setForm({ ...form, communityId: e.target.value })}>{db.communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><button>Create</button></form></main>;
}
