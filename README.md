# LNMIIT Placement Intelligence Portal

An independent, data-driven, production-grade placement analytics platform for **The LNM Institute of Information Technology (LNMIIT), Jaipur, India**.

The portal provides comprehensive, accurate, searchable, and automatically updated placement records covering **every graduating batch from the inception of LNMIIT (Class of 2007, Y03 batch) through the present (Class of 2025, Y21 batch)** — spanning **19 consecutive academic years**.

---

## 🏛️ Platform Highlights & Architecture

- **Historical Depth**: Complete verified archives from 2007 (1st batch) to 2025 (ongoing).
- **Zero-Synthetic-Data Invariant**: Statistics, salary distributions, and offers are never artificially estimated or treated as zero if missing; every metric preserves its official reporting tier.
- **Institutional UI/UX**: Clean dark/light theme, Bloomberg/Linear-inspired data density, interactive Recharts visualizations, and print-optimized executive summaries.
- **24-Hour Automated Ingestion**: Python pipeline with Beautiful Soup & PyPDF for scraping official LNMIIT portals, verifying mathematical invariants, detecting changes, and writing to Supabase.
- **Relational Integrity**: Normalized PostgreSQL schema with Supabase Row Level Security (RLS), unique constraints, and audit logging.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Recharts, Lucide React
- **Backend**: Next.js API Routes, Supabase Client & PostgreSQL Database
- **Automation**: Python 3.11 Scraper Pipeline, GitHub Actions Cron Workflow (`.github/workflows/placement-sync.yml`)
- **Testing**: Vitest (`tests/placement-analytics.test.ts`), Python Unittest (`scripts/scraper/test_scraper.py`)

---

## 📂 Project Structure

```
LNMIIT_Placement_Intelligence/
├── .github/
│   └── workflows/
│       └── placement-sync.yml       # 24-hour scheduled GitHub Actions cron job
├── app/
│   ├── api/
│   │   ├── batches/route.ts        # Query and create placement batches
│   │   ├── companies/route.ts      # Recruiter search & filter API
│   │   ├── sync/route.ts           # Automated sync trigger & audit checks
│   │   ├── export/route.ts         # High-speed CSV / JSON export engine
│   │   └── admin/audit-logs/       # Data pipeline change log endpoint
│   ├── globals.css                 # Custom theme variables & print styles
│   ├── layout.tsx                  # Root layout & institutional SEO tags
│   └── page.tsx                    # Main portal dashboard
├── components/
│   ├── Navbar.tsx                  # Header with search, theme toggle & sync status
│   ├── HeroSection.tsx             # Batch selector & institutional badge
│   ├── KPICards.tsx                # 7 core KPIs with source & date citations
│   ├── PlacementTrends.tsx         # Interactive multi-year Recharts visualizer
│   ├── YearWiseRecords.tsx         # Searchable, sortable historical table & comparator
│   ├── BranchAnalytics.tsx         # CSE, CCE, ECE, MME departmental breakdown
│   ├── CompanyDirectory.tsx        # Searchable recruiters with tier & role filters
│   ├── PackageAnalytics.tsx        # Verified salary bracket distribution charts
│   ├── InternshipAnalytics.tsx     # Monthly stipends, PPO conversion rates
│   ├── ReportsDownloads.tsx        # CSV downloads & official PDF registry
│   ├── AboutDataModal.tsx          # Data governance & methodology definitions
│   ├── AdminModal.tsx              # Admin controls, batch creator & sync runner
│   └── SearchModal.tsx             # Global quick search (Cmd+K)
├── lib/
│   ├── data/
│   │   └── lnmiitPlacementData.ts  # Full 2007–2025 verified LNMIIT records
│   ├── types/
│   │   └── placement.ts            # Normalized TypeScript data contracts
│   └── supabase.ts                 # Supabase client with offline store fallback
├── scripts/
│   └── scraper/
│       ├── requirements.txt        # Python scraper dependencies
│       ├── scraper.py              # Web scraping & PDF discovery engine
│       └── test_scraper.py         # Invariant & mathematical validation suite
├── supabase/
│   └── schema.sql                  # Normalized PostgreSQL DDL & RLS policies
└── tests/
    ├── placement-analytics.test.ts # Vitest suite for all 19 batches & invariants
    └── setup.ts                    # Jest-DOM environment configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **Python**: 3.9+ (for scraper engine)
- **Git**

### 2. Installation

Navigate to the project directory on your Desktop:
```bash
cd ~/Desktop/LNMIIT_Placement_Intelligence
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment keys (optional for local development, as the portal includes a verified offline fallback):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=lnmiit_placement_secret_cron_token_3175
```

### 4. Running the Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

### Run Frontend & Dataset Invariant Tests
```bash
npm test
```
Validates:
- All 19 historical batches (2007 through 2025).
- Mathematical invariants: `placed <= registered <= strength`, `offers >= placed`, `highest >= avg`.
- Departmental analytics for CSE, CCE, ECE, MME.
- Recruiter tier categorization and internship metrics.

### Run Python Scraper Tests
```bash
npm run test:scraper
```
Validates mathematical integrity checks and simulated change detection.

---

## 🗄️ Database Setup & Supabase Migrations

The portal is designed for **Supabase PostgreSQL**:

1. Open your Supabase project dashboard.
2. Go to the **SQL Editor**.
3. Copy and execute the contents of `supabase/schema.sql`.
4. Tables created:
   - `placement_batches`
   - `placement_statistics`
   - `branch_statistics`
   - `companies`
   - `company_recruitment`
   - `internship_statistics`
   - `placement_sources`
   - `data_update_logs`
   - `admin_users`
5. Row Level Security (RLS) is automatically enabled with public read-only access and authenticated admin mutations.

---

## 🤖 Automated Data Update Engine

### Scraping Architecture
1. **Target Endpoints**:
   - `https://placements.lnmiit.ac.in/`
   - `https://placements.lnmiit.ac.in/statistics`
   - `https://lnmiit.ac.in/about/annual-reports/`
2. **Mathematical Invariant Checking**:
   - `studentsPlaced <= registeredStudents <= totalBatchStrength`
   - `highestPackageLPA >= averagePackageLPA >= medianPackageLPA`
   - `totalJobOffers >= studentsPlaced`
   - `(placed / registered) * 100 ≈ placementPercentage`
3. **Change Detection**: Computes SHA-256 hashes of scraped HTML & PDFs. Only valid verified updates trigger write operations.
4. **Audit Logging**: Every execution logs to `data_update_logs`.

### Running the Scraper Manually
```bash
python3 scripts/scraper/scraper.py
```

### Scheduled GitHub Actions Cron
The workflow in `.github/workflows/placement-sync.yml` runs daily at **02:00 UTC (07:30 AM IST)**. Configure these repository secrets in GitHub:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `PORTAL_DEPLOYMENT_URL`

---

## 🚢 Production Deployment

### Deploy to Vercel
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete LNMIIT Placement Intelligence portal with 2007-2025 records"
   git remote add origin https://github.com/<your-username>/LNMIIT_Placement_Intelligence.git
   git push -u origin main
   ```
2. Import the project into [Vercel](https://vercel.com).
3. Set the environment variables from `.env.example`.
4. Build Command: `npm run build`
5. Output Directory: `.next`

---

## 📜 License
MIT License. Created for LNMIIT students, faculty, and recruiters.
