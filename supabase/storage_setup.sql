-- =============================================
-- Supabase Storage Setup for Menu Platform
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 524288, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('hero-images',    'hero-images',    true, 524288, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 524288,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies

-- product-images: anyone can read, authenticated sellers can upload
CREATE POLICY "Public product images are readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Sellers can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('seller', 'admin')
  );

CREATE POLICY "Sellers can update own product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Sellers can delete own product images" ON storage.objects;
CREATE POLICY "Sellers can delete own product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

-- hero-images: anyone can read, authenticated sellers can upload
CREATE POLICY "Public hero images are readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hero-images');

CREATE POLICY "Sellers can upload hero images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'hero-images'
    AND auth.uid() IS NOT NULL
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('seller', 'admin')
  );

CREATE POLICY "Sellers can update own hero images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'hero-images'
    AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Sellers can delete own hero images" ON storage.objects;
CREATE POLICY "Sellers can delete own hero images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'hero-images'
    AND split_part(name, '/', 1) = auth.uid()::text
  );
