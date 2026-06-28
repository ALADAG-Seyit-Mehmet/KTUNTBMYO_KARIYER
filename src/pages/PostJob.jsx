import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Select from 'react-select';
import { departments, customSelectStyles } from '../utils/departments';
import toast from 'react-hot-toast';

const PostJob = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobType: 'tam-zamanli',
    location: '',
    departments: [],
    description: '',
    keywords: '',
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!formData.departments || formData.departments.length === 0) {
      setError("Lütfen en az bir hedef bölüm seçin.");
      return;
    }

    setLoading(true);
    setError(null);

    // Oturum kontrolü
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("İlan verebilmek için giriş yapmalısınız.");
      setLoading(false);
      return;
    }

    const deptString = formData.departments.map(d => d.label).join(', ');

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            title: formData.jobTitle,
            company: formData.companyName,
            type: formData.jobType,
            location: formData.location,
            department: deptString,
            description: formData.description,
            keywords: formData.keywords,
            user_id: session.user.id,
            questions: formData.questions
          }
        ]);

      if (error) throw error;
      
      toast.success("İlan başarıyla eklendi!");
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      setError("İlan eklenirken bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container post-job-container" style={{ margin: '40px auto', maxWidth: '800px' }}>
      <div className="post-job-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>Yeni İlan Oluştur</h2>
        <p>KTÜN'ün yetenekli öğrencilerine ulaşmak için aşağıdaki formu doldurun.</p>
      </div>

      {error && <div style={{ color: '#E53935', marginBottom: '15px', padding: '10px', background: 'rgba(229,57,53,0.1)', borderRadius: '5px' }}>{error}</div>}

      <form className="job-card post-job-form" onSubmit={handlePostJob}>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="companyName" style={{ display: 'block', marginBottom: '5px' }}>Firma Adı</label>
          <input type="text" id="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Örn: Aselsan Konya" required style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="jobTitle" style={{ display: 'block', marginBottom: '5px' }}>Pozisyon Adı</label>
          <input type="text" id="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="Örn: Yazılım Mühendisi" required style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
        </div>

        <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="jobType" style={{ display: 'block', marginBottom: '5px' }}>Çalışma Türü</label>
            <select id="jobType" value={formData.jobType} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px' }}>
              <option value="tam-zamanli">Tam Zamanlı</option>
              <option value="yari-zamanli">Yarı Zamanlı</option>
              <option value="staj">Staj</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '5px' }}>Konum</label>
            <input type="text" id="location" value={formData.location} onChange={handleInputChange} placeholder="Örn: Konya, Selçuklu" required style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="department" style={{ display: 'block', marginBottom: '5px' }}>Hedef Bölümler</label>
          <Select
            isMulti
            name="departments"
            options={departments}
            styles={customSelectStyles}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Arama yapın veya seçin..."
            noOptionsMessage={() => "Sonuç bulunamadı"}
            value={formData.departments}
            onChange={(selectedOptions) => setFormData({ ...formData, departments: selectedOptions || [] })}
            required={!formData.departments || formData.departments.length === 0}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>İlan Detayları</label>
          <textarea id="description" value={formData.description} onChange={handleInputChange} rows="6" placeholder="Adaylardan beklentileriniz, iş tanımı vb." required style={{ width: '100%', padding: '10px', borderRadius: '5px' }}></textarea>
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="keywords" style={{ display: 'block', marginBottom: '5px' }}>Aranan Yetenekler / Anahtar Kelimeler</label>
          <input type="text" id="keywords" value={formData.keywords} onChange={handleInputChange} placeholder="Örn: React, Node.js, AutoCAD (Aralarına virgül koyun)" style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
        </div>

        <div className="form-group" style={{ marginBottom: '20px', padding: '15px', border: '1px dashed var(--border-color)', borderRadius: '5px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Adaylara Sorulacak Özel Sorular (Opsiyonel)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              type="text" 
              value={newQuestion} 
              onChange={(e) => setNewQuestion(e.target.value)} 
              placeholder="Örn: Neden firmamızda çalışmak istiyorsunuz?" 
              style={{ flex: 1, padding: '10px', borderRadius: '5px' }} 
            />
            <button type="button" onClick={() => {
              if (newQuestion.trim()) {
                setFormData({ ...formData, questions: [...formData.questions, newQuestion.trim()] });
                setNewQuestion('');
              }
            }} style={{ padding: '10px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Ekle</button>
          </div>
          {formData.questions.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
              {formData.questions.map((q, idx) => (
                <li key={idx} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '8px', marginBottom: '5px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{idx + 1}. {q}</span>
                  <button type="button" onClick={() => {
                    const filtered = formData.questions.filter((_, i) => i !== idx);
                    setFormData({ ...formData, questions: filtered });
                  }} style={{ background: 'transparent', color: '#E53935', border: 'none', cursor: 'pointer' }}>Sil</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#E53935', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em' }}>
          {loading ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
