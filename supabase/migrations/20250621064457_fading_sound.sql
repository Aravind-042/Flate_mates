/*
  # Add Payment and Transaction System

  1. New Tables
    - `payment_methods` - User payment methods
    - `transactions` - Payment transactions
    - `subscription_plans` - Premium subscription plans
    - `user_subscriptions` - User subscription records

  2. Security
    - Enable RLS on all new tables
    - Add policies for user-specific data access
*/

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly integer NOT NULL, -- in paise/cents
  price_yearly integer, -- in paise/cents
  features jsonb DEFAULT '[]',
  max_listings integer DEFAULT 5,
  priority_support boolean DEFAULT false,
  verified_badge boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES subscription_plans(id) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  auto_renew boolean DEFAULT true,
  payment_method text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('card', 'upi', 'netbanking', 'wallet')),
  provider text, -- razorpay, stripe, etc.
  provider_payment_method_id text,
  last_four text,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  payment_method_id uuid REFERENCES payment_methods(id) ON DELETE SET NULL,
  amount integer NOT NULL, -- in paise/cents
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_gateway text, -- razorpay, stripe, etc.
  gateway_transaction_id text,
  gateway_response jsonb,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription plans (public read)
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for user subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for payment methods
CREATE POLICY "Users can manage their own payment methods"
  ON payment_methods
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, max_listings, priority_support, verified_badge) VALUES
('Free', 'Basic plan for casual users', 0, 0, '["Up to 2 listings", "Basic search", "Standard support"]', 2, false, false),
('Premium', 'Enhanced features for serious users', 29900, 299900, '["Up to 10 listings", "Priority in search", "Advanced filters", "Priority support", "Verified badge"]', 10, true, true),
('Pro', 'Professional plan for property dealers', 59900, 599900, '["Unlimited listings", "Top priority in search", "Analytics dashboard", "Dedicated support", "Verified badge", "Bulk upload"]', -1, true, true)
ON CONFLICT DO NOTHING;

-- Add triggers
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();