-- ==============================================================================
-- ZEONY TEAM MEMBERS & ADMIN POLICIES MIGRATION SCRIPT
-- ==============================================================================
-- Run this in your Supabase Dashboard -> SQL Editor (or migrations tab).
-- It ensures existing 'team_members' has all needed columns and grants permissions
-- so inserts, updates, and deletes from the Admin Panel never fail.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ensure team_members table exists
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200),
    title VARCHAR(200),
    role VARCHAR(200),
    subtitle VARCHAR(200),
    category VARCHAR(100) DEFAULT 'Engineering',
    description TEXT,
    icon_name VARCHAR(20),
    image_url TEXT,
    linkedin_url TEXT,
    whatsapp_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add columns if table already existed previously with older schema
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'title') THEN
        ALTER TABLE public.team_members ADD COLUMN title VARCHAR(200);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'name') THEN
        ALTER TABLE public.team_members ADD COLUMN name VARCHAR(200);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'role') THEN
        ALTER TABLE public.team_members ADD COLUMN role VARCHAR(200);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'subtitle') THEN
        ALTER TABLE public.team_members ADD COLUMN subtitle VARCHAR(200);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'category') THEN
        ALTER TABLE public.team_members ADD COLUMN category VARCHAR(100) DEFAULT 'Engineering';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'icon_name') THEN
        ALTER TABLE public.team_members ADD COLUMN icon_name VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'features') THEN
        ALTER TABLE public.team_members ADD COLUMN features JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'display_order') THEN
        ALTER TABLE public.team_members ADD COLUMN display_order INT DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'image_url') THEN
        ALTER TABLE public.team_members ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- 3. Synchronize name/title and role/subtitle for any legacy rows
UPDATE public.team_members SET title = COALESCE(title, name) WHERE title IS NULL;
UPDATE public.team_members SET name = COALESCE(name, title) WHERE name IS NULL;
UPDATE public.team_members SET subtitle = COALESCE(subtitle, role) WHERE subtitle IS NULL;
UPDATE public.team_members SET role = COALESCE(role, subtitle) WHERE role IS NULL;

-- 4. Enable Row Level Security (RLS) and grant policies for anon + authenticated
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on team_members" ON public.team_members;
CREATE POLICY "Allow public read on team_members" ON public.team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon all on team_members" ON public.team_members;
CREATE POLICY "Allow anon all on team_members" ON public.team_members FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated all on team_members" ON public.team_members;
CREATE POLICY "Allow authenticated all on team_members" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
