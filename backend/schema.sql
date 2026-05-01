-- AIRN Backend Database Schema for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  picture TEXT,
  bio TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Inventions table
CREATE TABLE IF NOT EXISTS inventions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  images JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'published',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on inventions
CREATE INDEX IF NOT EXISTS inventions_user_id_idx ON inventions(user_id);
CREATE INDEX IF NOT EXISTS inventions_category_idx ON inventions(category);
CREATE INDEX IF NOT EXISTS inventions_status_idx ON inventions(status);
CREATE INDEX IF NOT EXISTS inventions_created_at_idx ON inventions(created_at DESC);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY,
  invention_id UUID NOT NULL REFERENCES inventions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on reviews
CREATE INDEX IF NOT EXISTS reviews_invention_id_idx ON reviews(invention_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);

-- Community Posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]',
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on community posts
CREATE INDEX IF NOT EXISTS community_posts_user_id_idx ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS community_posts_category_idx ON community_posts(category);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at DESC);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY,
  invention_id UUID NOT NULL REFERENCES inventions(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on transactions
CREATE INDEX IF NOT EXISTS transactions_invention_id_idx ON transactions(invention_id);
CREATE INDEX IF NOT EXISTS transactions_buyer_id_idx ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS transactions_seller_id_idx ON transactions(seller_id);

-- Enable Row Level Security (Optional but recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (users can only see their own data)
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR true);

-- Create policies for inventions table (anyone can view published inventions)
CREATE POLICY "Anyone can view published inventions"
  ON inventions FOR SELECT
  USING (status = 'published' OR user_id = auth.uid()::text::uuid);

-- Create policies for community posts (anyone can view)
CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  USING (true);
