import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { id } = useParams();
  const { db } = useApp();
  const user = db.users.find((u) => u.id === id);
  const posts = db.posts.filter((p) => p.authorId === id);
  if (!user) return <main className="container">User not found</main>;
  return <main className="container card"><img src={user.avatar} alt="avatar" className="avatar"/><h2>u/{user.username}</h2><p>Karma: {user.karma}</p><p>Joined: {new Date(user.joinedAt).toLocaleDateString()}</p><h3>Posts</h3>{posts.map((p)=><p key={p.id}><Link to={`/post/${p.id}`}>{p.title}</Link></p>)}</main>;
}
