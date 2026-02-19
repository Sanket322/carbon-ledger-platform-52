
-- 1. Make project-documents bucket private
UPDATE storage.buckets SET public = false WHERE id = 'project-documents';

-- 2. Create atomic purchase_credits function to prevent race conditions
CREATE OR REPLACE FUNCTION public.purchase_credits(
  p_buyer_id uuid,
  p_project_id uuid,
  p_credits numeric,
  p_price_per_ton numeric
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet record;
  v_project record;
  v_total_cost numeric;
  v_transaction_id uuid;
  v_serial_number text;
BEGIN
  -- Lock wallet row to prevent race conditions
  SELECT * INTO v_wallet FROM public.wallets
    WHERE user_id = p_buyer_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  -- Lock project row to prevent race conditions
  SELECT * INTO v_project FROM public.projects
    WHERE id = p_project_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  v_total_cost := p_credits * p_price_per_ton;

  -- Validate balance
  IF v_wallet.balance < v_total_cost THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  -- Validate available credits
  IF v_project.available_credits < p_credits THEN
    RAISE EXCEPTION 'Insufficient credits available';
  END IF;

  -- Validate buyer is not the seller
  IF v_project.owner_id = p_buyer_id THEN
    RAISE EXCEPTION 'Cannot purchase your own project credits';
  END IF;

  -- Generate serial number
  v_serial_number := 'TXN-' || extract(epoch from now())::bigint || '-' || substr(p_buyer_id::text, 1, 8);

  -- Atomic: insert transaction
  INSERT INTO public.transactions (
    buyer_id, seller_id, project_id, credits, price_per_ton,
    total_amount, transaction_type, status, serial_number
  ) VALUES (
    p_buyer_id, v_project.owner_id, p_project_id, p_credits, p_price_per_ton,
    v_total_cost, 'purchase', 'completed', v_serial_number
  ) RETURNING id INTO v_transaction_id;

  -- Atomic: deduct wallet balance, add credits
  UPDATE public.wallets SET
    balance = balance - v_total_cost,
    total_credits = total_credits + p_credits,
    updated_at = now()
  WHERE user_id = p_buyer_id;

  -- Atomic: deduct project available credits
  UPDATE public.projects SET
    available_credits = available_credits - p_credits,
    updated_at = now()
  WHERE id = p_project_id;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'serial_number', v_serial_number,
    'total_cost', v_total_cost
  );
END;
$$;

-- 3. Create atomic retire_credits function
CREATE OR REPLACE FUNCTION public.retire_credits(
  p_user_id uuid,
  p_project_id uuid,
  p_credits numeric,
  p_reason text DEFAULT 'Voluntary carbon offset'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet record;
  v_serial_number text;
  v_cert_id uuid;
BEGIN
  -- Lock wallet row
  SELECT * INTO v_wallet FROM public.wallets
    WHERE user_id = p_user_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  -- Validate credits
  IF v_wallet.total_credits < p_credits THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Generate UCR serial number
  v_serial_number := 'UCR-' || extract(epoch from now())::bigint || '-' || substr(p_user_id::text, 1, 8);

  -- Atomic: insert retirement certificate
  INSERT INTO public.retirement_certificates (
    user_id, project_id, credits_retired, serial_number, retirement_reason
  ) VALUES (
    p_user_id, p_project_id, p_credits, v_serial_number, p_reason
  ) RETURNING id INTO v_cert_id;

  -- Atomic: deduct credits from wallet
  UPDATE public.wallets SET
    total_credits = total_credits - p_credits,
    updated_at = now()
  WHERE user_id = p_user_id;

  RETURN json_build_object(
    'success', true,
    'certificate_id', v_cert_id,
    'serial_number', v_serial_number
  );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.purchase_credits(uuid, uuid, numeric, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.retire_credits(uuid, uuid, numeric, text) TO authenticated;
