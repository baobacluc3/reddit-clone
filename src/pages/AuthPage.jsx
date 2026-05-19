import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login, register } = useApp();
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const action = isRegister ? register : login;
    const result = action(form);
    if (!result.ok) return setError(result.message);
    nav('/');
  };

  return <main className="container card"><h2>{isRegister ? 'Register' : 'Login'}</h2><form onSubmit={submit} className="form"><input placeholder="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /><input type="password" placeholder="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button>{isRegister ? 'Sign up' : 'Sign in'}</button></form>{error && <p>{error}</p>}<button onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Already have account' : 'Create account'}</button></main>;
}
