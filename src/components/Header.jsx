import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Header = ({ toggleTheme, theme }) => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        const { data } = await supabase.from('profiles').select('user_type').eq('id', session.user.id).single();
        setProfile(data);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const { data } = await supabase.from('profiles').select('user_type').eq('id', session.user.id).single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header>
      <div className="navbar" style={{ padding: '0 40px', maxWidth: '1600px', margin: '0 auto' }}>
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
        <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!session ? (
            <>
              <Link to="/login" className="btn-login">Giriş Yap</Link>
              <Link to="/register" className="btn-register">Kayıt Ol</Link>
            </>
          ) : (
            <>
              <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: '500' }}>Profilim</Link>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: '500' }}>Panel</Link>
              {profile?.user_type === 'firma' && (
                <Link to="/post-job" className="btn-register" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>İlan Ver</Link>
              )}
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', padding: '0' }}>Çıkış Yap</button>
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
