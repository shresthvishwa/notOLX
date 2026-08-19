-- Supabase Schema for notOLX (Campus Second-Hand Marketplace)

-- 1. PROFILES TABLE (Student Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  college_name TEXT NOT NULL DEFAULT 'Stanford University',
  college_id TEXT,
  student_id_url TEXT,
  avatar_url TEXT,
  dorm_block TEXT,
  rating_avg NUMERIC(3,2) DEFAULT 5.0,
  rating_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. LISTINGS TABLE (Products for Sale)
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  condition TEXT NOT NULL, -- 'Like New', 'Excellent', 'Good', 'Fair'
  images TEXT[] DEFAULT '{}',
  campus_location TEXT NOT NULL, -- e.g. 'Main Library', 'Engineering Block', 'Dorm 4'
  status TEXT NOT NULL DEFAULT 'available', -- 'available', 'reserved', 'sold'
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Listings are viewable by anyone" ON public.listings;
CREATE POLICY "Listings are viewable by anyone"
  ON public.listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own listings" ON public.listings;
DROP POLICY IF EXISTS "Anyone can insert listings" ON public.listings;
CREATE POLICY "Anyone can insert listings"
  ON public.listings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own listings" ON public.listings;
DROP POLICY IF EXISTS "Anyone can update listings" ON public.listings;
CREATE POLICY "Anyone can update listings"
  ON public.listings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete own listings" ON public.listings;
DROP POLICY IF EXISTS "Anyone can delete listings" ON public.listings;
CREATE POLICY "Anyone can delete listings"
  ON public.listings FOR DELETE USING (true);

-- 3. CONVERSATIONS TABLE (1-on-1 Chat Threads)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(product_id, buyer_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Anyone can view conversations" ON public.conversations;
CREATE POLICY "Anyone can view conversations"
  ON public.conversations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert conversations" ON public.conversations;
DROP POLICY IF EXISTS "Anyone can insert conversations" ON public.conversations;
CREATE POLICY "Anyone can insert conversations"
  ON public.conversations FOR INSERT WITH CHECK (true);

-- 4. MESSAGES TABLE (Realtime Chat Messages & Offers)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  offer_price NUMERIC(10,2), -- NULL unless message is a price negotiation offer
  meetup_spot TEXT,          -- NULL unless message includes suggested location
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;
CREATE POLICY "Anyone can view messages"
  ON public.messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
CREATE POLICY "Anyone can insert messages"
  ON public.messages FOR INSERT WITH CHECK (true);

-- 5. REVIEWS TABLE (Ratings & Feedback)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  tags TEXT[] DEFAULT '{}', -- e.g. ['Punctual', 'Item as described', 'Fair price']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by anyone"
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews for completed deals"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE listings;
