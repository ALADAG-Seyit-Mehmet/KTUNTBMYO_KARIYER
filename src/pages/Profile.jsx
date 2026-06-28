import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Select from 'react-select';
import { departments, customSelectStyles } from '../utils/departments';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    skills: '',
    github_url: '',
    linkedin_url: '',
    user_type: '',
    department: null,
    cv_url: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    company_website: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [uploadingCV, setUploadingCV] = useState(false);

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
          department: deptObj,
          cv_url: data.cv_url || '',
          company_address: data.company_address || '',
          company_phone: data.company_phone || '',
          company_email: data.company_email || '',
          company_website: data.company_website || ''
        });
      }
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Sadece PDF dosyaları yüklenebilir.');
      return;
    }

    setUploadingCV(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('cvs').getPublicUrl(filePath);
      
      setProfile({ ...profile, cv_url: data.publicUrl });
      toast.success('CV yüklendi. Değişiklikleri kaydet butonuna basmayı unutmayın!');
    } catch (error) {
      toast.error('CV yüklenirken hata oluştu. Supabase panosundan CV bucket\'ını oluşturduğunuzdan emin olun.');
    } finally {
      setUploadingCV(false);
    }
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
          department: profile.department ? profile.department.label : null,
          cv_url: profile.cv_url,
          company_address: profile.company_address,
          company_phone: profile.company_phone,
          company_email: profile.company_email,
          company_website: profile.company_website
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

      <form onSubmit={handleSave} className="job-card">
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
              <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px' }}>
                Hakkımda (Ön Yazı)
                <span style={{ fontSize: '0.85em', color: '#E53935', marginLeft: '5px', fontWeight: 'normal' }}>* Zorunlu</span>
              </label>
              <textarea id="bio" value={profile.bio} onChange={handleInputChange} rows="4" required placeholder="Kendinizden kısaca bahsedin..." style={{ width: '100%', padding: '10px', borderRadius: '5px' }}></textarea>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="skills" style={{ display: 'block', marginBottom: '5px' }}>
                Yetenekler
                <span style={{ fontSize: '0.85em', color: '#E53935', marginLeft: '5px', fontWeight: 'normal' }}>* Zorunlu (Sistem buraya girdiğiniz yeteneklere göre size özel iş ilanları önerecektir)</span>
              </label>
              <input type="text" id="skills" value={profile.skills} onChange={handleInputChange} required placeholder="Örn: React, Node.js, AutoCAD, İngilizce (Aralarına virgül koyun)" style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
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

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label htmlFor="cv_upload" style={{ display: 'block', marginBottom: '5px' }}>Özgeçmiş (CV) - Sadece PDF</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="file" 
                  id="cv_upload" 
                  accept=".pdf"
                  onChange={handleCVUpload} 
                  disabled={uploadingCV}
                  style={{ flex: 1, padding: '10px', borderRadius: '5px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }} 
                />
                {uploadingCV && <span style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>Yükleniyor...</span>}
                {profile.cv_url && !uploadingCV && (
                  <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50', textDecoration: 'none', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '5px', padding: '10px', background: 'rgba(76,175,80,0.1)', borderRadius: '5px' }}>
                    <i className="fa-solid fa-file-pdf"></i> Mevcut CV
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {profile.user_type === 'firma' && (
          <>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="company_address" style={{ display: 'block', marginBottom: '5px' }}>Firma Adresi</label>
              <textarea id="company_address" value={profile.company_address} onChange={handleInputChange} rows="2" placeholder="Örn: Selçuklu, Konya" style={{ width: '100%', padding: '10px', borderRadius: '5px' }}></textarea>
            </div>
            
            <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="company_phone" style={{ display: 'block', marginBottom: '5px' }}>İletişim Numarası</label>
                <input type="tel" id="company_phone" value={profile.company_phone} onChange={handleInputChange} placeholder="0555 555 55 55" style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label htmlFor="company_email" style={{ display: 'block', marginBottom: '5px' }}>İletişim E-posta</label>
                <input type="email" id="company_email" value={profile.company_email} onChange={handleInputChange} placeholder="iletisim@firma.com" style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label htmlFor="company_website" style={{ display: 'block', marginBottom: '5px' }}>Web Sitesi</label>
              <input type="url" id="company_website" value={profile.company_website} onChange={handleInputChange} placeholder="https://www.firma.com" style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
            </div>
          </>
        )}

        <button type="submit" className="btn-submit" disabled={saving || uploadingCV} style={{ width: '100%', padding: '12px', background: '#E53935', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', marginTop: '10px' }}>
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
