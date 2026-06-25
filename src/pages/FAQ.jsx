import React from 'react';

const FAQ = () => {
  return (
    <div className="container" style={{ margin: '40px auto', maxWidth: '800px', minHeight: '60vh' }}>
      <div className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2>Sıkça Sorulan Sorular (S.S.S.)</h2>
        <p>Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.</p>
      </div>

      <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#E53935', marginBottom: '10px' }}>Sisteme kimler kayıt olabilir?</h3>
          <p>Sistemimize üniversitemizin öğrencileri, mezunları ve öğrencilerimize iş/staj imkanı sunmak isteyen tüm firmalar kayıt olabilir.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#E53935', marginBottom: '10px' }}>İş başvurusu yapmak ücretli mi?</h3>
          <p>Hayır, KTÜNTBMYO Kariyer platformu öğrencilerimiz ve mezunlarımız için tamamen ücretsizdir. Firmalar da ücretsiz olarak ilan verebilirler.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#E53935', marginBottom: '10px' }}>Profilimi nasıl güncelleyebilirim?</h3>
          <p>Sisteme giriş yaptıktan sonra üst menüdeki "Profilim" butonuna tıklayarak kişisel bilgilerinizi, yeteneklerinizi ve sosyal medya bağlantılarınızı güncelleyebilirsiniz.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#E53935', marginBottom: '10px' }}>Yaptığım başvuruları nereden görebilirim?</h3>
          <p>Giriş yaptıktan sonra "Panel" sekmesine tıklayarak başvurduğunuz iş ilanlarını ve başvurularınızın anlık durumunu görüntüleyebilirsiniz.</p>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
