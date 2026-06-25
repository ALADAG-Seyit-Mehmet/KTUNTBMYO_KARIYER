import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentJobs();
  }, []);

  const fetchRecentJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setRecentJobs(data);
      }
    } catch (err) {
      console.error('Son ilanlar çekilirken hata:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    navigate(`/jobs?q=${encodeURIComponent(searchTerm)}&type=${typeFilter}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ 
        background: 'linear-gradient(135deg, var(--dark-red) 0%, var(--primary-red) 100%)',
        padding: '80px 0',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div className="container hero-content">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}>Geleceğin Mühendisleri ve Mimarları İçin Kariyer Fırsatları</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: '0.9' }}>Konya Teknik Üniversitesi öğrencilerine ve mezunlarına özel en güncel iş ve staj ilanlarını keşfedin.</p>

          <div className="search-box" style={{ 
            display: 'flex', 
            maxWidth: '800px', 
            margin: '0 auto', 
            background: 'var(--white)', 
            padding: '10px', 
            borderRadius: '50px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            gap: '10px'
          }}>
            <input 
              type="text" 
              placeholder="Pozisyon, yetenek veya firma ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ flex: 2, border: 'none', padding: '15px 20px', outline: 'none', background: 'transparent', color: 'var(--text-dark)', fontSize: '1rem' }}
            />
            <div style={{ width: '1px', background: 'var(--border-color)', margin: '10px 0' }}></div>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ flex: 1, border: 'none', padding: '15px 10px', outline: 'none', background: 'transparent', color: 'var(--text-dark)', fontSize: '1rem', cursor: 'pointer' }}
            >
              <option value="all">Tüm Türler</option>
              <option value="tam-zamanli">Tam Zamanlı</option>
              <option value="yari-zamanli">Yarı Zamanlı</option>
              <option value="staj">Staj</option>
            </select>
            <button 
              onClick={handleSearch}
              style={{ background: 'var(--primary-red)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '40px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', transition: 'var(--transition)' }}
            ><i className="fa-solid fa-search"></i> İş Bul</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 0', background: 'var(--bg-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="job-card" style={{ textAlign: 'center', padding: '30px' }}>
              <i className="fa-solid fa-paper-plane" style={{ fontSize: '3rem', color: 'var(--primary-red)', marginBottom: '20px' }}></i>
              <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>Kolay Başvuru</h3>
              <p style={{ color: 'var(--text-muted)' }}>Profilinizi bir kez oluşturun, size uygun tüm iş ve staj fırsatlarına tek tıkla hemen başvurun.</p>
            </div>
            <div className="job-card" style={{ textAlign: 'center', padding: '30px' }}>
              <i className="fa-solid fa-handshake" style={{ fontSize: '3rem', color: 'var(--primary-red)', marginBottom: '20px' }}></i>
              <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>Güvenilir Firmalar</h3>
              <p style={{ color: 'var(--text-muted)' }}>Sektörün öncü ve onaylanmış firmalarının özel ilanlarına doğrudan erişim sağlayın.</p>
            </div>
            <div className="job-card" style={{ textAlign: 'center', padding: '30px' }}>
              <i className="fa-solid fa-graduation-cap" style={{ fontSize: '3rem', color: 'var(--primary-red)', marginBottom: '20px' }}></i>
              <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>KTÜN Farkı</h3>
              <p style={{ color: 'var(--text-muted)' }}>Sadece Konya Teknik Üniversitesi öğrencilerine ve mezunlarına açık, ayrıcalıklı bir ekosistem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>En Yeni İlanlar</h2>
            <p style={{ color: 'var(--text-muted)' }}>Kariyerinize yön verecek en son fırsatları kaçırmayın.</p>
          </div>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>İlanlar yükleniyor...</p>
          ) : recentJobs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Henüz ilan bulunmamaktadır.</p>
          ) : (
            <div className="job-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {recentJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <h4 style={{ color: 'var(--primary-red)' }}>{job.company}</h4>
                  <div style={{ margin: '15px 0', fontSize: '0.9em', color: 'var(--text-muted)' }}>
                    <p><i className="fa-solid fa-briefcase"></i> {job.type}</p>
                    <p><i className="fa-solid fa-location-dot"></i> {job.location}</p>
                    {job.department && <p><i className="fa-solid fa-building-columns" style={{marginRight: '5px'}}></i> {job.department}</p>}
                  </div>
                  <p style={{ fontSize: '0.9em', marginBottom: '20px' }}>{job.description && job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</p>
                  <Link to="/jobs" className="btn-submit" style={{ display: 'inline-block', textAlign: 'center', background: 'transparent', color: 'var(--primary-red)', border: '1px solid var(--primary-red)' }}>
                    İlana Git
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
             <Link to="/jobs" className="btn-submit" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Tüm İlanları Gör</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 0', background: 'var(--primary-red)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Ekibinize Yeni Yetenekler mi Arıyorsunuz?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: '0.9', maxWidth: '600px', margin: '0 auto 30px' }}>
            KTÜNTBMYO Kariyer platformuna katılarak, üniversitemizin nitelikli öğrencilerine ve mezunlarına doğrudan ulaşın. Ücretsiz ilan verin, geleceğin yeteneklerini keşfedin.
          </p>
          <Link to="/post-job" className="btn-submit" style={{ background: 'white', color: 'var(--primary-red)', padding: '15px 40px', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Hemen İlan Ver
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
