import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
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

  return (
    <section className="job-listings" style={{ padding: '40px 0', minHeight: '60vh', position: 'relative' }}>
      <div className="container">
        <div className="section-title">
          <h2>Tüm İş ve Proje İlanları</h2>
          <p>Kariyerinize yön verecek fırsatlar</p>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>İlanlar Yükleniyor...</p>
        ) : jobs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Henüz ilan bulunmamaktadır.</p>
        ) : (
          <div className="job-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {jobs.map((job) => (
              <div key={job.id} className="job-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: '#fff' }}>{job.title}</h3>
                <h4 style={{ color: '#E53935' }}>{job.company}</h4>
                <div style={{ margin: '15px 0', fontSize: '0.9em', color: '#ccc' }}>
                  <p><i className="fa-solid fa-briefcase"></i> {job.type}</p>
                  <p><i className="fa-solid fa-location-dot"></i> {job.location}</p>
                  {job.department && <p><i className="fa-solid fa-building-columns" style={{marginRight: '5px'}}></i> {job.department}</p>}
                </div>
                <p style={{ fontSize: '0.9em', marginBottom: '20px' }}>{job.description}</p>
                {(!userProfile || userProfile.user_type !== 'firma') && (
                  <button className="btn-submit" onClick={() => handleApplyClick(job)}>Başvur</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '10px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '10px' }}>{selectedJob.title} - Başvuru</h3>
            <p style={{ marginBottom: '20px', fontSize: '0.9em', color: '#ccc' }}>Profil bilgileriniz firmanın erişimine açılacaktır.</p>
            
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
