import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PostDetailPage from './pages/PostDetailPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';

function ProtectedRoute({ children }) {
  const { currentUser } = useApp();
  return currentUser ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/community/:id" element={<CommunityPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
