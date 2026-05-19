import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const nav = useNavigate();
  return (
    <header className="nav">
      <Link to="/" className="logo">Reddit Clone</Link>
      <div className="nav-actions">
        {currentUser ? (
          <>
            <Link to="/create">Create Post</Link>
            <Link to={`/profile/${currentUser.id}`}>u/{currentUser.username}</Link>
            <button onClick={() => { logout(); nav('/'); }}>Logout</button>
          </>
        ) : <Link to="/auth">Login</Link>}
      </div>
    </header>
  );
}
