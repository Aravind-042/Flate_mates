/*
  # Improve Search and Discovery Features

  1. New Tables
    - `trending_searches` - Track popular search terms
    - `location_suggestions` - Auto-complete for locations
    - `listing_tags` - Flexible tagging system

  2. Functions
    - Full-text search functions
    - Recommendation algorithms
    - Search ranking improvements
*/

-- Create trending searches table
CREATE TABLE IF NOT EXISTS trending_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_term text NOT NULL,
  search_count integer DEFAULT 1,
  last_searched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(search_term)
);

-- Create location suggestions table
CREATE TABLE IF NOT EXISTS location_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  area text NOT NULL,
  full_address text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  popularity_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(city, area)
);

-- Create listing tags table
CREATE TABLE IF NOT EXISTS listing_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES flat_listings(id) ON DELETE CASCADE NOT NULL,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, tag)
);

-- Add full-text search columns to flat_listings
ALTER TABLE flat_listings ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_trending_searches_count ON trending_searches(search_count DESC);
CREATE INDEX IF NOT EXISTS idx_location_suggestions_city ON location_suggestions(city);
CREATE INDEX IF NOT EXISTS idx_location_suggestions_popularity ON location_suggestions(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_listing_tags_tag ON listing_tags(tag);
CREATE INDEX IF NOT EXISTS idx_flat_listings_search_vector ON flat_listings USING gin(search_vector);

-- Enable RLS
ALTER TABLE trending_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read for search features)
CREATE POLICY "Anyone can view trending searches"
  ON trending_searches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view location suggestions"
  ON location_suggestions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view listing tags"
  ON listing_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Listing owners can manage their listing tags"
  ON listing_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flat_listings 
      WHERE id = listing_id AND owner_id = auth.uid()
    )
  );

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_listing_search_vector()
RETURNS TRIGGER AS $$
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
$$ language 'plpgsql';

-- Trigger to automatically update search vector
CREATE TRIGGER update_flat_listings_search_vector
  BEFORE INSERT OR UPDATE ON flat_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_search_vector();

-- Function to track search terms
CREATE OR REPLACE FUNCTION track_search_term(term text)
RETURNS void AS $$
BEGIN
  INSERT INTO trending_searches (search_term, search_count, last_searched_at)
  VALUES (lower(trim(term)), 1, now())
  ON CONFLICT (search_term)
  DO UPDATE SET 
    search_count = trending_searches.search_count + 1,
    last_searched_at = now();
END;
$$ language 'plpgsql';

-- Function for intelligent search with ranking
CREATE OR REPLACE FUNCTION search_listings(
  search_query text DEFAULT '',
  city_filter text DEFAULT '',
  min_rent integer DEFAULT 0,
  max_rent integer DEFAULT 999999999,
  property_types text[] DEFAULT '{}',
  min_bedrooms integer DEFAULT 0,
  amenities_filter text[] DEFAULT '{}',
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  monthly_rent integer,
  property_type text,
  bedrooms integer,
  bathrooms integer,
  search_rank real,
  boost_score integer,
  created_at timestamptz
) AS $$
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
  FROM flat_listings fl
  LEFT JOIN locations l ON fl.location_id = l.id
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
$$ language 'plpgsql';

-- Populate location suggestions from existing data
INSERT INTO location_suggestions (city, area, popularity_score)
SELECT 
  l.city,
  l.area,
  COUNT(fl.id) as popularity_score
FROM locations l
LEFT JOIN flat_listings fl ON l.id = fl.location_id
GROUP BY l.city, l.area
ON CONFLICT (city, area) DO UPDATE SET
  popularity_score = EXCLUDED.popularity_score;

-- Update existing listings' search vectors
UPDATE flat_listings SET search_vector = to_tsvector('english', 
  COALESCE(title, '') || ' ' ||
  COALESCE(description, '') || ' ' ||
  COALESCE(address_line1, '') || ' ' ||
  COALESCE(address_line2, '') || ' ' ||
  COALESCE(array_to_string(amenities, ' '), '') || ' ' ||
  COALESCE(array_to_string(nearby_facilities, ' '), '')
);