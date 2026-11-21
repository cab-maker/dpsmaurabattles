-- Aura Battles Database Migration & Schema
-- Run this in your Supabase SQL Editor if setting up a new project

-- 1. Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Leaderboard Table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL UNIQUE,
    total_wins INTEGER NOT NULL DEFAULT 0 CHECK (total_wins >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Battles Table
CREATE TABLE IF NOT EXISTS public.battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_one TEXT NOT NULL,
    person_two TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Mog Battle', 'Aura Battle')),
    description TEXT,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Upcoming', 'Live', 'Completed', 'Rejected')),
    winner_id UUID REFERENCES public.leaderboard(id) ON DELETE SET NULL,
    winner_name TEXT,
    scheduled_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Permanent Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Urgent')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Battle Results / Win Audit Table
CREATE TABLE IF NOT EXISTS public.battle_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    battle_id UUID NOT NULL REFERENCES public.battles(id) ON DELETE CASCADE,
    winner_id UUID NOT NULL REFERENCES public.leaderboard(id) ON DELETE CASCADE,
    winner_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_battle_result UNIQUE (battle_id)
);

-- 6. Initial Seed Locations
INSERT INTO public.locations (name, description, is_active)
VALUES
    ('School Ground', 'The main athletic sports ground and field', true),
    ('Basketball Court', 'Open court near gymnasium block', true),
    ('Main Assembly Area', 'Central courtyard for school morning assemblies', true),
    ('Canteen Area', 'High-traffic cafeteria quad', true),
    ('Auditorium', 'Main stage hall with seating', true)
ON CONFLICT (name) DO NOTHING;

-- 7. Seed Initial Permanent Announcement
INSERT INTO public.announcements (title, message, priority, is_pinned)
SELECT 'AURA BATTLES ARE NOW LIVE!', 'Welcome to the Aura Arena! Submit your battles, see active locations, and follow the live leaderboard of champions.', 'High', true
WHERE NOT EXISTS (SELECT 1 FROM public.announcements);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_results ENABLE ROW LEVEL SECURITY;

-- 9. Row Level Security Policies
-- Public Read Access
CREATE POLICY "Public read active locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Public read leaderboard" ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY "Public read approved or public battles" ON public.battles FOR SELECT USING (status IN ('Upcoming', 'Live', 'Completed'));
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public read battle results" ON public.battle_results FOR SELECT USING (true);

-- Public Battle Submission (Only as Pending)
CREATE POLICY "Public can insert pending battles" ON public.battles FOR INSERT WITH CHECK (status = 'Pending');
