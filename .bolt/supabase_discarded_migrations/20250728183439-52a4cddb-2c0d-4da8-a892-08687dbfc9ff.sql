-- Fix security issues: Add search_path to functions

-- Update initialize_user_credits function
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 10)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update process_referral_signup function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update consume_credit_for_contact function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update generate_referral_code function
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
$$ LANGUAGE plpgsql SET search_path = '';