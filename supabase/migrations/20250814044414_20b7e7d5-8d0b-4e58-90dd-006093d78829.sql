-- CRITICAL SECURITY FIX: Phase 1 & 2 - Profile Data Protection and Function Hardening

-- 1. Drop ALL existing profile policies to start fresh
DROP POLICY IF EXISTS "Users can view other profiles for listings" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- 2. Create secure profile visibility policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Only allow viewing limited profile data for contact access (after credit consumption)
CREATE POLICY "Limited profile access for contact verification" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.contact_access_log cal 
    WHERE cal.user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM public.flat_listings fl 
      WHERE fl.owner_id = profiles.id 
      AND cal.listing_id = fl.id
    )
  )
);

-- 3. Fix all database function security issues by adding SET search_path = ''

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix initialize_user_credits function
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 10)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 4. Create audit logging table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  ip_address inet,
  user_agent text,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow viewing own audit logs
CREATE POLICY "Users can view their own audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (auth.uid() = user_id);

-- 5. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  action_type text,
  resource_type text DEFAULT NULL,
  resource_id uuid DEFAULT NULL,
  details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    details
  );
END;
$$;

-- 6. Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action_type text NOT NULL,
  ip_address inet,
  attempt_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  action_type text,
  max_attempts integer DEFAULT 10,
  window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_attempts integer := 0;
  window_start_time timestamp with time zone;
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  window_start_time := now() - (window_minutes || ' minutes')::interval;

  -- Clean up old rate limit records
  DELETE FROM public.rate_limits 
  WHERE created_at < window_start_time;

  -- Count current attempts
  SELECT COALESCE(SUM(attempt_count), 0) INTO current_attempts
  FROM public.rate_limits
  WHERE (current_user_id IS NOT NULL AND rate_limits.user_id = current_user_id)
    AND action_type = check_rate_limit.action_type
    AND window_start >= window_start_time;

  -- Check if limit exceeded
  IF current_attempts >= max_attempts THEN
    RETURN false;
  END IF;

  -- Record this attempt
  INSERT INTO public.rate_limits (user_id, action_type, attempt_count)
  VALUES (current_user_id, action_type, 1)
  ON CONFLICT (user_id, action_type) 
  DO UPDATE SET 
    attempt_count = rate_limits.attempt_count + 1,
    window_start = CASE 
      WHEN rate_limits.window_start < window_start_time THEN now()
      ELSE rate_limits.window_start
    END;

  RETURN true;
END;
$$;