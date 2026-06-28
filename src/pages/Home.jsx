import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentJobs();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from('profiles')
        .select('user_type, skills')
        .eq('id', session.user.id)
        .single();
      if (data) {
        setUserProfile(data);
        if ((data.user_type === 'ogrenci' || data.user_type === 'mezun') && data.skills) {
          fetchRecommendedJobs(data.skills);
        }
      }
    }
  };

  const fetchRecommendedJobs = async (skills) => {
    try {
      const { data, error } = await supabase.from('jobs').select('*');
      if (!error && data) {
        const userSkills = skills.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
        if (userSkills.length > 0) {
           const recommended = data.filter(job => {
             const jobText = `${job.keywords || ''} ${job.description || ''}`.toLowerCase();
             return userSkills.some(skill => jobText.includes(skill));
           });
           
           // Sort by creation date
           recommended.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
           setRecommendedJobs(recommended.slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Önerilen ilanlar çekilirken hata:', err.message);
    }
  };

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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}>Geleceğin Teknikerleri İçin Kariyer Fırsatları</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: '0.9' }}>Konya Teknik Üniversitesi Teknik Bilimler Meslek Yüksekokulu öğrencilerine ve mezunlarına özel en güncel iş ve staj ilanlarını keşfedin.</p>

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

      {/* Recommended Jobs Section */}
      {userProfile && (userProfile.user_type === 'ogrenci' || userProfile.user_type === 'mezun') && userProfile.skills && (
        <section style={{ padding: '60px 0', background: '#f9f9f9' }}>
          <div className="container">
            <div className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Size Özel Önerilen İlanlar</h2>
              <p style={{ color: 'var(--text-muted)' }}>Profilinizdeki yeteneklerinize uygun olarak seçilmiştir.</p>
            </div>
            
            {recommendedJobs.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Profilinizdeki yeteneklere tam uygun ilan şu an bulunmuyor.</p>
            ) : (
              <div className="job-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="job-card" style={{ border: '1px solid var(--primary-red)' }}>
                    <h3>{job.title}</h3>
                    <h4 style={{ color: 'var(--primary-red)' }}>{job.company}</h4>
                    <div style={{ margin: '15px 0', fontSize: '0.9em', color: 'var(--text-muted)' }}>
                      <p><i className="fa-solid fa-briefcase"></i> {job.type}</p>
                      <p><i className="fa-solid fa-location-dot"></i> {job.location}</p>
                      {job.department && <p><i className="fa-solid fa-building-columns" style={{marginRight: '5px'}}></i> {job.department}</p>}
                    </div>
                    <p style={{ fontSize: '0.9em', marginBottom: '20px', flexGrow: 1 }}>{job.description && job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</p>
                    <Link to="/jobs" className="btn-submit" style={{ display: 'inline-block', textAlign: 'center', background: 'var(--primary-red)', color: 'white', marginTop: 'auto' }}>
                      İlana Git
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

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
                  <p style={{ fontSize: '0.9em', marginBottom: '20px', flexGrow: 1 }}>{job.description && job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}</p>
                  <Link to="/jobs" className="btn-submit" style={{ display: 'inline-block', textAlign: 'center', background: 'transparent', color: 'var(--primary-red)', border: '1px solid var(--primary-red)', marginTop: 'auto' }}>
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
