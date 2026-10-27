-- Supabase Schema for notoLX (Campus Second-Hand Marketplace)

-- 1. PROFILES TABLE (Student Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  college_name TEXT NOT NULL DEFAULT 'Thapar Institute of Engineering & Technology',
  college_id TEXT,
  student_id_url TEXT,
  avatar_url TEXT,
  dorm_block TEXT,
  major TEXT DEFAULT 'Engineering Student',
  rating_avg NUMERIC(3,2) DEFAULT 5.0,
  rating_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by anyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by anyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profile" ON public.profiles;
CREATE POLICY "Anyone can insert profile"
  ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profile" ON public.profiles;
CREATE POLICY "Anyone can update profile"
  ON public.profiles FOR UPDATE USING (true);


-- 2. LISTINGS TABLE (Products for Sale)
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  category TEXT NOT NULL,
  condition TEXT NOT NULL, -- 'Like New', 'Excellent', 'Good', 'Fair'
  images TEXT[] DEFAULT '{}',
  campus_location TEXT NOT NULL,
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
DROP POLICY IF EXISTS "Authenticated users can insert listings" ON public.listings;
DROP POLICY IF EXISTS "Verified sellers can insert listings" ON public.listings;
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

DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Anyone can update conversations" ON public.conversations;
CREATE POLICY "Anyone can update conversations"
  ON public.conversations FOR UPDATE USING (true);


-- 4. MESSAGES TABLE (Realtime Chat Messages & Offers)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  offer_price NUMERIC(10,2),
  meetup_spot TEXT,
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
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews are viewable by anyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by anyone"
  ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert reviews for completed deals" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;
CREATE POLICY "Anyone can insert reviews"
  ON public.reviews FOR INSERT WITH CHECK (true);


-- 6. ITEM REQUESTS TABLE (Wanted Items on Campus)
CREATE TABLE IF NOT EXISTS public.item_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'all',
  max_budget NUMERIC(10,2),
  description TEXT,
  campus_location TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'fulfilled', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.item_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Item requests are viewable by anyone" ON public.item_requests;
CREATE POLICY "Item requests are viewable by anyone"
  ON public.item_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert item requests" ON public.item_requests;
CREATE POLICY "Anyone can insert item requests"
  ON public.item_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update item requests" ON public.item_requests;
CREATE POLICY "Anyone can update item requests"
  ON public.item_requests FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete item requests" ON public.item_requests;
CREATE POLICY "Anyone can delete item requests"
  ON public.item_requests FOR DELETE USING (true);


-- Safe Realtime Publication Setup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'listings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'item_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.item_requests;
  END IF;
END $$;

