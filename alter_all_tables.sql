-- ==============================================================================
-- ZEONY TECHNOLOGIES - COMPREHENSIVE ALTER TABLE & RLS MIGRATION SCRIPT
-- ==============================================================================
-- Run this script in your Supabase Dashboard -> SQL Editor.
-- It safely alters all existing tables without losing data by adding any missing
-- columns, syncing aliases, enabling Row Level Security (RLS), and granting
-- full SELECT, INSERT, UPDATE, DELETE permissions for the admin panel.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TEAM MEMBERS TABLE (public.team_members)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS role VARCHAR(200);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS subtitle VARCHAR(200);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Engineering';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS icon_name VARCHAR(20);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS whatsapp_url TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- Sync legacy name/title and role/subtitle columns
UPDATE public.team_members SET title = COALESCE(title, name) WHERE title IS NULL;
UPDATE public.team_members SET name = COALESCE(name, title) WHERE name IS NULL;
UPDATE public.team_members SET subtitle = COALESCE(subtitle, role) WHERE subtitle IS NULL;
UPDATE public.team_members SET role = COALESCE(role, subtitle) WHERE role IS NULL;

-- RLS & Policies
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on team_members" ON public.team_members;
CREATE POLICY "Allow public read on team_members" ON public.team_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on team_members" ON public.team_members;
CREATE POLICY "Allow anon all on team_members" ON public.team_members FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on team_members" ON public.team_members;
CREATE POLICY "Allow authenticated all on team_members" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 2. CLIENTS & BRANDS TABLE (public.clients_brands)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.clients_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.clients_brands ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE public.clients_brands ADD COLUMN IF NOT EXISTS category VARCHAR(150);
ALTER TABLE public.clients_brands ADD COLUMN IF NOT EXISTS img VARCHAR(500);
ALTER TABLE public.clients_brands ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.clients_brands ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

UPDATE public.clients_brands SET img = COALESCE(img, image_url) WHERE img IS NULL;
UPDATE public.clients_brands SET image_url = COALESCE(image_url, img) WHERE image_url IS NULL;

ALTER TABLE public.clients_brands ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on clients_brands" ON public.clients_brands;
CREATE POLICY "Allow public read on clients_brands" ON public.clients_brands FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on clients_brands" ON public.clients_brands;
CREATE POLICY "Allow anon all on clients_brands" ON public.clients_brands FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on clients_brands" ON public.clients_brands;
CREATE POLICY "Allow authenticated all on clients_brands" ON public.clients_brands FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 3. TRAINING INITIATIVES TABLE (public.training_initiatives)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.training_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.training_initiatives ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE public.training_initiatives ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.training_initiatives ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100);
ALTER TABLE public.training_initiatives ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.training_initiatives ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.training_initiatives ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on training_initiatives" ON public.training_initiatives;
CREATE POLICY "Allow public read on training_initiatives" ON public.training_initiatives FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on training_initiatives" ON public.training_initiatives;
CREATE POLICY "Allow anon all on training_initiatives" ON public.training_initiatives FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on training_initiatives" ON public.training_initiatives;
CREATE POLICY "Allow authenticated all on training_initiatives" ON public.training_initiatives FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 4. INTERNSHIP DOMAINS TABLE (public.internship_domains)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.internship_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.internship_domains ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE public.internship_domains ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.internship_domains ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE public.internship_domains ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.internship_domains ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.internship_domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on internship_domains" ON public.internship_domains;
CREATE POLICY "Allow public read on internship_domains" ON public.internship_domains FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on internship_domains" ON public.internship_domains;
CREATE POLICY "Allow anon all on internship_domains" ON public.internship_domains FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on internship_domains" ON public.internship_domains;
CREATE POLICY "Allow authenticated all on internship_domains" ON public.internship_domains FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 5. COLLABORATIONS TABLE (public.collaborations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.collaborations ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE public.collaborations ADD COLUMN IF NOT EXISTS subtitle VARCHAR(150);
ALTER TABLE public.collaborations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.collaborations ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.collaborations ADD COLUMN IF NOT EXISTS site_url VARCHAR(500);
ALTER TABLE public.collaborations ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on collaborations" ON public.collaborations;
CREATE POLICY "Allow public read on collaborations" ON public.collaborations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on collaborations" ON public.collaborations;
CREATE POLICY "Allow anon all on collaborations" ON public.collaborations FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on collaborations" ON public.collaborations;
CREATE POLICY "Allow authenticated all on collaborations" ON public.collaborations FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 6. WORKSHOPS TABLE (public.workshops)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workshops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on workshops" ON public.workshops;
CREATE POLICY "Allow public read on workshops" ON public.workshops FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on workshops" ON public.workshops;
CREATE POLICY "Allow anon all on workshops" ON public.workshops FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on workshops" ON public.workshops;
CREATE POLICY "Allow authenticated all on workshops" ON public.workshops FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 7. HERO SLIDES TABLE (public.hero_slides)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS subtitle VARCHAR(150);
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on hero_slides" ON public.hero_slides;
CREATE POLICY "Allow public read on hero_slides" ON public.hero_slides FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on hero_slides" ON public.hero_slides;
CREATE POLICY "Allow anon all on hero_slides" ON public.hero_slides FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on hero_slides" ON public.hero_slides;
CREATE POLICY "Allow authenticated all on hero_slides" ON public.hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 8. TESTIMONIALS TABLE (public.testimonials)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS reviewer_name VARCHAR(150);
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS designation VARCHAR(200);
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS review_text TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on testimonials" ON public.testimonials;
CREATE POLICY "Allow public read on testimonials" ON public.testimonials FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on testimonials" ON public.testimonials;
CREATE POLICY "Allow anon all on testimonials" ON public.testimonials FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on testimonials" ON public.testimonials;
CREATE POLICY "Allow authenticated all on testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 9. PRODUCTS TABLE (public.products)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subtitle VARCHAR(150);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS site_url VARCHAR(500);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS audience TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS roadmap JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS testimonial_text TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS testimonial_author VARCHAR(200);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stats_arr JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on products" ON public.products;
CREATE POLICY "Allow anon all on products" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on products" ON public.products;
CREATE POLICY "Allow authenticated all on products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 10. SERVICES TABLE (public.services)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sub_services JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on services" ON public.services;
CREATE POLICY "Allow public read on services" ON public.services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on services" ON public.services;
CREATE POLICY "Allow anon all on services" ON public.services FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on services" ON public.services;
CREATE POLICY "Allow authenticated all on services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 11. CASE STUDIES TABLE (public.case_studies)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS client VARCHAR(200);
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS category VARCHAR(150);
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS result TEXT;
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on case_studies" ON public.case_studies;
CREATE POLICY "Allow public read on case_studies" ON public.case_studies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on case_studies" ON public.case_studies;
CREATE POLICY "Allow anon all on case_studies" ON public.case_studies FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on case_studies" ON public.case_studies;
CREATE POLICY "Allow authenticated all on case_studies" ON public.case_studies FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 12. CONTACT INQUIRIES & LEADS TABLE (public.contact_inquiries)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS email VARCHAR(200);
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS course_or_service VARCHAR(200);
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'Website Contact Form';
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS extra_fields JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow public read on contact_inquiries" ON public.contact_inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow anon all on contact_inquiries" ON public.contact_inquiries FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow authenticated all on contact_inquiries" ON public.contact_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 13. ADMIN ACTIVITY LOGS TABLE (public.admin_activity_logs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_activity_logs ADD COLUMN IF NOT EXISTS action VARCHAR(200);
ALTER TABLE public.admin_activity_logs ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE public.admin_activity_logs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.admin_activity_logs ADD COLUMN IF NOT EXISTS actor VARCHAR(150) DEFAULT 'Super Admin';

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on admin_activity_logs" ON public.admin_activity_logs;
CREATE POLICY "Allow public read on admin_activity_logs" ON public.admin_activity_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on admin_activity_logs" ON public.admin_activity_logs;
CREATE POLICY "Allow anon all on admin_activity_logs" ON public.admin_activity_logs FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on admin_activity_logs" ON public.admin_activity_logs;
CREATE POLICY "Allow authenticated all on admin_activity_logs" ON public.admin_activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 14. ACADEMY APPLICATIONS TABLE (public.academy_applications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.academy_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS program_type VARCHAR(50);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS domain_or_track VARCHAR(150);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS duration VARCHAR(50);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS expected_joining_date DATE;
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS email VARCHAR(150);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS residential_address TEXT;
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS passport_photo_url TEXT;
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS institution_name VARCHAR(200);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS degree_and_dept VARCHAR(150);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS current_year VARCHAR(50);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS cgpa_or_percentage VARCHAR(50);
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE public.academy_applications ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE public.academy_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on academy_applications" ON public.academy_applications;
CREATE POLICY "Allow public read on academy_applications" ON public.academy_applications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on academy_applications" ON public.academy_applications;
CREATE POLICY "Allow anon all on academy_applications" ON public.academy_applications FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on academy_applications" ON public.academy_applications;
CREATE POLICY "Allow authenticated all on academy_applications" ON public.academy_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- Optional: Update CHECK constraint on academy_applications if present
DO $$
BEGIN
    ALTER TABLE public.academy_applications DROP CONSTRAINT IF EXISTS academy_applications_program_type_check;
    ALTER TABLE public.academy_applications ADD CONSTRAINT academy_applications_program_type_check 
        CHECK (program_type IN ('internship', 'training', 'workshops', 'project_development'));
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100),
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_name VARCHAR(255);
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS support_email VARCHAR(255);
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS admissions_email VARCHAR(255);
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS headquarters TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS enable_public_applications BOOLEAN DEFAULT true;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on site_settings" ON public.site_settings;
CREATE POLICY "Allow public read on site_settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon all on site_settings" ON public.site_settings;
CREATE POLICY "Allow anon all on site_settings" ON public.site_settings FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated all on site_settings" ON public.site_settings;
CREATE POLICY "Allow authenticated all on site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
