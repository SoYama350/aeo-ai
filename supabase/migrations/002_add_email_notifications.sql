-- Add email notification tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_email_notification DATE DEFAULT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_last_email_notification 
ON public.profiles(last_email_notification);
