/*
  # Enhanced Credits System

  1. Improvements
    - Add better indexing for performance
    - Add constraints for data integrity
    - Add helper functions for credit operations
    - Add audit trail for credit transactions

  2. New Functions
    - consume_credit_for_contact: Atomic credit consumption
    - get_user_credit_balance: Get current balance
    - add_credits_to_user: Add credits with audit trail

  3. Security
    - Enhanced RLS policies
    - Better error handling
    - Audit trail for all credit operations
*/

-- Add audit trail table for credit transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'refund')),
  amount integer NOT NULL,
  balance_before integer NOT NULL,
  balance_after integer NOT NULL,
  description text,
  related_id uuid, -- Could reference referral_id, listing_id, etc.
  created_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- Enable RLS on credit_transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for credit_transactions
CREATE POLICY "Users can view their own credit transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Enhanced function to consume credit for contact access
CREATE OR REPLACE FUNCTION consume_credit_for_contact(listing_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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
  FROM contact_access_log
  WHERE user_id = current_user_id AND listing_id = listing_id;

  IF existing_access_id IS NOT NULL THEN
    -- User already has access, return true without charging
    RETURN true;
  END IF;

  -- Get current credit balance
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = current_user_id;

  -- If no credits record exists, create one with 10 credits
  IF current_credits IS NULL THEN
    INSERT INTO user_credits (user_id, credits)
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
    UPDATE user_credits
    SET credits = credits - 1,
        updated_at = now()
    WHERE user_id = current_user_id;

    -- Log the contact access
    INSERT INTO contact_access_log (user_id, listing_id, credits_used)
    VALUES (current_user_id, listing_id, 1);

    -- Add audit trail
    INSERT INTO credit_transactions (
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

-- Function to add credits to user (for referrals, purchases, etc.)
CREATE OR REPLACE FUNCTION add_credits_to_user(
  target_user_id uuid,
  credit_amount integer,
  transaction_type text DEFAULT 'earned',
  description text DEFAULT NULL,
  related_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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
  FROM user_credits
  WHERE user_id = target_user_id;

  -- If no credits record exists, create one
  IF current_credits IS NULL THEN
    INSERT INTO user_credits (user_id, credits)
    VALUES (target_user_id, credit_amount);
    current_credits := 0;
  ELSE
    -- Update existing record
    UPDATE user_credits
    SET credits = credits + credit_amount,
        updated_at = now()
    WHERE user_id = target_user_id;
  END IF;

  -- Add audit trail
  INSERT INTO credit_transactions (
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

-- Function to get user credit balance
CREATE OR REPLACE FUNCTION get_user_credit_balance(target_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  credit_balance integer;
BEGIN
  SELECT credits INTO credit_balance
  FROM user_credits
  WHERE user_id = target_user_id;

  -- If no record exists, create one with default 10 credits
  IF credit_balance IS NULL THEN
    INSERT INTO user_credits (user_id, credits)
    VALUES (target_user_id, 10);
    RETURN 10;
  END IF;

  RETURN credit_balance;
END;
$$;

-- Enhanced referral completion trigger
CREATE OR REPLACE FUNCTION handle_referral_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referral_record record;
BEGIN
  -- Check if this is a new user signup
  IF TG_OP = 'INSERT' THEN
    -- Look for pending referral with this email
    SELECT * INTO referral_record
    FROM referrals
    WHERE referred_email = NEW.email
      AND status = 'pending'
      AND referred_user_id IS NULL
    LIMIT 1;

    IF referral_record IS NOT NULL THEN
      -- Update referral record
      UPDATE referrals
      SET referred_user_id = NEW.id,
          status = 'completed',
          credits_awarded = 3,
          updated_at = now()
      WHERE id = referral_record.id;

      -- Give credits to referrer
      PERFORM add_credits_to_user(
        referral_record.referrer_id,
        3,
        'earned',
        'Referral bonus for ' || NEW.email,
        referral_record.id
      );

      -- Give welcome credits to new user
      PERFORM add_credits_to_user(
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

-- Create trigger for referral completion (if not exists)
DROP TRIGGER IF EXISTS on_profile_created_handle_referral ON profiles;
CREATE TRIGGER on_profile_created_handle_referral
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_referral_completion();

-- Add better constraints to existing tables
DO $$
BEGIN
  -- Add constraint to ensure credits are never negative
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'user_credits' AND constraint_name = 'user_credits_credits_non_negative'
  ) THEN
    ALTER TABLE user_credits ADD CONSTRAINT user_credits_credits_non_negative CHECK (credits >= 0);
  END IF;

  -- Add constraint to ensure credit transactions have valid amounts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'credit_transactions' AND constraint_name = 'credit_transactions_amount_not_zero'
  ) THEN
    ALTER TABLE credit_transactions ADD CONSTRAINT credit_transactions_amount_not_zero CHECK (amount != 0);
  END IF;
END $$;

-- Update existing user_credits trigger to use new audit function
CREATE OR REPLACE FUNCTION update_user_credits_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits_updated_at();