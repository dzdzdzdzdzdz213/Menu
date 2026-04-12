-- ============================================================
-- FIX: Google Sign-In RLS Policies
-- Run this in the Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Allow authenticated users to INSERT their own profile row
--    (needed as client-side fallback if the DB trigger is slow/failed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
    RAISE NOTICE 'Created: Users can insert own profile';
  ELSE
    RAISE NOTICE 'Already exists: Users can insert own profile';
  END IF;
END $$;

-- 2. Allow users to always SELECT their own profile row
--    (the existing SELECT policy blocks rows where is_active = FALSE,
--     which can happen right after creation before the trigger sets it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id)';
    RAISE NOTICE 'Created: Users can view own profile';
  ELSE
    RAISE NOTICE 'Already exists: Users can view own profile';
  END IF;
END $$;

-- 3. Verify: show all current policies on profiles
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 4. Verify: confirm the new user trigger exists and is enabled
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
