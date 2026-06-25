import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Header = ({ toggleTheme, theme }) => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header>
      <div className="container navbar">
        <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img src="/logo.png" alt="KTÜN" style={{ height: '80px', marginRight: '15px' }} />
            <h1>KTÜNTBMYO<span>Kariyer</span></h1>
          </Link>
        </div>
        <nav>
          <ul>
            <li><Link to="/" className={path === '/' ? 'active' : ''}>Ana Sayfa</Link></li>
            <li><Link to="/jobs" className={path === '/jobs' ? 'active' : ''}>İş ve Proje İlanları</Link></li>
            <li><Link to="/companies" className={path === '/companies' ? 'active' : ''}>Firmalar</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!session ? (
            <>
              <Link to="/login" className="btn-login">Giriş Yap</Link>
              <Link to="/register" className="btn-register">Kayıt Ol</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn-login" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>Profilim</Link>
              <Link to="/dashboard" className="btn-login" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>Panel</Link>
              <Link to="/post-job" className="btn-submit" style={{ padding: '8px 15px' }}>İlan Ver</Link>
              <button onClick={handleLogout} className="btn-login" style={{ background: 'transparent', color: '#E53935' }}>Çıkış Yap</button>
            </>
          )}
          <button id="themeToggle" className="theme-toggle" onClick={toggleTheme}>
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
