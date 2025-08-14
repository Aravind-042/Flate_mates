-- Fix remaining function security issues - Add SET search_path = '' to all remaining functions

-- Fix all remaining functions that still need search_path security

CREATE OR REPLACE FUNCTION public.add_credits_to_user(target_user_id uuid, credit_amount integer, transaction_type text DEFAULT 'earned'::text, description text DEFAULT NULL::text, related_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_credits integer;
BEGIN
  -- Validate transaction type
  IF transaction_type NOT IN ('earned', 'bonus', 'refund') THEN
    RAISE EXCEPTION 'Invalid transaction type';
  END IF;

  -- Validate credit amount
  IF credit_amount <= 0 THEN
    RAISE EXCEPTION 'Credit amount must be positive';
  END IF;

  -- Get current credit balance
  SELECT credits INTO current_credits
  FROM public.user_credits
  WHERE user_id = target_user_id;

  -- If no credits record exists, create one
  IF current_credits IS NULL THEN
    INSERT INTO public.user_credits (user_id, credits)
    VALUES (target_user_id, credit_amount);
    current_credits := 0;
  ELSE
    -- Update existing record
    UPDATE public.user_credits
    SET credits = credits + credit_amount,
        updated_at = now()
    WHERE user_id = target_user_id;
  END IF;

  -- Add audit trail
  INSERT INTO public.credit_transactions (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    description,
    related_id
  ) VALUES (
    target_user_id,
    transaction_type,
    credit_amount,
    current_credits,
    current_credits + credit_amount,
    description,
    related_id
  );

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to add credits: %', SQLERRM;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_credit_balance(target_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  credit_balance integer;
BEGIN
  SELECT credits INTO credit_balance
  FROM public.user_credits
  WHERE user_id = target_user_id;

  -- If no record exists, create one with default 10 credits
  IF credit_balance IS NULL THEN
    INSERT INTO public.user_credits (user_id, credits)
    VALUES (target_user_id, 10);
    RETURN 10;
  END IF;

  RETURN credit_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.handle_referral_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  referral_record record;
BEGIN
  -- Check if this is a new user signup
  IF TG_OP = 'INSERT' THEN
    -- Look for pending referral with this email
    SELECT * INTO referral_record
    FROM public.referrals
    WHERE referred_email = NEW.email
      AND status = 'pending'
      AND referred_user_id IS NULL
    LIMIT 1;

    IF referral_record IS NOT NULL THEN
      -- Update referral record
      UPDATE public.referrals
      SET referred_user_id = NEW.id,
          status = 'completed',
          credits_awarded = 3,
          updated_at = now()
      WHERE id = referral_record.id;

      -- Give credits to referrer
      PERFORM public.add_credits_to_user(
        referral_record.referrer_id,
        3,
        'earned',
        'Referral bonus for ' || NEW.email,
        referral_record.id
      );

      -- Give welcome credits to new user
      PERFORM public.add_credits_to_user(
        NEW.id,
        10,
        'bonus',
        'Welcome bonus from referral',
        referral_record.id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_credits_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.process_referral_signup(referred_email text, referral_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.consume_credit_for_contact(listing_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_user_id uuid;
  current_credits integer;
  existing_access_id uuid;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if user already has access to this listing
  SELECT id INTO existing_access_id
  FROM public.contact_access_log
  WHERE user_id = current_user_id AND listing_id = listing_id;

  IF existing_access_id IS NOT NULL THEN
    -- User already has access, return true without charging
    RETURN true;
  END IF;

  -- Get current credit balance
  SELECT credits INTO current_credits
  FROM public.user_credits
  WHERE user_id = current_user_id;

  -- If no credits record exists, create one with 10 credits
  IF current_credits IS NULL THEN
    INSERT INTO public.user_credits (user_id, credits)
    VALUES (current_user_id, 10);
    current_credits := 10;
  END IF;

  -- Check if user has enough credits
  IF current_credits < 1 THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Start transaction
  BEGIN
    -- Deduct credit
    UPDATE public.user_credits
    SET credits = credits - 1,
        updated_at = now()
    WHERE user_id = current_user_id;

    -- Log the contact access
    INSERT INTO public.contact_access_log (user_id, listing_id, credits_used)
    VALUES (current_user_id, listing_id, 1);

    -- Add audit trail
    INSERT INTO public.credit_transactions (
      user_id,
      transaction_type,
      amount,
      balance_before,
      balance_after,
      description,
      related_id
    ) VALUES (
      current_user_id,
      'spent',
      -1,
      current_credits,
      current_credits - 1,
      'Contact access for listing',
      listing_id
    );

    RETURN true;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback will happen automatically
      RAISE EXCEPTION 'Failed to consume credit: %', SQLERRM;
  END;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_listing_boost_score()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.flat_listings 
  SET boost_score = (
    SELECT COALESCE(SUM(
      CASE 
        WHEN boost_type = 'featured' THEN 100
        WHEN boost_type = 'priority' THEN 50
        WHEN boost_type = 'highlighted' THEN 25
        ELSE 0
      END
    ), 0)
    FROM public.listing_boosts 
    WHERE listing_id = NEW.listing_id 
    AND is_active = true 
    AND ends_at > now()
  ),
  last_boosted_at = now()
  WHERE id = NEW.listing_id;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_sample_listings_for_user(user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  listing_count INTEGER := 0;
  sample_record RECORD;
BEGIN
  FOR sample_record IN 
    SELECT * FROM public.sample_listings
    ORDER BY RANDOM()
    LIMIT 3  -- Limit to 3 listings per user to avoid overwhelming
  LOOP
    INSERT INTO public.flat_listings (
      title, description, property_type, bedrooms, bathrooms, monthly_rent, 
      security_deposit, is_furnished, parking_available, amenities, 
      address_line1, address_line2, location_id, preferred_gender, 
      max_occupants, current_occupants, available_from, images, owner_id, status
    ) VALUES (
      sample_record.title,
      sample_record.description,
      sample_record.property_type,
      sample_record.bedrooms,
      sample_record.bathrooms,
      sample_record.monthly_rent,
      sample_record.security_deposit,
      sample_record.is_furnished,
      sample_record.parking_available,
      sample_record.amenities,
      sample_record.address_line1,
      sample_record.address_line2,
      (SELECT id FROM public.locations WHERE city = sample_record.city AND area = sample_record.area LIMIT 1),
      sample_record.preferred_gender,
      sample_record.max_occupants,
      0, -- current_occupants
      sample_record.available_from,
      sample_record.images,
      user_id,
      'active'
    );
    listing_count := listing_count + 1;
  END LOOP;
  
  RETURN listing_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_listing_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.address_line1, '') || ' ' ||
    COALESCE(NEW.address_line2, '') || ' ' ||
    COALESCE(array_to_string(NEW.amenities, ' '), '') || ' ' ||
    COALESCE(array_to_string(NEW.nearby_facilities, ' '), '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.track_search_term(term text)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.trending_searches (search_term, search_count, last_searched_at)
  VALUES (lower(trim(term)), 1, now())
  ON CONFLICT (search_term)
  DO UPDATE SET 
    search_count = public.trending_searches.search_count + 1,
    last_searched_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.search_listings(search_query text DEFAULT ''::text, city_filter text DEFAULT ''::text, min_rent integer DEFAULT 0, max_rent integer DEFAULT 999999999, property_types text[] DEFAULT '{}'::text[], min_bedrooms integer DEFAULT 0, amenities_filter text[] DEFAULT '{}'::text[], limit_count integer DEFAULT 20, offset_count integer DEFAULT 0)
RETURNS TABLE(id uuid, title text, description text, monthly_rent integer, property_type text, bedrooms integer, bathrooms integer, search_rank real, boost_score integer, created_at timestamp with time zone)
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fl.id,
    fl.title,
    fl.description,
    fl.monthly_rent,
    fl.property_type::text,
    fl.bedrooms,
    fl.bathrooms,
    CASE 
      WHEN search_query = '' THEN 1.0
      ELSE ts_rank(fl.search_vector, plainto_tsquery('english', search_query))
    END as search_rank,
    COALESCE(fl.boost_score, 0) as boost_score,
    fl.created_at
  FROM public.flat_listings fl
  LEFT JOIN public.locations l ON fl.location_id = l.id
  WHERE 
    fl.status = 'active'
    AND (search_query = '' OR fl.search_vector @@ plainto_tsquery('english', search_query))
    AND (city_filter = '' OR l.city ILIKE '%' || city_filter || '%')
    AND fl.monthly_rent >= min_rent
    AND fl.monthly_rent <= max_rent
    AND (array_length(property_types, 1) IS NULL OR fl.property_type = ANY(property_types))
    AND fl.bedrooms >= min_bedrooms
    AND (
      array_length(amenities_filter, 1) IS NULL OR 
      fl.amenities && amenities_filter
    )
  ORDER BY 
    COALESCE(fl.boost_score, 0) DESC,
    CASE 
      WHEN search_query = '' THEN fl.created_at
      ELSE ts_rank(fl.search_vector, plainto_tsquery('english', search_query))
    END DESC,
    fl.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    phone_number, 
    full_name, 
    city,
    profession,
    age
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'profession', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'age')::integer 
      ELSE NULL 
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Add missing RLS policy for rate_limits table
CREATE POLICY "Users can view their own rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);