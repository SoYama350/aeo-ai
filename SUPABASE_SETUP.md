# Supabase Setup Guide for AEO.ai

## Step 1: Run Database Migration

Go to your Supabase Dashboard SQL Editor:
https://supabase.com/dashboard/project/ksvcboxhwkvzexanafkp/sql

Copy and paste the contents of `supabase/migrations/001_initial_schema.sql` and run it.

This will create:
- `profiles` table (user profiles with usage tracking)
- `analyses` table (all analysis results)
- Row Level Security (RLS) policies
- Auto-create profile trigger for new users

## Step 2: Verify Tables Created

After running the SQL, verify the tables exist:

```sql
-- Should return profiles table info
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Should return 'profiles' and 'analyses'
```

## Step 3: Test the App

1. Start the dev server:
```bash
npm run dev
```

2. Go to http://localhost:3000

3. Sign in with GitHub

4. Try analyzing some content

5. Check the History page at /history

## Features Implemented

### Dashboard (`/dashboard`)
- Content analyzer with AEO scoring
- Real-time usage counter (5 free/day)
- Shows remaining analyses

### History (`/history`)
- View all past analyses
- See scores and recommendations
- Date and time for each analysis

### Usage Tracking
- Automatic reset at midnight
- 5 free analyses per day
- Usage stored per user in `profiles` table

## Environment Variables

Make sure `.env.local` contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://ksvcboxhwkvzexanafkp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
```

## Troubleshooting

### "Failed to check usage limits"
- Make sure the migration ran successfully
- Check Supabase dashboard for table existence

### "Unauthorized" error
- Make sure you're signed in
- Check browser console for auth errors

### Analyses not saving
- Verify RLS policies are set correctly
- Check Supabase logs in dashboard
