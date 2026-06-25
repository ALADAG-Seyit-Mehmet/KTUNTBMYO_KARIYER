import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <h2>Geleceğin Tekniker, Mühendis ve Mimarları İçin Kariyer Fırsatları</h2>
          <p>Konya Teknik Üniversitesi öğrencilerine ve mezunlarına özel en güncel iş ve staj ilanlarını keşfedin.</p>

          <div className="search-box">
            <input type="text" id="searchInput" placeholder="Pozisyon, yetenek veya firma ara..." />
            <select id="typeFilter">
              <option value="all">Tüm İlan Türleri</option>
              <option value="tam-zamanli">Tam Zamanlı</option>
              <option value="yari-zamanli">Yarı Zamanlı</option>
              <option value="staj">Staj</option>
            </select>
            <button id="searchBtn"><i className="fa-solid fa-search"></i> İş Bul</button>
          </div>
        </div>
      </section>

      <section className="job-listings" style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="section-title">
            <h2>Hoş Geldiniz</h2>
            <p>React dönüşümü devam ediyor. Tüm sayfalar modüler bileşenlere dönüştürülecektir.</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
             <Link to="/jobs" className="btn-submit">Tüm İlanları Gör</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
