import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'firma');

      if (error) throw error;
      
      const dummyCompanies = [
        { id: 'dummy-1', full_name: 'Tech Innovators A.Ş.', company_address: 'Selçuklu, Konya', user_type: 'firma' },
        { id: 'dummy-2', full_name: 'Gelişim Otomasyon', company_address: 'Karatay, Konya', user_type: 'firma' },
        { id: 'dummy-3', full_name: 'Konya Makine Sanayi', company_address: 'Konya OSB', user_type: 'firma' },
        { id: 'dummy-4', full_name: 'Yapıtaşı Mimarlık', company_address: 'Meram, Konya', user_type: 'firma' },
        { id: 'dummy-5', full_name: 'Metal İş Kesim', company_address: 'Karatay, Konya', user_type: 'firma' },
        { id: 'dummy-6', full_name: 'GONICEON Studio', company_address: 'Konya', user_type: 'firma' },
      ];

      const allCompanies = [...(data || []), ...dummyCompanies];
      
      // Aynı isimdeki firmaların tekrarlanmasını önle (eğer veritabanına sonradan eklenirse)
      const uniqueCompanies = allCompanies.filter((comp, index, self) =>
        index === self.findIndex((t) => t.full_name === comp.full_name)
      );

      setCompanies(uniqueCompanies);
    } catch (err) {
      console.error("Firmalar yüklenirken hata:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="job-listings" style={{ padding: '40px 0', minHeight: '60vh' }}>
      <div className="container">
        <div className="section-title">
          <h2>Anlaşmalı Firmalar</h2>
          <p>Mezunlarımız ve öğrencilerimiz için fırsat sunan değerleri iş ortaklarımız.</p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Firmalar Yükleniyor...</p>
        ) : companies.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Sistemde kayıtlı firma bulunmamaktadır.</p>
        ) : (
          <div className="job-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {companies.map((company) => (
              <div key={company.id} className="job-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <i className="fa-solid fa-building" style={{ fontSize: '3rem', color: 'var(--primary-red)', marginBottom: '15px' }}></i>
                <h3 style={{ marginBottom: '20px', fontSize: '1.4em' }}>{company.full_name}</h3>
                
                <div style={{ textAlign: 'left', marginTop: 'auto', fontSize: '0.95em', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', background: 'rgba(150,150,150,0.1)', borderRadius: '8px' }}>
                  {company.company_address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#E53935', width: '25px', marginTop: '4px' }}></i> 
                      <span>{company.company_address}</span>
                    </div>
                  )}
                  {company.company_phone && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i className="fa-solid fa-phone" style={{ color: '#E53935', width: '25px' }}></i> 
                      <span>{company.company_phone}</span>
                    </div>
                  )}
                  {company.company_email && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i className="fa-solid fa-envelope" style={{ color: '#E53935', width: '25px' }}></i> 
                      <span>{company.company_email}</span>
                    </div>
                  )}
                  {company.company_website && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i className="fa-solid fa-globe" style={{ color: '#E53935', width: '25px' }}></i> 
                      <a href={company.company_website} target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50', textDecoration: 'none' }}>
                        Web Sitesine Git
                      </a>
                    </div>
                  )}
                  {!company.company_address && !company.company_phone && !company.company_email && !company.company_website && (
                    <div style={{ textAlign: 'center', color: '#777', fontStyle: 'italic' }}>
                      İletişim bilgisi eklenmemiş.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Companies;
