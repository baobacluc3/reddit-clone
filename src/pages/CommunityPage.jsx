import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CommunityPage() {
  const { id } = useParams();
  const { db, currentUser, joinLeaveCommunity, createCommunity } = useApp();
  const [newC, setNewC] = useState({ name: '', description: '' });
  const community = db.communities.find((c) => c.id === id);
  const posts = useMemo(() => db.posts.filter((p) => p.communityId === id), [db.posts, id]);

  return <main className="container"><section className="card">{community ? <><h2>r/{community.name}</h2><p>{community.description}</p><p>Members: {community.members.length}</p>{currentUser && <button onClick={()=>joinLeaveCommunity(community.id)}>{community.members.includes(currentUser.id) ? 'Leave':'Join'}</button>}<h3>Posts</h3>{posts.map((p)=><p key={p.id}><Link to={`/post/${p.id}`}>{p.title}</Link></p>)}</> : <p>Community not found</p>}</section>{currentUser && <section className="card"><h3>Create Community</h3><form className="form" onSubmit={(e)=>{e.preventDefault(); createCommunity(newC); setNewC({name:'',description:''});}}><input placeholder="name" value={newC.name} onChange={(e)=>setNewC({...newC,name:e.target.value})}/><textarea placeholder="description" value={newC.description} onChange={(e)=>setNewC({...newC,description:e.target.value})}/><button>Create</button></form></section>}</main>;
}
