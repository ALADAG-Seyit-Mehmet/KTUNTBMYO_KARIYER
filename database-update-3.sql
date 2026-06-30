ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS military_status text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS driver_license text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marital_status text;
