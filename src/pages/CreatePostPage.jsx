import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CreatePostPage() {
  const { db, createPost } = useApp();
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', communityId: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (!form.communityId && db.communities.length > 0) {
      setForm((prev) => ({ ...prev, communityId: db.communities[0].id }));
    }
  }, [db.communities, form.communityId]);

  return (
    <main className="container card">
      <h2>Create Post</h2>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          try {
            await createPost(form);
            nav('/');
          } catch (err) {
            setError(err?.message || 'Create post failed');
          }
        }}
      >
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <select value={form.communityId} onChange={(e) => setForm({ ...form, communityId: e.target.value })}>
          {db.communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button>Create</button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
