-- Demo User Setup Instructions
-- Run these steps to create demo accounts:

-- STEP 1: Create demo users manually through the signup pages:
-- Go to /signup and create: buyer@demo.offst.ai (password: Demo123!@#)
-- Go to /signup/project-owner and create: owner@demo.offst.ai (password: Demo123!@#)
-- Go to /signup and create: admin@demo.offst.ai (password: Demo123!@#)

-- STEP 2: After creating the accounts, get their user IDs
SELECT id, email FROM auth.users WHERE email IN ('buyer@demo.offst.ai', 'owner@demo.offst.ai', 'admin@demo.offst.ai');

-- STEP 3: Add admin role (replace USER_ID with the actual ID from step 2)
-- INSERT INTO public.user_roles (user_id, role) VALUES ('USER_ID_HERE', 'admin');

-- STEP 4: Update wallets with demo data (optional)
-- UPDATE public.wallets SET balance = 50000, total_credits = 100 WHERE user_id = 'BUYER_USER_ID';
-- UPDATE public.wallets SET total_credits = 500 WHERE user_id = 'OWNER_USER_ID';

-- STEP 5: Mark profiles as KYC verified (optional)
-- UPDATE public.profiles SET kyc_verified = true WHERE id IN ('BUYER_ID', 'OWNER_ID', 'ADMIN_ID');
