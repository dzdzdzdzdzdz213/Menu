-- Supabase Database Schema & Row Level Security (RLS) Settings
-- Instructions: Run this script in the Supabase Dashboard SQL Editor to secure your database.

-- 1. Create or ensure profiles and products tables exist (example structure)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC,
  image_url TEXT,
  specs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Configure Policies for Profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. Configure Policies for Products
-- Anyone can view products (Publicly accessible menu)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Merchants can insert their own products
CREATE POLICY "Merchants can insert products" 
ON public.products FOR INSERT 
WITH CHECK (auth.uid() = merchant_id AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'merchant');

-- Merchants can update their own products
CREATE POLICY "Merchants can update own products" 
ON public.products FOR UPDATE 
USING (auth.uid() = merchant_id);

-- Merchants can delete their own products
CREATE POLICY "Merchants can delete own products" 
ON public.products FOR DELETE 
USING (auth.uid() = merchant_id);

-- 5. Trigger to automatically link Auth data to Profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists before creating
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Create Reviews Tables (Merchants and Products)
CREATE TABLE IF NOT EXISTS public.merchant_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.merchant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchant Reviews are viewable by everyone" ON public.merchant_reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert merchant reviews" ON public.merchant_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Product Reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert product reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
