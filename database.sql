-- Supabase Veritabanı Kurulum Dosyası
-- Bu kodları Supabase panelinizde 'SQL Editor' bölümüne yapıştırıp 'Run' butonuna basarak çalıştırabilirsiniz.

-- 1. İş İlanları Tablosunu Oluştur (jobs)
CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    company text NOT NULL,
    type text NOT NULL, -- tam-zamanli, yari-zamanli, staj
    location text NOT NULL,
    department text NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- RLS (Row Level Security) Ayarları
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Politikalar: Herkes ilanları görebilir
CREATE POLICY "İlanları herkes görebilir" ON public.jobs
    FOR SELECT USING (true);

-- Politikalar: Sadece giriş yapmış kullanıcılar (firmalar vs.) ilan ekleyebilir
CREATE POLICY "Sadece oturum açanlar ilan ekleyebilir" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politikalar: Kullanıcılar kendi ilanlarını silebilir veya güncelleyebilir
CREATE POLICY "Kullanıcılar kendi ilanlarını güncelleyebilir" ON public.jobs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi ilanlarını silebilir" ON public.jobs
    FOR DELETE USING (auth.uid() = user_id);

-- 2. Profiller Tablosunu Oluştur (profiles) - İsteğe Bağlı
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    user_type text, -- ogrenci, mezun, firma
    department text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profilleri herkes görebilir" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Kullanıcı kendi profilini düzenleyebilir" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Kullanıcı oluşturulduğunda profile otomatik veri ekleme fonksiyonu (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_type');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı bağla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
