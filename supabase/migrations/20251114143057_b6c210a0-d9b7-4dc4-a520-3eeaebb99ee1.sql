-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with role detection from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, company_name, phone, country, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'country',
    now(),
    now()
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, balance, escrow_balance, total_credits)
  VALUES (NEW.id, 0, 0, 0);
  
  -- Determine role from metadata (default to buyer if not specified)
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'user_role')::app_role,
    'buyer'::app_role
  );
  
  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$function$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();