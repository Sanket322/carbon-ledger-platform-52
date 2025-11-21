-- Create trigger function to handle new user registration with role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get role from metadata, default to 'buyer'
  user_role := COALESCE(NEW.raw_user_meta_data->>'user_role', 'buyer');
  
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Insert into user_roles with the specified role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role::app_role);
  
  -- Create wallet with demo balance for demo accounts
  IF NEW.email LIKE '%@demo.offst.ai' THEN
    INSERT INTO public.wallets (user_id, balance, total_credits)
    VALUES (NEW.id, 50000, 100);
  ELSE
    INSERT INTO public.wallets (user_id, balance, total_credits)
    VALUES (NEW.id, 0, 0);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();