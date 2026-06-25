export const departments = [
  { value: 'all', label: 'Tüm Bölümler' },
  // MÜHENDİSLİK VE LİSANS BÖLÜMLERİ
  { value: 'bilgisayar-muh', label: 'Bilgisayar Mühendisliği' },
  { value: 'yazilim-muh', label: 'Yazılım Mühendisliği' },
  { value: 'elektrik-elektronik-muh', label: 'Elektrik-Elektronik Mühendisliği' },
  { value: 'makine-muh', label: 'Makine Mühendisliği' },
  { value: 'insaat-muh', label: 'İnşaat Mühendisliği' },
  { value: 'endustri-muh', label: 'Endüstri Mühendisliği' },
  { value: 'harita-muh', label: 'Harita Mühendisliği' },
  { value: 'cevre-muh', label: 'Çevre Mühendisliği' },
  { value: 'kimya-muh', label: 'Kimya Mühendisliği' },
  { value: 'metalurji-malzeme-muh', label: 'Metalurji ve Malzeme Mühendisliği' },
  { value: 'mimarlik', label: 'Mimarlık' },
  { value: 'sehir-bolge-planlama', label: 'Şehir ve Bölge Planlama' },
  // 2 YILLIK (ÖNLİSANS) BÖLÜMLER
  { value: 'bilgisayar-prog', label: 'Bilgisayar Programcılığı (Önlisans)' },
  { value: 'elektrik-onlisans', label: 'Elektrik (Önlisans)' },
  { value: 'elektronik-tek', label: 'Elektronik Teknolojisi (Önlisans)' },
  { value: 'makine-onlisans', label: 'Makine (Önlisans)' },
  { value: 'mekatronik-onlisans', label: 'Mekatronik (Önlisans)' },
  { value: 'insaat-tek', label: 'İnşaat Teknolojisi (Önlisans)' },
  { value: 'harita-kadastro', label: 'Harita ve Kadastro (Önlisans)' },
  { value: 'cevre-koruma', label: 'Çevre Koruma ve Kontrol (Önlisans)' },
  { value: 'is-sagligi', label: 'İş Sağlığı ve Güvenliği (Önlisans)' },
  { value: 'mimari-restorasyon', label: 'Mimari Restorasyon (Önlisans)' },
  { value: 'sivil-savunma', label: 'Sivil Savunma ve İtfaiyecilik (Önlisans)' },
  { value: 'gida-tek', label: 'Gıda Teknolojisi (Önlisans)' },
  { value: 'kimya-tek', label: 'Kimya Teknolojisi (Önlisans)' },
  { value: 'biyomedikal-cihaz', label: 'Biyomedikal Cihaz Teknolojisi (Önlisans)' },
  { value: 'grafik-tasarim', label: 'Grafik Tasarımı (Önlisans)' },
  { value: 'ic-mekan-tasarimi', label: 'İç Mekan Tasarımı (Önlisans)' },
  { value: 'otomotiv-tek', label: 'Otomotiv Teknolojisi (Önlisans)' },
  { value: 'iklimlendirme-sogutma', label: 'İklimlendirme ve Soğutma Teknolojisi (Önlisans)' },
  { value: 'kaynak-tek', label: 'Kaynak Teknolojisi (Önlisans)' }
];

export const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    padding: '4px',
    borderRadius: '5px',
    borderColor: state.isFocused ? 'var(--primary-red)' : 'rgba(255,255,255,0.2)',
    boxShadow: state.isFocused ? '0 0 0 1px var(--primary-red)' : 'none',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-dark)',
    '&:hover': {
      borderColor: 'var(--primary-red)'
    }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-dark)',
    zIndex: 100
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--primary-red)' : 'var(--bg-color)',
    color: state.isFocused ? 'white' : 'var(--text-dark)',
    cursor: 'pointer'
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--text-dark)'
  }),
  input: (base) => ({
    ...base,
    color: 'var(--text-dark)'
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'var(--primary-red)',
    color: 'white'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white'
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'white',
    ':hover': {
      backgroundColor: 'var(--dark-red)',
      color: 'white',
    },
  }),
};
