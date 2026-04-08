-- AI Panchayat Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. Create Societies Table
CREATE TABLE societies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Profiles Table (Extends Auth.Users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  flat_number TEXT,
  role TEXT DEFAULT 'resident' CHECK (role IN ('resident', 'secretary', 'treasurer', 'chairman')),
  society_id UUID REFERENCES societies(id),
  lang_pref TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Create Tickets Table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  society_id UUID REFERENCES societies(id),
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
  urgency INTEGER DEFAULT 1 CHECK (urgency BETWEEN 1 AND 3),
  flat_number TEXT,
  assigned_vendor_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tickets in their society" ON tickets
  FOR SELECT USING (
    society_id IN (
      SELECT society_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create tickets" ON tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Create Notices Table
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID REFERENCES societies(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT,
  created_by UUID REFERENCES profiles(id),
  is_important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents can view notices" ON notices
  FOR SELECT USING (
    society_id IN (
      SELECT society_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 5. Create Polls & Votes
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID REFERENCES societies(id),
  question TEXT NOT NULL,
  question_hi TEXT,
  options JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vote_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents can view polls" ON polls
  FOR SELECT USING (
    society_id IN (
      SELECT society_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Residents can vote in polls" ON poll_votes
  FOR ALL USING (auth.uid() = user_id);

-- 6. Create Vendors Table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID REFERENCES societies(id),
  name TEXT NOT NULL,
  category TEXT,
  phone TEXT,
  rating DECIMAL(3,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents can view vendors" ON vendors
  FOR SELECT USING (
    society_id IN (
      SELECT society_id FROM profiles WHERE id = auth.uid()
    )
  );

-- 7. Create Bylaws Table (for RAG)
CREATE TABLE bylaws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID REFERENCES societies(id),
  rule_number TEXT,
  content TEXT NOT NULL,
  content_hi TEXT,
  embedding VECTOR(1536) -- Requires extension `vector`
);

-- 8. Finance History
CREATE TABLE maintenance_dues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('paid', 'pending', 'overdue')),
  paid_on TIMESTAMPTZ,
  narration TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE maintenance_dues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dues" ON maintenance_dues
  FOR SELECT USING (auth.uid() = user_id);
