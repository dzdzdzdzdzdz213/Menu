-- Supabase Database Schema & Row Level Security (RLS) Settings
-- Instructions: Run this script in the Supabase Dashboard SQL Editor to secure your database.

-- 1. Profiles table (unified for all roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'seller', 'user')),
  phone TEXT,
  age INTEGER CHECK (age >= 13 OR age IS NULL),
  whatsapp TEXT,
  description TEXT,
  location TEXT,
  social_links JSONB DEFAULT '{}',
  hero_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC,
  image_url TEXT,
  specs TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Analytics table (for traffic and conversions)
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('visit', 'whatsapp_click')),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reviews Tables
CREATE TABLE IF NOT EXISTS public.merchant_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- 6. Configure RLS Policies

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- PRODUCTS
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Sellers can manage own products" ON public.products FOR ALL USING (
  auth.uid() = merchant_id AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'seller'
);
CREATE POLICY "Admins can manage all products" ON public.products FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- ANALYTICS
CREATE POLICY "Anyone can insert analytics" ON public.analytics FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Sellers can view own analytics" ON public.analytics FOR SELECT USING (
  auth.uid() = seller_id OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- REVIEWS
CREATE POLICY "Reviews are viewable by everyone" ON public.merchant_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert reviews" ON public.merchant_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can moderate reviews" ON public.merchant_reviews FOR DELETE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Product reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert product reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can moderate product reviews" ON public.product_reviews FOR DELETE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 7. Trigger to automatically create profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
