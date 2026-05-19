import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function PostDetailPage() {
  const { id } = useParams();
  const { db, currentUser, votePost, addComment, deleteComment, deletePost, updatePost } = useApp();
  const nav = useNavigate();
  const [comment, setComment] = useState('');
  const [edit, setEdit] = useState(false);
  const post = db.posts.find((p) => p.id === id);
  const comments = useMemo(() => db.comments.filter((c) => c.postId === id).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)), [db.comments, id]);
  if (!post) return <main className="container">Post not found</main>;
  const score = Object.values(post.votes).reduce((a,b)=>a+b,0);
  const isOwner = currentUser?.id === post.authorId;

  return <main className="container card"><h2>{post.title}</h2>{edit ? <textarea value={post.content} onChange={(e)=>updatePost(post.id,{content:e.target.value})} /> : <p>{post.content}</p>}{post.imageUrl && <img src={post.imageUrl} alt="post" className="thumb"/>}<p>Score: {score}</p><div className="row">{currentUser && <><button onClick={async ()=>votePost(post.id,1)}>Upvote</button><button onClick={async ()=>votePost(post.id,-1)}>Downvote</button></>}{isOwner && <><button onClick={()=>setEdit(!edit)}>{edit ? 'Done':'Edit'}</button><button onClick={async ()=>{await deletePost(post.id); nav('/');}}>Delete</button></>}</div><hr/>{currentUser && <form onSubmit={async (e)=>{e.preventDefault(); await addComment({postId:id, content:comment}); setComment('');}} className="form"><input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Add comment"/><button>Comment</button></form>}<h3>Comments</h3>{comments.map((c)=> <div className="comment" key={c.id}><small><Link to={`/profile/${c.authorId}`}>user</Link> - {new Date(c.createdAt).toLocaleString()}</small><p>{c.content}</p>{currentUser?.id===c.authorId && <button onClick={async ()=>deleteComment(c.id)}>Delete</button>}</div>)}</main>;
}
