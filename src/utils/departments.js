export const departments = [
  { value: 'all', label: 'Tüm Bölümler' },
  { value: 'bilgisayar-programciligi', label: 'Bilgisayar Programcılığı' },
  { value: 'elektrik', label: 'Elektrik' },
  { value: 'elektronik-teknolojisi', label: 'Elektronik Teknolojisi' },
  { value: 'makine', label: 'Makine' },
  { value: 'makine-resim', label: 'Makine Resim ve Konstrüksiyonu' },
  { value: 'mekatronik', label: 'Mekatronik' },
  { value: 'harita-kadastro', label: 'Harita ve Kadastro' },
  { value: 'insaat-teknolojisi', label: 'İnşaat Teknolojisi' },
  { value: 'gida-teknolojisi', label: 'Gıda Teknolojisi' },
  { value: 'kimya-teknolojisi', label: 'Kimya Teknolojisi' },
  { value: 'cevre-koruma', label: 'Çevre Koruma ve Kontrol' },
  { value: 'is-sagligi', label: 'İş Sağlığı ve Güvenliği' },
  { value: 'mimari-restorasyon', label: 'Mimari Restorasyon' },
  { value: 'sivil-savunma', label: 'Sivil Savunma ve İtfaiyecilik' },
  { value: 'ayakkabi-tasarim', label: 'Ayakkabı Tasarım ve Üretimi' },
  { value: 'nukleer-teknoloji', label: 'Nükleer Teknoloji ve Radyasyon Güvenliği' }
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
