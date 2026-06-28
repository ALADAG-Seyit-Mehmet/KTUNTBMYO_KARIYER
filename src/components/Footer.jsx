import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container footer-content">
        <div className="footer-col">
          <h3>KTÜNTBMYO Kariyer</h3>
          <p>Öğrencilerimiz ve mezunlarımız için özel tasarlanmış modern kariyer ve iş ilanları platformu. Geleceğin teknikerleri ve uzmanları burada buluşuyor.</p>
        </div>
        <div className="footer-col">
          <h3>Hızlı Bağlantılar</h3>
          <ul>
            <li><a href="/">Ana Sayfa</a></li>
            <li><a href="/jobs">İş ve Proje İlanları</a></li>
            <li><a href="/companies">Firmalar</a></li>
            <li><a href="/faq">S.S.S.</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>İletişim</h3>
          <ul>
            <li><i className="fa-solid fa-envelope"></i> kariyer@ktun.edu.tr</li>
            <li><i className="fa-solid fa-phone"></i> +90 (332) 205 XX XX</li>
            <li><i className="fa-solid fa-location-dot"></i> Konya Teknik Üniversitesi, Selçuklu/Konya</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 KTÜN Kariyer Merkezi. Tüm hakları saklıdır. Kırmızı Beyaz Aşkına!</p>
      </div>
    </footer>
  );
};

export default Footer;
