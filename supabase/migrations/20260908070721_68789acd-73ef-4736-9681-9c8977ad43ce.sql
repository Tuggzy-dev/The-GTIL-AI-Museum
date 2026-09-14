CREATE TABLE public.montages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection TEXT NOT NULL CHECK (collection IN ('shame','premium')),
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_path TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.montages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.montages TO authenticated;
GRANT ALL ON public.montages TO service_role;

ALTER TABLE public.montages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read montages" ON public.montages FOR SELECT USING (true);
CREATE POLICY "Public can insert montages" ON public.montages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update montages" ON public.montages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete montages" ON public.montages FOR DELETE USING (true);

CREATE POLICY "Public can read montage files" ON storage.objects FOR SELECT USING (bucket_id = 'montages');
CREATE POLICY "Public can upload montage files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'montages');
CREATE POLICY "Public can update montage files" ON storage.objects FOR UPDATE USING (bucket_id = 'montages') WITH CHECK (bucket_id = 'montages');
CREATE POLICY "Public can delete montage files" ON storage.objects FOR DELETE USING (bucket_id = 'montages');
