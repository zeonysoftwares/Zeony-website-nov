-- ==============================================================================
-- ZEONY ADMIN PANEL COMPLETE SUPABASE SQL SCHEMA & SEED DATA (CLEAN BUILD)
-- ==============================================================================
-- Copy and run this script in your Supabase Project Dashboard -> SQL Editor.
-- This clean version safely drops any incomplete previous tables and recreates
-- them with proper UNIQUE constraints so ON CONFLICT never fails!
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. CLIENTS & BRANDS TABLE (IMAGE 2: "TRUSTED BY INNOVATIVE BRANDS")
-- ==============================================================================
DROP TABLE IF EXISTS public.clients_brands CASCADE;

CREATE TABLE public.clients_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(150),
    img VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.clients_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on clients_brands" ON public.clients_brands FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on clients_brands" ON public.clients_brands FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on clients_brands" ON public.clients_brands FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.clients_brands (title, category, img, display_order)
VALUES 
    ('Wise Capital', 'Finance & Trading', '/img/wise-capital-logo.png', 1),
    ('Divya Driving School', 'Automotive & Education', '/img/divya-driving-logo.jpeg', 2),
    ('Joyson Enterprises', 'Industrial & Manufacturing', '/img/Joyson.jpeg', 3),
    ('PMC Tech', 'Higher Education & Engineering', '/img/pmc.jpg', 4),
    ('AUMM Cloths', 'Fashion & Retail', '/img/AUMM logo.png', 5),
    ('Happy Sunday Biriyani', 'Food & Beverage', '/img/happy sunday biriyani.png', 6),
    ('Ramamoorthy Nursery', 'Agriculture & Botany', '/img/ramamoorthy-nusery-logo.png', 7),
    ('DDRR Clinic', 'Healthcare & Medical', '/img/ddrr-logo.jpg', 8)
ON CONFLICT (title) DO UPDATE SET img = EXCLUDED.img, category = EXCLUDED.category;

-- ==============================================================================
-- 2. TRAINING & CERTIFICATIONS TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.training_initiatives CASCADE;

CREATE TABLE public.training_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(100),
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.training_initiatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on training_initiatives" ON public.training_initiatives FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on training_initiatives" ON public.training_initiatives FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on training_initiatives" ON public.training_initiatives FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.training_initiatives (title, description, icon_name, image_url, display_order)
VALUES 
    ('Industry-Oriented Training & Certification', 'Workshops, seminars, and skill development programs.', 'GraduationCap', '/img/culture_workshop.png', 1),
    ('Internship & Live Projects', 'Real-world exposure and hands-on experience for learners.', 'Briefcase', '/img/culture_internship.png', 2),
    ('Technology & Innovation Support', 'Access to tools, resources, and industry-driven solutions.', 'Lightbulb', '/img/custom_software_bento.png', 3),
    ('Placement Assistance', 'End-to-end placement support including resume building, mock interviews & job referrals.', 'Users', '/img/placement_assist.png', 4),
    ('Career Guidance & Employability', 'Resume building, soft skills, and career development programs.', 'TrendingUp', '/img/career_guide.png', 5),
    ('Research & Learning Initiatives', 'Collaborative research, projects, and knowledge sharing.', 'BookOpen', '/img/culture_collaboration.png', 6),
    ('Workshops, Webinars & Events', 'Technical sessions, webinars, and industry interaction.', 'Calendar', '/img/workshp-webinars.jpg', 7),
    ('Certifications & Skill Programs', 'Industry-recognized certifications and professional skill programs.', 'Award', '/img/web_dev_bento.png', 8),
    ('Industry-Academia Collaboration', 'Academic partnerships, institutional training, and collaborative initiatives.', 'Handshake', '/img/industry_academia.png', 9)
ON CONFLICT (title) DO UPDATE SET description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- ==============================================================================
-- 3. INTERNSHIPS & LIVE PROJECTS TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.internship_domains CASCADE;

CREATE TABLE public.internship_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100),
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.internship_domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on internship_domains" ON public.internship_domains FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on internship_domains" ON public.internship_domains FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on internship_domains" ON public.internship_domains FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.internship_domains (title, description, category, image_url, display_order)
VALUES 
    ('Web Development', 'Build scalable, responsive frontend and backend systems with Next.js, React, and Node.js.', 'Core Engineering', '/img/web-dev.jpg', 1),
    ('AIML And Generative AI', 'Work on cutting-edge LLMs, neural networks, and computer vision models.', 'Artificial Intelligence', '/img/custom_software_bento.png', 2),
    ('Java Full Stack', 'Master enterprise Java, Spring Boot, Microservices, and modern UI integration.', 'Enterprise Systems', '/img/web_dev_bento.png', 3),
    ('Data Analyst', 'Extract actionable insights using Python, SQL, PowerBI, and data visualization tools.', 'Data Science', '/img/app-dev.png', 4),
    ('Cyber security', 'Learn ethical hacking, network defense, vulnerability assessment, and security auditing.', 'Security', '/img/workshp-webinars.jpg', 5),
    ('Digital Marketing', 'Master SEO, SEM, social media growth hacking, and conversion rate optimization.', 'Growth & Marketing', '/img/UIUX.jpg', 6)
ON CONFLICT (title) DO UPDATE SET description = EXCLUDED.description, category = EXCLUDED.category;

-- ==============================================================================
-- 4. COLLABORATIONS TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.collaborations CASCADE;

CREATE TABLE public.collaborations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL UNIQUE,
    subtitle VARCHAR(150),
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on collaborations" ON public.collaborations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on collaborations" ON public.collaborations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on collaborations" ON public.collaborations FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.collaborations (title, subtitle, description, image_url, display_order)
VALUES 
    ('IIT Madras Research Park', 'Innovation Partner', 'Joint R&D in Generative AI and advanced cloud architectures.', '/img/culture_collaboration.png', 1),
    ('Anna University Academia Alliance', 'Institutional Training', 'Empowering 500+ engineering students with live software internships.', '/img/industry_academia.png', 2),
    ('Techstars Startup Incubator', 'Ecosystem Partner', 'Providing end-to-end technology mentorship for early-stage founders.', '/img/culture_workshop.png', 3),
    ('AWS Cloud EdTech Initiative', 'Cloud Infrastructure', 'Collaborative training on scalable cloud deployments and DevOps certification.', '/img/web_dev_bento.png', 4)
ON CONFLICT (title) DO UPDATE SET description = EXCLUDED.description, subtitle = EXCLUDED.subtitle;

-- ==============================================================================
-- 5. WORKSHOPS & WEBINARS TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.workshops CASCADE;

CREATE TABLE public.workshops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on workshops" ON public.workshops FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on workshops" ON public.workshops FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on workshops" ON public.workshops FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.workshops (title, description, image_url, display_order)
VALUES 
    ('AI Engineering', 'Build LLMs, RAG systems & Autonomous Agents.', '/img/culture_workshop.png', 1),
    ('Data Science', 'Predictive modeling, machine learning & analytics.', '/img/web_dev_bento.png', 2),
    ('Full Stack Software Developer', 'React, Next.js, Node.js & Cloud databases.', '/img/web-dev.jpg', 3),
    ('Cybersecurity', 'Ethical hacking, penetration testing & network defense.', '/img/workshp-webinars.jpg', 4),
    ('Cloud Fundamentals', 'AWS, Azure, Docker & Kubernetes architecture.', '/img/custom_software_bento.png', 5)
ON CONFLICT (title) DO UPDATE SET description = EXCLUDED.description;

-- ==============================================================================
-- 6. HERO SLIDES TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.hero_slides CASCADE;

CREATE TABLE public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL UNIQUE,
    subtitle VARCHAR(150),
    description TEXT,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on hero_slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on hero_slides" ON public.hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on hero_slides" ON public.hero_slides FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.hero_slides (title, subtitle, description, image_url, display_order)
VALUES 
    ('Engineering the Future of Digital Innovation', 'Next-Gen Software Solutions', 'We transform visionary concepts into high-performance web apps, mobile solutions, and enterprise software.', '/img/web-dev.jpg', 1),
    ('Empowering Next-Gen Tech Talent', 'Zeony Academy & Internships', 'Real-world live projects, industry certifications, and 100% placement assistance in advanced technologies.', '/img/culture_internship.png', 2),
    ('Custom AI & Cloud Transformation', 'Enterprise Architecture', 'Accelerating business growth with cutting-edge artificial intelligence and scalable cloud infrastructures.', '/img/custom_software_bento.png', 3)
ON CONFLICT (title) DO UPDATE SET description = EXCLUDED.description, subtitle = EXCLUDED.subtitle;

-- ==============================================================================
-- 7. TESTIMONIALS TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.testimonials CASCADE;

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_name VARCHAR(150) NOT NULL UNIQUE,
    designation VARCHAR(200),
    review_text TEXT NOT NULL,
    avatar_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on testimonials" ON public.testimonials FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.testimonials (reviewer_name, designation, review_text, avatar_url, display_order)
VALUES 
    ('Dr. K. Ramanathan', 'Dean of Engineering, PMC Tech', 'Zeony''s industry training and internship programs transformed our students'' technical capabilities. Over 40 students placed in top MNCs this semester alone!', '/img/pmc.jpg', 1),
    ('Sarah Jenkins', 'Director, Wise Capital', 'Their custom financial analytics dashboard streamlined our trading data pipelines. Exceptional UI/UX design and rock-solid backend architecture.', '/img/wise-capital-logo.png', 2),
    ('M. Anbarasu', 'Founder, DDRR Clinic', 'We hired Zeony for digital branding and custom appointment scheduling software. Our patient booking efficiency increased by 60% within two months.', '/img/ddrr-logo.jpg', 3)
ON CONFLICT (reviewer_name) DO UPDATE SET review_text = EXCLUDED.review_text, designation = EXCLUDED.designation;

-- ==============================================================================
-- 8. GLOBAL SITE SETTINGS TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.site_settings CASCADE;

CREATE TABLE public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on site_settings" ON public.site_settings FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.site_settings (key, value)
VALUES 
    ('site_name', 'Zeony Technologies & Academy'),
    ('support_email', 'info@zeonytechnologies.com'),
    ('admissions_email', 'admissions@zeonytechnologies.com'),
    ('contact_phone', '+91 98765 43210'),
    ('headquarters', 'IIT Madras Research Park / Chennai Tech Hub, Tamil Nadu, India'),
    ('enable_public_applications', 'true')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ==============================================================================
-- 9. PRODUCTS TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    subtitle VARCHAR(150),
    description TEXT,
    image_url VARCHAR(500),
    site_url VARCHAR(500),
    features JSONB DEFAULT '[]'::jsonb,
    audience TEXT,
    roadmap JSONB DEFAULT '[]'::jsonb,
    testimonial_text TEXT,
    testimonial_author VARCHAR(200),
    stats_arr JSONB DEFAULT '[]'::jsonb,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on products" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.products (title, subtitle, description, image_url, features, display_order)
VALUES 
    ('Zeony ERP Suite', 'Enterprise Software', 'Complete cloud-based enterprise resource planning for manufacturing and institutions.', '/img/custom_software_bento.png', '["Cloud Dashboard", "API Access", "Real-time Analytics", "24/7 Support"]'::jsonb, 1),
    ('DriveLogs Pro', 'SaaS Application', 'Automated scheduling, fleet tracking, and student management system for driving academies.', '/img/app-dev.png', '["Student Portal", "Instructor Scheduling", "Fleet Tracking", "Payment Gateway"]'::jsonb, 2),
    ('ClinicCare CRM', 'Healthcare IT', 'HIPAA-compliant patient appointment scheduling, billing, and electronic health records platform.', '/img/web_dev_bento.png', '["Patient Portal", "Billing", "EHR Platform", "24/7 Support"]'::jsonb, 3),
    ('EduTech AI Mentor', 'EdTech Platform', 'AI-powered personalized tutoring and automated grading engine for universities.', '/img/culture_collaboration.png', '["AI Grading", "Personalized Tutoring", "Real-time Analytics", "API Access"]'::jsonb, 4)
ON CONFLICT (title) DO UPDATE SET description = EXCLUDED.description;

-- ==============================================================================
-- 10. SERVICES TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.services CASCADE;

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    sub_services JSONB DEFAULT '[]'::jsonb,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on services" ON public.services FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.services (title, description, image_url, sub_services, display_order)
VALUES 
    ('Web Development', 'At Zeony Technologies, we construct modern, highly responsive, and robust websites that serve as the anchor of your digital presence.', '/img/web-dev.jpg', '[{"name": "Frontend Development", "detail": "Creating highly interactive, accessible, and performant user interfaces using React, Next.js, and Vue."}, {"name": "Backend Architecture", "detail": "Building robust APIs, microservices, and databases with Node.js, Python, PostgreSQL, and MongoDB."}, {"name": "E-Commerce Platforms", "detail": "Scalable online stores with secure payment gateways and intuitive inventory management systems."}, {"name": "CMS Solutions", "detail": "Customized content management systems like WordPress, Strapi, or Sanity for easy content updates."}]'::jsonb, 1)
ON CONFLICT (title) DO UPDATE SET description = EXCLUDED.description;

-- ==============================================================================
-- 11. CASE STUDIES / FEATURED WORK TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.case_studies CASCADE;

CREATE TABLE public.case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client VARCHAR(200) NOT NULL UNIQUE,
    category VARCHAR(150),
    image_url VARCHAR(500),
    result TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on case_studies" ON public.case_studies FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on case_studies" ON public.case_studies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on case_studies" ON public.case_studies FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.case_studies (client, category, image_url, result, display_order)
VALUES 
    ('Ramamoorthy Nursery', 'Web Design & E-Commerce', '/img/ramamoorthy-nusery-logo.png', '200% increase in online inquiries in 3 months.', 1),
    ('DDRR Clinic', 'Digital Transformation', '/img/ddrr-logo.jpg', 'Streamlined appointment booking, reducing admin time by 40%.', 2),
    ('Wise Capital', 'App Development', '/img/wise-capital-logo.png', 'Launched a secure fintech app with 10k+ active users.', 3)
ON CONFLICT (client) DO UPDATE SET result = EXCLUDED.result;

-- ==============================================================================
-- 12. TEAM MEMBERS TABLE
-- ==============================================================================
DROP TABLE IF EXISTS public.team_members CASCADE;

CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    subtitle VARCHAR(200),
    category VARCHAR(100),
    description TEXT,
    icon_name VARCHAR(20),
    image_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on team_members" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on team_members" ON public.team_members FOR ALL TO anon USING (true) WITH CHECK (true);

INSERT INTO public.team_members (title, subtitle, category, icon_name, image_url, description, features, display_order)
VALUES
    ('Sanjay Kumar K', 'Founder & Chief Design Officer (CDO)', 'Design & Product', 'SK', '/img/sanjay.jpg', 'Directs product strategy, visual systems, and human-centered UI/UX architecture across Zeony''s client engagements and SaaS products.', '["Product Strategy", "UI/UX Systems", "Brand Direction"]'::jsonb, 1),
    ('Vinod Kumar MM', 'Founder & Chief Technology Officer (CTO)', 'Engineering', 'VK', '/img/vinod.jpg', 'Directs software architecture, full-stack engineering delivery, cloud infrastructure, and applied AI workflows.', '["Next.js & Node.js", "Cloud Architecture", "Applied AI"]'::jsonb, 2),
    ('Frontend & WebGL Engineering', 'React, Next.js & 3D Web Specialists', 'Engineering', 'FE', '', 'Crafts high-speed, accessible web platforms, interactive Three.js experiences, and type-safe TypeScript interfaces.', '["Next.js 16", "TypeScript", "Three.js / GSAP"]'::jsonb, 3),
    ('Backend & API Systems Team', 'Distributed Services & Database Architects', 'Engineering', 'BE', '', 'Designs resilient REST/GraphQL APIs, PostgreSQL schemas, authentication flows, and multi-tenant SaaS backends.', '["Node.js & Python", "PostgreSQL", "API Security"]'::jsonb, 4),
    ('Product Design & Prototyping Studio', 'Interaction & Design System Specialists', 'Design & Product', 'UX', '', 'Translates complex business requirements into intuitive wireframes, interactive Figma prototypes, and WCAG-aligned UI libraries.', '["Figma", "Design Tokens", "Usability Testing"]'::jsonb, 5),
    ('Cloud, DevOps & Applied AI Unit', 'Infrastructure, RAG & Automation Engineers', 'Cloud & AI', 'CA', '', 'Manages containerized cloud deployments, CI/CD pipelines, security audits, and enterprise LLM/RAG integrations.', '["AWS & Docker", "CI/CD Pipelines", "Enterprise RAG"]'::jsonb, 6),
    ('Academy & Internship Mentors', 'Senior Engineering Coaches & Reviewers', 'Academy & Mentors', 'AM', '', 'Guides interns and workshop cohorts through live client repositories, pull request reviews, and career readiness.', '["Code Reviews", "Live Sprints", "Placement Prep"]'::jsonb, 7),
    ('Quality Assurance & SLA Support', 'Testing, Performance & Reliability Team', 'Cloud & AI', 'QA', '', 'Ensures every release passes automated verification, responsive device testing, and ongoing production monitoring.', '["E2E Testing", "Web Vitals", "24/7 SLA Support"]'::jsonb, 8)
ON CONFLICT (title) DO UPDATE SET subtitle = EXCLUDED.subtitle, category = EXCLUDED.category, description = EXCLUDED.description, features = EXCLUDED.features;


-- ==============================================================================
-- 13. CONTACT INQUIRIES & LEADS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    course_or_service VARCHAR(200),
    message TEXT,
    source VARCHAR(100) DEFAULT 'Website Contact Form',
    extra_fields JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on contact_inquiries" ON public.contact_inquiries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on contact_inquiries" ON public.contact_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on contact_inquiries" ON public.contact_inquiries FOR ALL TO anon USING (true) WITH CHECK (true);

-- ==============================================================================
-- 14. ADMIN ACTIVITY AUDIT LOGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    actor VARCHAR(150) DEFAULT 'Super Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on admin_activity_logs" ON public.admin_activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on admin_activity_logs" ON public.admin_activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on admin_activity_logs" ON public.admin_activity_logs FOR ALL TO anon USING (true) WITH CHECK (true);
