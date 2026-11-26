-- Run this SQL in your Supabase SQL Editor to restore all the Services, Products, and FAQs

-- 1. Restore Services
INSERT INTO public.services (title, description, image_url, sub_services, display_order) VALUES
('Web Development', 'At Zeony Technologies, we construct modern, highly responsive, and robust websites that serve as the anchor of your digital presence.', '/img/web-dev.jpg', '[
    {"name": "Frontend Development", "detail": "Creating highly interactive, accessible, and performant user interfaces using React, Next.js, and Vue."},
    {"name": "Backend Architecture", "detail": "Building robust APIs, microservices, and databases with Node.js, Python, PostgreSQL, and MongoDB."},
    {"name": "E-Commerce Platforms", "detail": "Scalable online stores with secure payment gateways and intuitive inventory management systems."},
    {"name": "CMS Solutions", "detail": "Customized content management systems like WordPress, Strapi, or Sanity for easy content updates."}
]'::jsonb, 1),
('App Development', 'We build high-quality, scalable mobile applications for Android and iOS that deliver seamless user experiences and drive engagement.', '/img/app-dev.png', '[
    {"name": "iOS App Development", "detail": "Native Apple applications built with Swift and SwiftUI for optimal performance on iPhones and iPads."},
    {"name": "Android App Development", "detail": "High-performance native Android apps built with Kotlin to reach the massive global Android user base."},
    {"name": "Cross-Platform Apps", "detail": "Efficient unified codebases using Flutter or React Native to deploy apps on both iOS and Android rapidly."},
    {"name": "App Maintenance & Support", "detail": "Continuous monitoring, bug fixing, and feature updates to keep your app running flawlessly post-launch."}
]'::jsonb, 2),
('Custom Application', 'We engineer bespoke software solutions meticulously designed to address your unique business workflows and operational challenges.', '/img/custom_software_bento.png', '[
    {"name": "Enterprise Software", "detail": "Complex, secure, and scalable software solutions tailored to streamline large-scale corporate operations."},
    {"name": "SaaS Development", "detail": "Architecture and development of Cloud-based Software as a Service products with multi-tenant capabilities."},
    {"name": "Legacy System Upgrades", "detail": "Modernizing outdated software infrastructure to improve performance, security, and cloud compatibility."},
    {"name": "API Integration", "detail": "Seamlessly connecting disparate systems, third-party services, and internal tools to automate workflows."}
]'::jsonb, 3),
('Digital Marketing', 'Implement data-driven marketing strategies to increase your online visibility, drive targeted traffic, and significantly boost conversions.', '/img/app-dev.png', '[
    {"name": "Search Engine Optimization", "detail": "Improving website rankings organically on Google to drive sustainable, high-intent traffic."},
    {"name": "Social Media Marketing", "detail": "Strategic content creation and community management across platforms like LinkedIn, Instagram, and Facebook."},
    {"name": "PPC Advertising", "detail": "Highly targeted ad campaigns on Google Ads and social media for immediate lead generation and sales."},
    {"name": "Content Strategy", "detail": "Engaging, SEO-optimized content that tells your brand story and establishes industry authority."}
]'::jsonb, 4),
('Graphic Designing', 'Deliver creative and visually stunning design solutions that effectively communicate your brand identity and captivate your audience.', '/img/designing.webp', '[
    {"name": "Brand Identity & Logos", "detail": "Crafting memorable logos, color palettes, and brand guidelines that distinguish you from competitors."},
    {"name": "Marketing Collateral", "detail": "Professionally designed brochures, flyers, business cards, and presentations for your sales teams."},
    {"name": "Social Media Graphics", "detail": "Eye-catching and platform-optimized visual assets designed to boost engagement and shareability."},
    {"name": "Packaging Design", "detail": "Innovative and attractive product packaging that stands out on the shelves and appeals to consumers."}
]'::jsonb, 5),
('Internship and Training', 'We offer comprehensive training programs and internships designed to bridge the gap between academic learning and practical industry requirements.', '/img/culture_internship.png', '[
    {"name": "Student Internships", "detail": "Hands-on project experience in software development and marketing for college students and recent graduates."},
    {"name": "Corporate Training", "detail": "Specialized upskilling programs tailored for enterprise teams in emerging technologies and agile methodologies."},
    {"name": "Skill Workshops", "detail": "Intensive, short-term bootcamps focusing on specific frameworks, programming languages, or design tools."},
    {"name": "Career Mentorship", "detail": "Guidance on resume building, interview preparation, and career planning by seasoned industry professionals."}
]'::jsonb, 6),
('Static Website', 'Get fast, secure, and beautiful static websites that are perfect for portfolios, landing pages, and small business profiles.', '/img/web_dev_bento.png', '[
    {"name": "Business Profiles", "detail": "Professional multi-page static sites to establish a credible online presence for your local business."},
    {"name": "Landing Pages", "detail": "Highly optimized, single-page designs focused on maximizing conversions for specific marketing campaigns."},
    {"name": "Personal Portfolios", "detail": "Elegant showcases for freelancers, artists, and professionals to display their past work and achievements."},
    {"name": "Event Websites", "detail": "Temporary, highly informative websites for conferences, webinars, and special events with fast loading times."}
]'::jsonb, 7),
('UI/UX Design', 'User-centric design solutions that provide intuitive, accessible, and delightful experiences for your customers across all digital touchpoints.', '/img/UIUX.jpg', '[
    {"name": "User Research & Personas", "detail": "In-depth analysis of your target audience to understand their behaviors, needs, and pain points."},
    {"name": "Wireframing & Prototyping", "detail": "Creating structural blueprints and interactive models to visualize the user journey before development."},
    {"name": "UI Visual Design", "detail": "Crafting aesthetically pleasing interfaces with modern typography, colors, and engaging micro-interactions."},
    {"name": "Usability Testing", "detail": "Evaluating designs with real users to identify friction points and optimize the overall user experience."}
]'::jsonb, 8),
('Technology Consultancy and Solution', 'Leverage our expert technology consulting to make informed, strategic decisions on architecture, infrastructure, and your tech stack.', '/img/workshp-webinars.jpg', '[
    {"name": "IT Strategy & Roadmapping", "detail": "Aligning your technology investments with long-term business goals for maximum return on investment."},
    {"name": "Cloud Architecture", "detail": "Designing scalable, secure, and cost-effective cloud infrastructures on AWS, Azure, or Google Cloud."},
    {"name": "Digital Transformation", "detail": "Guiding traditional businesses through the process of integrating digital technology into all operations."},
    {"name": "Tech Stack Audits", "detail": "Comprehensive review of your existing software architecture to identify bottlenecks and security vulnerabilities."}
]'::jsonb, 9)
ON CONFLICT (title) DO UPDATE SET 
    description = EXCLUDED.description,
    sub_services = EXCLUDED.sub_services;


-- 2. Restore Products
INSERT INTO public.products (title, subtitle, description, image_url, display_order) VALUES
(
  'Netfra', 
  'Ticketing tool for IT Infra', 
  'A comprehensive ticketing system designed specifically for managing, tracking, and resolving IT infrastructure issues and service requests efficiently across your organization.', 
  '/img/netfra.png', 
  2
),
(
  'Ramamoorthy Nursery', 
  'Nursery Management Website', 
  'A dedicated web platform tailored for nursery management, designed to showcase plants, saplings, and gardening services with a beautiful and user-friendly interface.', 
  '/img/ramamoorthy.png', 
  3
),
(
  'FWAPMS', 
  'Faculty Work Progression and Tracking', 
  'An advanced institutional management system for tracking faculty workload, academic progression, research publications, and daily educational activities seamlessly.', 
  '/img/fwapms.png', 
  4
),
(
  'Campus Test', 
  'Students online test portal', 
  'A robust and secure online examination portal for students, featuring timed assessments, automated grading, anti-cheat mechanisms, and detailed performance analytics.', 
  '/img/campustest.png', 
  5
),
(
  'Drive Logs', 
  'Vehicle expense and performance tracking', 
  'An industry and institutional vehicle management system that efficiently tracks travel logs, maintenance expenses, fuel efficiency, and overall fleet performance.', 
  '/img/drive-logs.png', 
  6
),
(
  'M-Tracker', 
  'Marketing persons tracking', 
  'A reliable field tracking tool for marketing personnel to log client visits, manage leads in real-time, track geographic locations, and improve overall field sales productivity.', 
  '/img/m-tracker.png', 
  7
)
ON CONFLICT (title) DO NOTHING;


-- 3. Restore 20+ IT Services FAQs
INSERT INTO public.faqs (question, answer, display_order) VALUES
('What is Zeony Technologies?', 'Zeony Technologies is a forward-thinking digital agency specializing in software development, web & app solutions, and IT consulting to help businesses scale.', 1),
('What exact services do you offer?', 'We provide end-to-end digital solutions including Web Development, App Development, Custom Software, Tech Consulting, Digital Marketing, and UI/UX Design.', 2),
('How much does a custom website cost?', 'The cost depends entirely on the scope, features, and complexity of the project. We offer customized quotes after a free initial consultation to understand your requirements.', 3),
('How long does it take to build a mobile app?', 'A standard mobile app typically takes between 3 to 6 months from initial design to App Store launch, depending on the complexity of the features.', 4),
('Do you offer ongoing maintenance and support?', 'Yes! We offer flexible maintenance packages to ensure your software stays updated, secure, and running smoothly long after the initial launch.', 5),
('Can you redesign an existing website?', 'Absolutely. We specialize in modernizing legacy websites, improving their UI/UX, boosting loading speeds, and ensuring they are fully responsive on mobile devices.', 6),
('Which technologies do you specialize in?', 'Our stack includes modern frameworks like React, Next.js, and Vue for the frontend, and Node.js, Python, PostgreSQL, and Supabase for the backend.', 7),
('Will my website be mobile-friendly?', 'Yes. Every website and web app we build is designed with a "mobile-first" approach to ensure perfect responsiveness across all devices.', 8),
('What is your software development process?', 'We follow an agile methodology: Discovery & Planning, UI/UX Design, Development in sprints, QA Testing, Deployment, and finally, Post-launch support.', 9),
('How do you ensure the security of the software?', 'We implement industry best practices including secure authentication, data encryption, regular vulnerability audits, and safe deployment pipelines.', 10),
('Can you help with digital marketing and SEO?', 'Yes! We offer comprehensive SEO, SEM, and social media marketing strategies to help your digital products reach the right audience and drive conversions.', 11),
('What platforms do you build e-commerce sites on?', 'We build scalable e-commerce solutions using custom Next.js architectures as well as robust platforms like Shopify, WooCommerce, and Magento.', 12),
('How do your internships work?', 'Our internships are intensive, hands-on programs where you work on live industry projects under the mentorship of senior developers to build a strong portfolio.', 13),
('Are your workshops suitable for beginners?', 'We offer a range of workshops ranging from beginner-friendly introductory courses to advanced deep-dives for experienced professionals.', 14),
('Do you provide UI/UX design services independently?', 'Yes, if you already have a development team, we can step in purely to handle user research, wireframing, and high-fidelity interface design.', 15),
('Can you integrate third-party APIs into our system?', 'Definitely. We have extensive experience integrating payment gateways, CRMs, social media platforms, and other third-party APIs into custom software.', 16),
('Who owns the source code after the project is completed?', 'Once the project is completed and fully paid for, you retain 100% ownership of the intellectual property and the source code.', 17),
('Do you work with startups or established enterprises?', 'Both! We help startups build MVPs quickly to gain traction, and we help enterprises modernize their legacy systems and scale their operations.', 18),
('How do we communicate during a project?', 'We provide a dedicated project manager and use tools like Slack, Jira, and weekly Google Meet check-ins to ensure total transparency.', 19),
('Do you provide cloud migration services?', 'Yes, we help businesses seamlessly migrate their existing infrastructure to AWS, Google Cloud, or Azure for better security and scalability.', 20),
('What happens if I want to add features later?', 'We build all our software with scalability in mind. You can easily request new features post-launch, and we will scope and integrate them smoothly.', 21)
ON CONFLICT DO NOTHING;
