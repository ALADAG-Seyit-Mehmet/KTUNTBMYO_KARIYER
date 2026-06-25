import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Select from 'react-select';
import { departments, customSelectStyles } from '../utils/departments';

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    skills: '',
    github_url: '',
    linkedin_url: '',
    user_type: '',
    department: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (data) {
        let deptObj = null;
        if (data.department) {
          deptObj = departments.find(d => d.label === data.department) || { label: data.department, value: data.department };
        }
        setProfile({
          full_name: data.full_name || '',
          bio: data.bio || '',
          skills: data.skills || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          user_type: data.user_type || '',
          department: deptObj
        });
      }
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          skills: profile.skills,
          github_url: profile.github_url,
          linkedin_url: profile.linkedin_url,
          department: profile.department ? profile.department.label : null
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage('Profiliniz başarıyla güncellendi!');
    } catch (err) {
      console.error(err);
      setMessage('Hata: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Yükleniyor...</div>;
  if (!user) return <div style={{textAlign:'center', marginTop:'50px'}}>Lütfen giriş yapın.</div>;

  return (
    <div className="container" style={{ margin: '40px auto', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>Profilim</h2>
        <p>Bilgilerinizi güncelleyerek tek tıkla iş ilanlarına başvurun.</p>
      </div>

      {message && (
        <div style={{ marginBottom: '15px', padding: '10px', background: message.includes('Hata') ? 'rgba(229,57,53,0.1)' : 'rgba(76,175,80,0.1)', color: message.includes('Hata') ? '#E53935' : '#4CAF50', borderRadius: '5px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '10px' }}>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="full_name" style={{ display: 'block', marginBottom: '5px' }}>Ad Soyad (Veya Firma Adı)</label>
          <input type="text" id="full_name" value={profile.full_name} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
        </div>

        {profile.user_type !== 'firma' && (
          <>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="department" style={{ display: 'block', marginBottom: '5px' }}>Bölümünüz</label>
              <Select
                name="department"
                options={departments}
                styles={customSelectStyles}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Arama yapın veya seçin..."
                noOptionsMessage={() => "Sonuç bulunamadı"}
                value={profile.department}
                onChange={(selectedOption) => setProfile({ ...profile, department: selectedOption })}
                isClearable
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px' }}>Hakkımda (Ön Yazı)</label>
              <textarea id="bio" value={profile.bio} onChange={handleInputChange} rows="4" placeholder="Kendinizden kısaca bahsedin..." style={{ width: '100%', padding: '10px', borderRadius: '5px' }}></textarea>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="skills" style={{ display: 'block', marginBottom: '5px' }}>Yetenekler</label>
              <input type="text" id="skills" value={profile.skills} onChange={handleInputChange} placeholder="Örn: React, Node.js, AutoCAD, İngilizce (Aralarına virgül koyun)" style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="github_url" style={{ display: 'block', marginBottom: '5px' }}>GitHub / Portfolyo Linki</label>
                <input type="url" id="github_url" value={profile.github_url} onChange={handleInputChange} placeholder="https://github.com/..." style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="linkedin_url" style={{ display: 'block', marginBottom: '5px' }}>LinkedIn Profil Linki</label>
                <input type="url" id="linkedin_url" value={profile.linkedin_url} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn-submit" disabled={saving} style={{ width: '100%', padding: '12px', background: '#E53935', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', marginTop: '10px' }}>
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
