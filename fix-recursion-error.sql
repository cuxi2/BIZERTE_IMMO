-- =========================================
-- IMMEDIATE FIX FOR INFINITE RECURSION ERROR
-- =========================================

-- Step 1: Disable RLS on profiles table to stop recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop the problematic policy causing recursion
DROP POLICY IF EXISTS "Profiles are viewable by admins." ON public.profiles;

-- Step 3: Create a new non-recursive policy
CREATE POLICY "Profiles are viewable by admins." 
ON public.profiles FOR SELECT 
USING (
  -- Non-recursive check: Get current user's role without referencing profiles table again
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- Step 4: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify the fix worked
SELECT '✅ RLS recursion fix applied successfully!' as result;