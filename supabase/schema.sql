-- Supabase Database Schema & Row Level Security (RLS) Settings
-- Instructions: Run this script in the Supabase Dashboard SQL Editor to secure your database.

-- 0. Helper Function for Role Checks (Prevents RLS Recursion)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER
AS $$ 
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

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
  delivery_fee NUMERIC DEFAULT 350,
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

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  user_phone TEXT,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  user_phone TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER DEFAULT 2,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 8. Configure RLS Policies

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.get_my_role() = 'admin');

-- PRODUCTS
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Sellers can manage own products" ON public.products FOR ALL USING (
  auth.uid() = merchant_id AND public.get_my_role() = 'seller'
);
CREATE POLICY "Admins can manage all products" ON public.products FOR ALL USING (public.get_my_role() = 'admin');

-- ANALYTICS
CREATE POLICY "Anyone can insert analytics" ON public.analytics FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Sellers can view own analytics" ON public.analytics FOR SELECT USING (
  auth.uid() = seller_id OR public.get_my_role() = 'admin'
);

-- REVIEWS
CREATE POLICY "Reviews are viewable by everyone" ON public.merchant_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert reviews" ON public.merchant_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can moderate reviews" ON public.merchant_reviews FOR DELETE USING (public.get_my_role() = 'admin');

CREATE POLICY "Product reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert product reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can moderate product reviews" ON public.product_reviews FOR DELETE USING (public.get_my_role() = 'admin');

-- ORDERS
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.get_my_role() = 'admin');
CREATE POLICY "Merchants can view their orders" ON public.orders FOR SELECT USING (auth.uid() = merchant_id OR public.get_my_role() = 'admin');

-- BOOKINGS
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Merchants and bookers can view bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = merchant_id OR auth.uid() = user_id OR public.get_my_role() = 'admin'
);
CREATE POLICY "Merchants can update booking status" ON public.bookings FOR UPDATE USING (
  auth.uid() = merchant_id OR public.get_my_role() = 'admin'
);

-- 9. Trigger to automatically create profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Ignore any role metadata from OAuth for security
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
