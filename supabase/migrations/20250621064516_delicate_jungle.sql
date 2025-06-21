/*
  # Add Advanced Platform Features

  1. New Tables
    - `saved_searches` - User saved search criteria
    - `listing_views` - Track listing view analytics
    - `user_activity_log` - Track user activities
    - `property_reports` - User reports for inappropriate content
    - `listing_boosts` - Paid listing promotions

  2. Enhancements
    - Add more fields to existing tables
    - Improve search and analytics capabilities
*/

-- Create saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  search_criteria jsonb NOT NULL,
  is_active boolean DEFAULT true,
  email_alerts boolean DEFAULT false,
  last_notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listing views table for analytics
CREATE TABLE IF NOT EXISTS listing_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES flat_listings(id) ON DELETE CASCADE NOT NULL,
  viewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  viewer_ip inet,
  user_agent text,
  referrer text,
  view_duration integer, -- in seconds
  created_at timestamptz DEFAULT now()
);

-- Create user activity log
CREATE TABLE IF NOT EXISTS user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  activity_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create property reports table
CREATE TABLE IF NOT EXISTS property_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES flat_listings(id) ON DELETE CASCADE NOT NULL,
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('spam', 'inappropriate', 'fake', 'duplicate', 'other')),
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listing boosts table
CREATE TABLE IF NOT EXISTS listing_boosts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES flat_listings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  boost_type text NOT NULL CHECK (boost_type IN ('featured', 'priority', 'highlighted')),
  amount_paid integer NOT NULL, -- in paise/cents
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to existing tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';

ALTER TABLE flat_listings ADD COLUMN IF NOT EXISTS boost_score integer DEFAULT 0;
ALTER TABLE flat_listings ADD COLUMN IF NOT EXISTS quality_score integer DEFAULT 50;
ALTER TABLE flat_listings ADD COLUMN IF NOT EXISTS response_rate integer DEFAULT 0;
ALTER TABLE flat_listings ADD COLUMN IF NOT EXISTS last_boosted_at timestamptz;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_listing_id ON listing_views(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_created_at ON listing_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_reports_listing_id ON property_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_property_reports_status ON property_reports(status);
CREATE INDEX IF NOT EXISTS idx_listing_boosts_listing_id ON listing_boosts(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_boosts_active ON listing_boosts(is_active, ends_at);

-- Enable RLS
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_boosts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved searches
CREATE POLICY "Users can manage their own saved searches"
  ON saved_searches
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for listing views (owners can see their listing analytics)
CREATE POLICY "Listing owners can view their listing analytics"
  ON listing_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flat_listings 
      WHERE id = listing_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create listing views"
  ON listing_views
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for user activity log
CREATE POLICY "Users can view their own activity log"
  ON user_activity_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for property reports
CREATE POLICY "Users can create property reports"
  ON property_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
  ON property_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- RLS Policies for listing boosts
CREATE POLICY "Users can view boosts for their listings"
  ON listing_boosts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create boosts for their listings"
  ON listing_boosts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM flat_listings 
      WHERE id = listing_id AND owner_id = auth.uid()
    )
  );

-- Add triggers
CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_reports_updated_at
  BEFORE UPDATE ON property_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update listing boost score
CREATE OR REPLACE FUNCTION update_listing_boost_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE flat_listings 
  SET boost_score = (
    SELECT COALESCE(SUM(
      CASE 
        WHEN boost_type = 'featured' THEN 100
        WHEN boost_type = 'priority' THEN 50
        WHEN boost_type = 'highlighted' THEN 25
        ELSE 0
      END
    ), 0)
    FROM listing_boosts 
    WHERE listing_id = NEW.listing_id 
    AND is_active = true 
    AND ends_at > now()
  ),
  last_boosted_at = now()
  WHERE id = NEW.listing_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_boost_score_on_insert
  AFTER INSERT ON listing_boosts
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_boost_score();