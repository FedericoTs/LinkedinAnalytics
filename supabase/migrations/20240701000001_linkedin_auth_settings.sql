-- This migration ensures the LinkedIn provider is properly configured
-- Note: This is for documentation purposes only, as provider configuration is typically done through the Supabase dashboard

-- Create a function to log authentication attempts for debugging
CREATE OR REPLACE FUNCTION public.log_auth_attempt()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.auth_logs (provider, user_id, email, success, error_message, created_at)
  VALUES (
    NEW.provider,
    NEW.id,
    NEW.email,
    NEW.confirmed_at IS NOT NULL,
    CASE WHEN NEW.confirmed_at IS NULL THEN 'Authentication not confirmed' ELSE NULL END,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a table to log authentication attempts if it doesn't exist
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT,
  user_id UUID,
  email TEXT,
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view logs
DROP POLICY IF EXISTS "Admin users can view auth logs" ON public.auth_logs;
CREATE POLICY "Admin users can view auth logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_super_admin = true));

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.auth_logs;
