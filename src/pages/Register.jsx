import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Register = () => {
  const [userType, setUserType] = useState('ogrenci_mezun'); // ogrenci_mezun, akademisyen, firma
  const [isGraduate, setIsGraduate] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullName = `${formData.firstName} ${formData.lastName}`;
    
    let finalUserType = userType;
    if (userType === 'ogrenci_mezun') {
      finalUserType = isGraduate ? 'mezun' : 'ogrenci';
    }
    
    // Firma ise firma adını tam ad olarak kaydet veya meta dataya ekle
    const metaData = {
      full_name: userType === 'firma' ? formData.companyName : fullName,
      user_type: finalUserType
    };

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: metaData
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      setSuccess(true);
      // Başarılı kayıttan sonra Supabase otomatik giriş yapabilir veya e-posta onayı bekleyebilir.
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="container auth-container" style={{ margin: '50px auto', maxWidth: '600px' }}>
      <h2>Yeni Hesap Oluştur</h2>
      <p>Aramıza katılarak kariyerinize yön verin.</p>

      <div className="auth-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', marginBottom: '20px' }}>
        <button type="button" className={`auth-tab ${userType === 'ogrenci_mezun' ? 'active' : ''}`} onClick={() => setUserType('ogrenci_mezun')}>Öğrenci / Mezun</button>
        <button type="button" className={`auth-tab ${userType === 'akademisyen' ? 'active' : ''}`} onClick={() => setUserType('akademisyen')}>Akademisyen</button>
        <button type="button" className={`auth-tab ${userType === 'firma' ? 'active' : ''}`} onClick={() => setUserType('firma')}>Firma</button>
      </div>

      {error && <div style={{ color: '#E53935', marginBottom: '15px', padding: '10px', background: 'rgba(229,57,53,0.1)', borderRadius: '5px' }}>{error}</div>}
      {success && <div style={{ color: '#4CAF50', marginBottom: '15px', padding: '10px', background: 'rgba(76,175,80,0.1)', borderRadius: '5px' }}>Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</div>}

      <form className="auth-form" onSubmit={handleRegister}>
        {userType !== 'firma' ? (
          <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="firstName">Adınız</label>
              <input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lastName">Soyadınız</label>
              <input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="companyName">Firma Adı</label>
            <input type="text" id="companyName" value={formData.companyName} onChange={handleInputChange} required />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">E-posta Adresiniz</label>
          <input type="email" id="email" value={formData.email} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Şifreniz</label>
          <input type="password" id="password" value={formData.password} onChange={handleInputChange} required minLength="6" />
        </div>

        {userType === 'ogrenci_mezun' && (
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mezuniyet Durumunuz</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="graduateStatus" 
                  checked={isGraduate === false} 
                  onChange={() => setIsGraduate(false)} 
                /> Öğrenciyim
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="graduateStatus" 
                  checked={isGraduate === true} 
                  onChange={() => setIsGraduate(true)} 
                /> Mezunum
              </label>
            </div>
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </button>
      </form>

      <div className="auth-switch" style={{ marginTop: '20px', textAlign: 'center' }}>
        Zaten hesabınız var mı? <Link to="/login" style={{ color: '#E53935', textDecoration: 'none', fontWeight: 'bold' }}>Giriş Yapın</Link>
      </div>
    </div>
  );
};

export default Register;
