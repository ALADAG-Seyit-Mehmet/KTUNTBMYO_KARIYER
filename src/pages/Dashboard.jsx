import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }
    
    setUser(session.user);
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    setProfile(profileData);

    if (profileData?.user_type === 'firma') {
      // Firma ise: Kendi ilanlarına gelen başvuruları çek
      const { data: myJobs } = await supabase.from('jobs').select('id').eq('user_id', session.user.id);
      
      if (myJobs && myJobs.length > 0) {
        const jobIds = myJobs.map(j => j.id);
        const { data: apps } = await supabase
          .from('applications')
          .select(`
            *,
            job:job_id(title),
            student:student_id(full_name, skills, bio, linkedin_url, github_url)
          `)
          .in('job_id', jobIds)
          .order('created_at', { ascending: false });
          
        setApplications(apps || []);
      }
    } else {
      // Öğrenci/Mezun ise: Kendi başvurularını çek
      const { data: apps } = await supabase
        .from('applications')
        .select(`
          *,
          job:job_id(title, company)
        `)
        .eq('student_id', session.user.id)
        .order('created_at', { ascending: false });
        
      setApplications(apps || []);
    }
    
    setLoading(false);
  };

  const updateStatus = async (appId, newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId);
      
    if (!error) {
      setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Yükleniyor...</div>;
  if (!user) return <div style={{textAlign:'center', marginTop:'50px'}}>Lütfen giriş yapın.</div>;

  return (
    <div className="container" style={{ margin: '40px auto' }}>
      <div className="section-title">
        <h2>Kontrol Paneli</h2>
        <p>{profile?.user_type === 'firma' ? 'İlanlarınıza gelen başvurular' : 'Yaptığınız iş başvuruları'}</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
        {applications.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Henüz başvuru bulunmamaktadır.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <th style={{ padding: '10px' }}>{profile?.user_type === 'firma' ? 'Aday Adı' : 'Firma - Pozisyon'}</th>
                {profile?.user_type === 'firma' && <th style={{ padding: '10px' }}>Cevaplar & Yetenekler</th>}
                <th style={{ padding: '10px' }}>Tarih</th>
                <th style={{ padding: '10px' }}>Durum</th>
                {profile?.user_type === 'firma' && <th style={{ padding: '10px' }}>İşlem</th>}
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '10px' }}>
                    {profile?.user_type === 'firma' ? (
                      <>
                        <strong>{app.student?.full_name}</strong>
                        <div style={{ fontSize: '0.8em', color: '#aaa', marginTop: '5px' }}>İlan: {app.job?.title}</div>
                      </>
                    ) : (
                      <>
                        <strong>{app.job?.company}</strong>
                        <div style={{ fontSize: '0.8em', color: '#aaa', marginTop: '5px' }}>{app.job?.title}</div>
                      </>
                    )}
                  </td>
                  
                  {profile?.user_type === 'firma' && (
                    <td style={{ padding: '10px', fontSize: '0.9em' }}>
                      <div style={{ marginBottom: '5px' }}><strong>Yetenekler:</strong> {app.student?.skills || 'Belirtilmemiş'}</div>
                      {Object.keys(app.answers || {}).length > 0 && (
                        <details>
                          <summary style={{ cursor: 'pointer', color: '#E53935' }}>Sorulara Verilen Cevaplar</summary>
                          <ul style={{ marginTop: '5px', paddingLeft: '15px' }}>
                            {Object.entries(app.answers).map(([qIdx, ans]) => (
                              <li key={qIdx} style={{ marginBottom: '5px' }}>{ans}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </td>
                  )}
                  
                  <td style={{ padding: '10px' }}>{new Date(app.created_at).toLocaleDateString('tr-TR')}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '5px', 
                      fontSize: '0.9em',
                      background: app.status === 'olumlu' ? 'rgba(76,175,80,0.2)' : app.status === 'olumsuz' ? 'rgba(229,57,53,0.2)' : 'rgba(255,255,255,0.1)',
                      color: app.status === 'olumlu' ? '#4CAF50' : app.status === 'olumsuz' ? '#E53935' : '#ccc'
                    }}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  
                  {profile?.user_type === 'firma' && (
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => updateStatus(app.id, 'olumlu')} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>Kabul</button>
                      <button onClick={() => updateStatus(app.id, 'olumsuz')} style={{ background: '#E53935', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Red</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
