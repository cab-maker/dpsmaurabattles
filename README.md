# ⚡ Aura Battles — The Official School Arena

A premium, production-ready competition platform where students submit battles, view ongoing matches, inspect campus arena locations, and follow the live leaderboard of champions.

---

## 🌟 Features & Architecture

- **Aura & Rainbow Aesthetic**: Deep charcoal theme with tasteful rainbow gradient treatments on the word **Aura**, glassmorphism cards, glowing borders, and the official Chief Aura Officer mascot.
- **Battle Categories**:
  - ⚡ **Aura Battle**: Charisma, swagger, confidence, and social presence.
  - 🔥 **Mog Battle**: Outfit drip, dynamic entrance walk, and spotlight dominance.
- **Permanent Admin Announcements**: Stored in Supabase PostgreSQL, remaining persistent across reboots, refreshes, and deployments.
- **Admin Command Center (`/admin`)**:
  - Secure server-side HMAC session authentication & rate limiting.
  - Battle review, approval, rejection, and location assignment.
  - Winner declaration with **automatic leaderboard win tracking** and **duplicate-win prevention**.
  - Campus Location Manager (sanctioned locations only).
  - Leaderboard editor, manual win adjustments, and instant stats reset.
  - Homepage announcement manager with priority badges and top-pinning.
- **Respectful & Fun**: Opt-in, school-spirit-oriented challenges with zero tolerance for bullying or harassment.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 with custom rainbow aura gradients & glassmorphism
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Icons & Effects**: Lucide React, Canvas Confetti
- **Deployment**: Vercel & GitHub

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm or pnpm

### 2. Environment Configuration
Create a `.env.local` file from the provided `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
ADMIN_PASSWORD=auraadmin2026!
SESSION_SECRET=<random-32-character-secret>
```

### 3. Database Migration
The database schema is located at `supabase/migrations/001_initial_schema.sql`.

If creating a new Supabase database:
1. Open your **Supabase Dashboard** > **SQL Editor**.
2. Paste the contents of `supabase/migrations/001_initial_schema.sql` and run it.
3. This creates:
   - `battles`
   - `locations`
   - `leaderboard`
   - `announcements`
   - `battle_results`
   along with row-level security policies and default campus locations.

### 4. Running Locally
```bash
# Install dependencies
npm install

# Build production bundle
npm run build

# Start production server
npm run start
# Or start in development mode:
# npm run dev
```

Visit `http://localhost:3000` to view the Aura Arena.
Visit `http://localhost:3000/admin` to sign in to the Admin Dashboard (default password: `auraadmin2026!`).

---

## 🌐 Deploying to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Aura Battles platform"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your GitHub repository.
   - Framework preset will automatically detect **Next.js**.

3. **Configure Environment Variables in Vercel**:
   Add the following variables under **Project Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD` (e.g. `your_custom_admin_password`)
   - `SESSION_SECRET` (generate a random 32-character hex string)

4. **Deploy**:
   - Click **Deploy**. Vercel will build and deploy the production site with full edge optimization!

---

## 🔐 Security & RLS Guidelines

- Public users can only read active locations, announcements, leaderboard rankings, and approved battles (`Upcoming`, `Live`, `Completed`).
- Public submissions can only be inserted with status `'Pending'`.
- Winner declarations and leaderboard win adjustments are strictly authenticated via server-side session checks and validated against race conditions.

---

## 📷 Mascot Image Replacement

The mascot photo is located at `public/monkey.png`. To replace the official mascot with another image, simply replace this file or update the `src` attribute in `src/app/page.tsx`.
