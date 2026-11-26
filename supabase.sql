-- ==============================================================================
-- SUPABASE SCHEMA FOR ZEONY ACADEMY ADMISSIONS (Training, Internships & Workshops)
-- ==============================================================================
-- Run this SQL in your Supabase SQL Editor to create the table, storage bucket,
-- indexes, and Row Level Security (RLS) policies for storing application forms.
-- ==============================================================================

-- 1. Enable UUID Extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the Applications Table
CREATE TABLE IF NOT EXISTS public.academy_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Program Preferences
    program_type VARCHAR(50) NOT NULL CHECK (program_type IN ('internship', 'training', 'workshops')),
    domain_or_track VARCHAR(150) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    expected_joining_date DATE NOT NULL,
    
    -- Personal Information
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    residential_address TEXT NOT NULL,
    passport_photo_url TEXT, -- URL from Supabase Storage or external storage
    
    -- Academic Details
    institution_name VARCHAR(200) NOT NULL,
    degree_and_dept VARCHAR(150) NOT NULL,
    current_year VARCHAR(50) NOT NULL,
    cgpa_or_percentage VARCHAR(50) NOT NULL,
    
    -- Application Metadata & Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'shortlisted', 'accepted', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Indexes for High-Performance Queries in Admin Panel
CREATE INDEX IF NOT EXISTS idx_applications_program_type ON public.academy_applications(program_type);
CREATE INDEX IF NOT EXISTS idx_applications_domain ON public.academy_applications(domain_or_track);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.academy_applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.academy_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.academy_applications(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.academy_applications ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Allow anyone (public/anon visitors on the website) to submit new applications
CREATE POLICY "Allow public application submission" 
ON public.academy_applications 
FOR INSERT 
TO public, anon 
WITH CHECK (true);

-- Allow authenticated admin users to view all submitted applications
CREATE POLICY "Allow authenticated admins to read all applications" 
ON public.academy_applications 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated admin users to update applications (e.g. change status, add notes)
CREATE POLICY "Allow authenticated admins to update applications" 
ON public.academy_applications 
FOR UPDATE 
TO authenticated 
USING (true);

-- Allow authenticated admin users to delete applications
CREATE POLICY "Allow authenticated admins to delete applications" 
ON public.academy_applications 
FOR DELETE 
TO authenticated 
USING (true);

-- 6. Setup Supabase Storage Bucket for Passport Photos
-- Note: You can also create this bucket via the Supabase Storage UI Dashboard by naming it 'storage_images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('storage_images', 'storage_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow public to upload files into 'storage_images' bucket
CREATE POLICY "Allow public photo uploads" 
ON storage.objects 
FOR INSERT 
TO public, anon 
WITH CHECK (bucket_id = 'storage_images');

-- Storage Policy: Allow public/admins to view photos from 'storage_images' bucket
CREATE POLICY "Allow photo viewing" 
ON storage.objects 
FOR SELECT 
TO public, anon, authenticated 
USING (bucket_id = 'storage_images');

-- ==============================================================================
-- SAMPLE INSERT QUERY (For testing in Supabase SQL Editor)
-- ==============================================================================
/*
INSERT INTO public.academy_applications (
    program_type, 
    domain_or_track, 
    duration, 
    expected_joining_date, 
    full_name, 
    email, 
    phone, 
    dob, 
    residential_address, 
    institution_name, 
    degree_and_dept, 
    current_year, 
    cgpa_or_percentage,
    passport_photo_url
) VALUES (
    'internship',
    'AIML And Generative AI',
    '3 months',
    '2026-08-01',
    'John Doe',
    'john.doe@example.com',
    '+91 9876543210',
    '2004-05-15',
    '123 Tech Park Road, Bangalore, Karnataka, 560001',
    'IIT Madras',
    'B.Tech Computer Science',
    '3rd Year',
    '8.9 CGPA',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/passport_photos/sample.jpg'
);
*/
