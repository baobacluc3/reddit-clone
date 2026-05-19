import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { db } = useApp();
  const [sort, setSort] = useState('new');
  const [q, setQ] = useState('');

  const posts = useMemo(() => {
    const mapComments = Object.groupBy(db.comments, (c) => c.postId);
    return db.posts
      .filter((p) => (p.title + p.content).toLowerCase().includes(q.toLowerCase()))
      .map((p) => ({ ...p, score: Object.values(p.votes).reduce((a, b) => a + b, 0), comments: (mapComments[p.id] || []).length }))
      .sort((a, b) => {
        if (sort === 'top') return b.score - a.score;
        if (sort === 'hot') return (b.score + b.comments) - (a.score + a.comments);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [db, sort, q]);

  const topCommunities = [...db.communities].sort((a, b) => b.members.length - a.members.length).slice(0, 5);

  return <main className="layout"><section><div className="card controls"><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="new">New</option><option value="top">Top</option><option value="hot">Hot</option></select><input placeholder="Search posts..." value={q} onChange={(e) => setQ(e.target.value)} /></div>{posts.map((p) => <article className="card" key={p.id}><h3><Link to={`/post/${p.id}`}>{p.title}</Link></h3><p>{p.content.slice(0, 120)}</p><small>Votes: {p.score} • Comments: {p.comments}</small></article>)}</section><aside className="card"><h4>Top Communities</h4>{topCommunities.map((c) => <p key={c.id}><Link to={`/community/${c.id}`}>r/{c.name}</Link> ({c.members.length})</p>)}</aside></main>;
}
