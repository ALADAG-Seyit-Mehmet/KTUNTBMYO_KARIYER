import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      navigate('/jobs'); // Başarılı girişte ilanlara yönlendir
    }
  };

  return (
    <div className="container auth-container" style={{ margin: '50px auto', maxWidth: '500px' }}>
      <h2>Hoş Geldiniz</h2>
      <p>KTÜNTBMYO Kariyer hesabınıza giriş yapın.</p>

      {error && <div style={{ color: '#E53935', marginBottom: '15px', padding: '10px', background: 'rgba(229,57,53,0.1)', borderRadius: '5px' }}>{error}</div>}

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">E-posta Adresiniz</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@ktun.edu.tr" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Şifreniz</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <div className="auth-switch" style={{ marginTop: '20px', textAlign: 'center' }}>
        Hesabınız yok mu? <Link to="/register" style={{ color: '#E53935', textDecoration: 'none', fontWeight: 'bold' }}>Hemen Kayıt Olun</Link>
      </div>
    </div>
  );
};

export default Login;
