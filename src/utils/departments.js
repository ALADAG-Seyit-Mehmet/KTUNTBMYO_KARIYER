export const departments = [
  { value: 'all', label: 'Tüm Bölümler' },
  // KTÜN TEKNİK BİLİMLER MESLEK YÜKSEKOKULU BÖLÜMLERİ
  { value: 'bilgisayar-prog', label: 'Bilgisayar Programcılığı' },
  { value: 'elektrik', label: 'Elektrik' },
  { value: 'elektronik-tek', label: 'Elektronik Teknolojisi' },
  { value: 'makine', label: 'Makine' },
  { value: 'mekatronik', label: 'Mekatronik' },
  { value: 'insaat-tek', label: 'İnşaat Teknolojisi' },
  { value: 'harita-kadastro', label: 'Harita ve Kadastro' },
  { value: 'cevre-koruma', label: 'Çevre Koruma ve Kontrol' },
  { value: 'is-sagligi', label: 'İş Sağlığı ve Güvenliği' },
  { value: 'mimari-restorasyon', label: 'Mimari Restorasyon' },
  { value: 'sivil-savunma', label: 'Sivil Savunma ve İtfaiyecilik' },
  { value: 'gida-tek', label: 'Gıda Teknolojisi' },
  { value: 'kimya-tek', label: 'Kimya Teknolojisi' },
  { value: 'biyomedikal-cihaz', label: 'Biyomedikal Cihaz Teknolojisi' },
  { value: 'grafik-tasarim', label: 'Grafik Tasarımı' },
  { value: 'ic-mekan-tasarimi', label: 'İç Mekan Tasarımı' },
  { value: 'otomotiv-tek', label: 'Otomotiv Teknolojisi' },
  { value: 'iklimlendirme-sogutma', label: 'İklimlendirme ve Soğutma Teknolojisi' },
  { value: 'kaynak-tek', label: 'Kaynak Teknolojisi' }
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
