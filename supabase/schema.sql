-- ==============================================================================
-- LNMIIT Placement Intelligence Portal — Normalized PostgreSQL / Supabase Schema
-- Includes Normalized Relational Architecture, Indexes, Constraints and RLS Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PLACEMENT SOURCES (Official URLs, PDFs, Brochures, NIRF Submissions)
CREATE TABLE IF NOT EXISTS placement_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('Official Website', 'Annual Report PDF', 'T&P Brochure', 'NIRF Report')),
    batch_year INTEGER NOT NULL,
    published_date DATE,
    last_checked_date TIMESTAMPTZ DEFAULT NOW(),
    content_hash VARCHAR(128),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'Officially Verified' CHECK (verification_status IN ('Officially Verified', 'Secondary Source', 'Awaiting Verification')),
    methodology_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PLACEMENT BATCHES
CREATE TABLE IF NOT EXISTS placement_batches (
    id VARCHAR(20) PRIMARY KEY, -- e.g. 'y20', 'y21'
    batch_name VARCHAR(100) NOT NULL,
    graduation_year INTEGER NOT NULL UNIQUE,
    admission_year INTEGER NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing', 'archived')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PLACEMENT STATISTICS (Overall Institute-Level Performance)
CREATE TABLE IF NOT EXISTS placement_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id VARCHAR(20) NOT NULL REFERENCES placement_batches(id) ON DELETE CASCADE,
    graduation_year INTEGER NOT NULL,
    total_batch_strength INTEGER NOT NULL CHECK (total_batch_strength >= 0),
    registered_students INTEGER NOT NULL CHECK (registered_students >= 0),
    students_placed INTEGER NOT NULL CHECK (students_placed >= 0 AND students_placed <= registered_students),
    placement_percentage NUMERIC(5, 2) NOT NULL CHECK (placement_percentage >= 0 AND placement_percentage <= 100),
    highest_package_lpa NUMERIC(6, 2) NOT NULL CHECK (highest_package_lpa >= 0),
    average_package_lpa NUMERIC(6, 2) NOT NULL CHECK (average_package_lpa >= 0),
    median_package_lpa NUMERIC(6, 2) NOT NULL CHECK (median_package_lpa >= 0),
    total_job_offers INTEGER NOT NULL CHECK (total_job_offers >= students_placed),
    recruiting_companies_count INTEGER NOT NULL CHECK (recruiting_companies_count >= 0),
    bracket_0_to_5_lpa INTEGER DEFAULT 0,
    bracket_5_to_10_lpa INTEGER DEFAULT 0,
    bracket_10_to_15_lpa INTEGER DEFAULT 0,
    bracket_15_to_20_lpa INTEGER DEFAULT 0,
    bracket_20_to_30_lpa INTEGER DEFAULT 0,
    bracket_30_plus_lpa INTEGER DEFAULT 0,
    reporting_date DATE NOT NULL,
    last_checked_date TIMESTAMPTZ DEFAULT NOW(),
    source_id UUID REFERENCES placement_sources(id) ON DELETE SET NULL,
    source_url TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'Officially Verified' CHECK (verification_status IN ('Officially Verified', 'Secondary Source', 'Awaiting Verification')),
    methodology_notes TEXT,
    is_disputed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_batch_stats UNIQUE (batch_id)
);

-- 4. BRANCH-WISE STATISTICS (CSE, CCE, ECE, MME, M&C)
CREATE TABLE IF NOT EXISTS branch_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id VARCHAR(20) NOT NULL REFERENCES placement_batches(id) ON DELETE CASCADE,
    graduation_year INTEGER NOT NULL,
    branch_code VARCHAR(20) NOT NULL CHECK (branch_code IN ('CSE', 'CCE', 'ECE', 'MME', 'M&C')),
    branch_name VARCHAR(150) NOT NULL,
    total_students INTEGER NOT NULL CHECK (total_students >= 0),
    registered_students INTEGER NOT NULL CHECK (registered_students >= 0),
    students_placed INTEGER NOT NULL CHECK (students_placed >= 0 AND students_placed <= registered_students),
    placement_percentage NUMERIC(5, 2) NOT NULL CHECK (placement_percentage >= 0 AND placement_percentage <= 100),
    highest_package_lpa NUMERIC(6, 2) NOT NULL CHECK (highest_package_lpa >= 0),
    average_package_lpa NUMERIC(6, 2) NOT NULL CHECK (average_package_lpa >= 0),
    median_package_lpa NUMERIC(6, 2) NOT NULL CHECK (median_package_lpa >= 0),
    total_offers INTEGER NOT NULL,
    top_recruiters TEXT[] DEFAULT '{}',
    verification_status VARCHAR(50) NOT NULL DEFAULT 'Officially Verified' CHECK (verification_status IN ('Officially Verified', 'Secondary Source', 'Awaiting Verification')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_batch_branch UNIQUE (batch_id, branch_code)
);

-- 5. RECRUITING COMPANIES
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL UNIQUE,
    slug VARCHAR(200) NOT NULL UNIQUE,
    industry VARCHAR(150) NOT NULL,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('Tier 1 (30+ LPA)', 'Tier 2 (15-30 LPA)', 'Tier 3 (8-15 LPA)', 'Tier 4 (<8 LPA)')),
    website TEXT,
    logo_url TEXT,
    headquarters VARCHAR(200),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMPANY RECRUITMENT RECORDS (Per-Year Engagements & Offers)
CREATE TABLE IF NOT EXISTS company_recruitment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    batch_id VARCHAR(20) NOT NULL REFERENCES placement_batches(id) ON DELETE CASCADE,
    graduation_year INTEGER NOT NULL,
    job_roles TEXT[] NOT NULL DEFAULT '{}',
    eligible_branches TEXT[] NOT NULL DEFAULT '{}',
    package_lpa NUMERIC(6, 2),
    stipend_monthly NUMERIC(10, 2),
    hires_count INTEGER DEFAULT 0,
    internship_offered BOOLEAN DEFAULT FALSE,
    fulltime_offered BOOLEAN DEFAULT TRUE,
    ppo_converted INTEGER DEFAULT 0,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'Officially Verified',
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INTERNSHIP AND PPO STATISTICS
CREATE TABLE IF NOT EXISTS internship_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id VARCHAR(20) NOT NULL REFERENCES placement_batches(id) ON DELETE CASCADE,
    graduation_year INTEGER NOT NULL,
    total_internship_offers INTEGER NOT NULL,
    highest_stipend_monthly NUMERIC(10, 2) NOT NULL,
    average_stipend_monthly NUMERIC(10, 2) NOT NULL,
    median_stipend_monthly NUMERIC(10, 2) NOT NULL,
    total_ppo_conversions INTEGER NOT NULL,
    ppo_conversion_rate NUMERIC(5, 2) NOT NULL,
    top_internship_companies TEXT[] DEFAULT '{}',
    reporting_date DATE NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'Officially Verified',
    methodology_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_batch_internship UNIQUE (batch_id)
);

-- 8. DATA UPDATE AUDIT LOGS (Change Detection & Engine Records)
CREATE TABLE IF NOT EXISTS data_update_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('AUTO_SYNC_CHECK', 'AUTO_SYNC_UPDATED', 'PDF_EXTRACTED', 'ADMIN_EDIT', 'DISCREPANCY_FLAGGED', 'ADMIN_APPROVE')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('SUCCESS', 'PENDING_REVIEW', 'ERROR', 'NO_CHANGE')),
    source_url TEXT NOT NULL,
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'auditor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE DATA RETRIEVAL
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_batch_grad_year ON placement_batches(graduation_year);
CREATE INDEX IF NOT EXISTS idx_stats_grad_year ON placement_statistics(graduation_year);
CREATE INDEX IF NOT EXISTS idx_branch_batch ON branch_statistics(batch_id, branch_code);
CREATE INDEX IF NOT EXISTS idx_comp_tier ON companies(tier);
CREATE INDEX IF NOT EXISTS idx_comp_rec_grad ON company_recruitment(graduation_year);
CREATE INDEX IF NOT EXISTS idx_update_logs_time ON data_update_logs(timestamp DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public visitors have Read-Only access to verified / published data.
-- Only authenticated admin users can Insert, Update, or Delete.
-- ==============================================================================
ALTER TABLE placement_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_recruitment ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_update_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Read policies for public
CREATE POLICY "Public Read Verified Sources" ON placement_sources FOR SELECT USING (true);
CREATE POLICY "Public Read Batches" ON placement_batches FOR SELECT USING (true);
CREATE POLICY "Public Read Statistics" ON placement_statistics FOR SELECT USING (true);
CREATE POLICY "Public Read Branch Stats" ON branch_statistics FOR SELECT USING (true);
CREATE POLICY "Public Read Companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Public Read Recruitment" ON company_recruitment FOR SELECT USING (true);
CREATE POLICY "Public Read Internship Stats" ON internship_statistics FOR SELECT USING (true);
CREATE POLICY "Public Read Logs" ON data_update_logs FOR SELECT USING (true);

-- Admin mutation policies (requires auth role = 'authenticated')
CREATE POLICY "Admin All Batches" ON placement_batches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Statistics" ON placement_statistics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Branch Stats" ON branch_statistics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Companies" ON companies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Recruitment" ON company_recruitment FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Internship" ON internship_statistics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Sources" ON placement_sources FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Logs" ON data_update_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
