-- Create credits system and referrals tables

-- Credits table to track user credits
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Referrals table to track referral relationships
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  referral_code TEXT NOT NULL UNIQUE,
  credits_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact access log to track which contacts users have accessed
CREATE TABLE public.contact_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES flat_listings(id) ON DELETE CASCADE,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  credits_used INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, listing_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_access_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_credits
CREATE POLICY "Users can view their own credits" 
ON public.user_credits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" 
ON public.user_credits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for referrals
CREATE POLICY "Users can view their own referrals" 
ON public.referrals 
FOR SELECT 
USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals" 
ON public.referrals 
FOR INSERT 
WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update their own referrals" 
ON public.referrals 
FOR UPDATE 
USING (auth.uid() = referrer_id);

-- RLS policies for contact_access_log
CREATE POLICY "Users can view their own contact access log" 
ON public.contact_access_log 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create contact access records" 
ON public.contact_access_log 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Function to initialize credits for new users
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 10)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process successful referrals
CREATE OR REPLACE FUNCTION public.process_referral_signup(referred_email TEXT, referral_code TEXT)
RETURNS VOID AS $$
DECLARE
  referral_record RECORD;
  new_user_id UUID;
BEGIN
  -- Find the referral record
  SELECT * INTO referral_record 
  FROM public.referrals 
  WHERE referrals.referral_code = process_referral_signup.referral_code 
  AND referred_email = process_referral_signup.referred_email
  AND status = 'pending';
  
  IF referral_record.id IS NOT NULL THEN
    -- Get the new user's ID
    SELECT id INTO new_user_id 
    FROM auth.users 
    WHERE email = referred_email;
    
    IF new_user_id IS NOT NULL THEN
      -- Update referral record
      UPDATE public.referrals 
      SET 
        referred_user_id = new_user_id,
        status = 'completed',
        credits_awarded = 3,
        updated_at = now()
      WHERE id = referral_record.id;
      
      -- Award credits to referrer
      UPDATE public.user_credits 
      SET 
        credits = credits + 3,
        updated_at = now()
      WHERE user_id = referral_record.referrer_id;
      
      -- Initialize credits for referred user
      INSERT INTO public.user_credits (user_id, credits)
      VALUES (new_user_id, 10)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to consume credits when accessing contacts
CREATE OR REPLACE FUNCTION public.consume_credit_for_contact(listing_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
  already_accessed BOOLEAN;
BEGIN
  -- Check if user already accessed this contact
  SELECT EXISTS(
    SELECT 1 FROM public.contact_access_log 
    WHERE user_id = auth.uid() AND contact_access_log.listing_id = consume_credit_for_contact.listing_id
  ) INTO already_accessed;
  
  -- If already accessed, return true without consuming credits
  IF already_accessed THEN
    RETURN TRUE;
  END IF;
  
  -- Get current credits
  SELECT credits INTO current_credits 
  FROM public.user_credits 
  WHERE user_id = auth.uid();
  
  -- If no credits record exists, create one with 10 credits
  IF current_credits IS NULL THEN
    INSERT INTO public.user_credits (user_id, credits)
    VALUES (auth.uid(), 10);
    current_credits := 10;
  END IF;
  
  -- Check if user has enough credits
  IF current_credits <= 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Consume credit
  UPDATE public.user_credits 
  SET 
    credits = credits - 1,
    updated_at = now()
  WHERE user_id = auth.uid();
  
  -- Log the access
  INSERT INTO public.contact_access_log (user_id, listing_id, credits_used)
  VALUES (auth.uid(), listing_id, 1);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = code) INTO code_exists;
    
    -- If code doesn't exist, break the loop
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to initialize credits for new users
CREATE TRIGGER trigger_initialize_user_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_credits();

-- Update timestamps trigger for user_credits
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamps trigger for referrals
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();