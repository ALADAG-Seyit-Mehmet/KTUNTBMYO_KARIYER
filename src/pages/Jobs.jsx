import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  
  // Application Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [answers, setAnswers] = useState({});
  const [applying, setApplying] = useState(false);
  const [appError, setAppError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();
      if (data) {
        setUserProfile(data);
      }
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error("İlanlar çekilirken hata:", err.message);
      setError("İlanlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = async (job) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Başvuru yapabilmek için giriş yapmalısınız.");
      navigate('/login');
      return;
    }
    
    // Check if user already applied
    const { data: existingApp } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', job.id)
      .eq('student_id', session.user.id)
      .single();
      
    if (existingApp) {
      toast.error("Bu ilana zaten başvuru yaptınız.");
      return;
    }

    setSelectedJob(job);
    setAnswers({});
    setAppError(null);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);
    setAppError(null);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: selectedJob.id,
          student_id: session.user.id,
          answers: answers
        });

      if (error) throw error;
      
      toast.success("Başvurunuz başarıyla alındı!");
      setSelectedJob(null);
    } catch (err) {
      setAppError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (job.title?.toLowerCase() || '').includes(term) || 
      (job.company?.toLowerCase() || '').includes(term) ||
      (job.description?.toLowerCase() || '').includes(term);
      
    let typeValue = typeFilter;
    if (typeFilter === 'tam-zamanli') typeValue = 'Tam Zamanlı';
    if (typeFilter === 'yari-zamanli') typeValue = 'Yarı Zamanlı';
    if (typeFilter === 'staj') typeValue = 'Staj';

    const matchesType = typeFilter === 'all' || job.type === typeValue;
    
    return matchesSearch && matchesType;
  });

  return (
    <section className="job-listings" style={{ padding: '40px 0', minHeight: '60vh', position: 'relative' }}>
      <div className="container">
        <div className="section-title">
          <h2>Tüm İş ve Proje İlanları</h2>
          <p>Kariyerinize yön verecek fırsatlar</p>
        </div>

        <div className="search-box" style={{ 
          display: 'flex', 
          maxWidth: '800px', 
          margin: '0 auto 40px', 
          background: 'var(--white)', 
          padding: '10px', 
          borderRadius: '50px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid var(--border-color)',
          gap: '10px'
        }}>
          <input 
            type="text" 
            placeholder="Pozisyon, yetenek veya firma ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 2, border: 'none', padding: '10px 20px', outline: 'none', background: 'transparent', color: 'var(--text-dark)', fontSize: '1rem' }}
          />
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '10px 0' }}></div>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ flex: 1, border: 'none', padding: '10px', outline: 'none', background: 'transparent', color: 'var(--text-dark)', fontSize: '1rem', cursor: 'pointer' }}
          >
            <option value="all">Tüm İlan Türleri</option>
            <option value="tam-zamanli">Tam Zamanlı</option>
            <option value="yari-zamanli">Yarı Zamanlı</option>
            <option value="staj">Staj</option>
          </select>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>İlanlar Yükleniyor...</p>
        ) : filteredJobs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Aradığınız kriterlere uygun ilan bulunamadı.</p>
        ) : (
          <div className="job-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <h4 style={{ color: 'var(--primary-red)' }}>{job.company}</h4>
                <div style={{ margin: '15px 0', fontSize: '0.9em', color: 'var(--text-muted)' }}>
                  <p><i className="fa-solid fa-briefcase"></i> {job.type}</p>
                  <p><i className="fa-solid fa-location-dot"></i> {job.location}</p>
                  {job.department && <p><i className="fa-solid fa-building-columns" style={{marginRight: '5px'}}></i> {job.department}</p>}
                </div>
                <p style={{ fontSize: '0.9em', marginBottom: '20px', flexGrow: 1 }}>{job.description}</p>
                {(!userProfile || userProfile.user_type !== 'firma') && (
                  <button className="btn-submit" onClick={() => handleApplyClick(job)} style={{ marginTop: 'auto' }}>Başvur</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--white)', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '15px' }}>Başvuru Formu</h2>
            <p style={{ marginBottom: '20px', fontSize: '0.9em', color: 'var(--text-muted)' }}>Profil bilgileriniz firmanın erişimine açılacaktır.</p>
            
            {appError && <div style={{ color: '#E53935', marginBottom: '15px' }}>{appError}</div>}
            
            <form onSubmit={submitApplication}>
              {selectedJob.questions && selectedJob.questions.length > 0 ? (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '15px', color: '#E53935' }}>Firma Soruları:</h4>
                  {selectedJob.questions.map((q, idx) => (
                    <div key={idx} style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>{q}</label>
                      <textarea 
                        required
                        rows="3"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
                        value={answers[idx] || ''}
                        onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                        placeholder="Cevabınız..."
                      ></textarea>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ marginBottom: '20px' }}>Bu ilan için ek soru bulunmamaktadır. "Başvuruyu Tamamla" butonuna basarak profilinizi firmaya iletebilirsiniz.</p>
              )}
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setSelectedJob(null)} style={{ flex: 1, padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>İptal</button>
                <button type="submit" disabled={applying} style={{ flex: 2, padding: '10px', background: '#E53935', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  {applying ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Jobs;
