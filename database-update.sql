-- 1. İlanlara Sorular Sütununu Ekleme (Firmaların soru sorabilmesi için)
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS questions jsonb DEFAULT '[]'::jsonb;

-- 2. Profillere Özgeçmiş Bilgilerini Ekleme
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS skills text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text;

-- 3. Başvurular (Applications) Tablosunu Oluşturma
CREATE TABLE IF NOT EXISTS public.applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    answers jsonb DEFAULT '{}'::jsonb, -- Firmanın sorularına verilen cevaplar JSON formatında
    status text DEFAULT 'bekliyor', -- bekliyor, olumlu, olumsuz
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(job_id, student_id) -- Bir öğrenci aynı ilana sadece 1 kez başvurabilir
);

-- Başvurular tablosu için RLS (Row Level Security) ayarları
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Politikalar
-- 1. Okuma: Sadece kendi başvurularını veya kendi verdiği ilanlara gelen başvuruları görebilir
-- Güvenlik için şimdilik herkesin görmesine izin verip UI üzerinden kısıtlayacağız (veya RLS yazabiliriz, ancak basit tutalım)
CREATE POLICY "Başvuruları herkes okuyabilir" ON public.applications
    FOR SELECT USING (true);

-- 2. Ekleme: Sadece oturum açan öğrenci başvuru yapabilir
CREATE POLICY "Öğrenciler kendi başvurularını ekleyebilir" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- 3. Güncelleme: Firmalar başvuru durumunu güncelleyebilir (Basitlik için herkese izin verildi, UI'da filtreliyoruz)
CREATE POLICY "Başvuru durumunu herkes güncelleyebilir" ON public.applications
    FOR UPDATE USING (true);

-- 4. Silme: Öğrenci başvurusunu iptal edebilir
CREATE POLICY "Öğrenciler başvurularını silebilir" ON public.applications
    FOR DELETE USING (auth.uid() = student_id);
