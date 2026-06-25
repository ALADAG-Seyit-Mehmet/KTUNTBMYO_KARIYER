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
      setCompanies(data || []);
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
          <div className="job-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {companies.map((company) => (
              <div key={company.id} className="job-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <i className="fa-solid fa-building" style={{ fontSize: '3rem', color: '#E53935', marginBottom: '15px' }}></i>
                <h3 style={{ color: '#fff', marginBottom: '10px' }}>{company.full_name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Companies;
