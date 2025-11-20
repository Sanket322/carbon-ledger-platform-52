# Role-Based Portal System - Complete Documentation

## ✅ FIXED: Role Assignment Issue

The role assignment issue has been resolved. The problem was that the database trigger (`on_auth_user_created`) was missing, so the `handle_new_user()` function wasn't being executed on signup.

## Current System Status

### ✅ What's Working Now:
1. **Automatic Role Assignment**: New users are automatically assigned roles based on signup page
2. **Buyer Signup**: `/signup` → Automatically assigned `buyer` role
3. **Project Owner Signup**: `/signup/project-owner` → Automatically assigned `project_owner` role
4. **Admin Role**: Must be manually assigned in database
5. **Profile Creation**: Automatic profile and wallet creation on signup
6. **Auth Configuration**: Auto-confirm email enabled for faster testing

### 🔧 What Was Fixed:
- Created missing database trigger `on_auth_user_created`
- Fixed existing user (aaa@g.com) role to `project_owner`
- Updated profile and wallet for existing user
- Enabled auto-confirm email for testing

## Role-Based Portal Access

### 1️⃣ Buyer Portal (`/dashboard` when role = buyer)
**Features:**
- Browse and purchase carbon credits
- View marketplace and projects
- Track credit portfolio in wallet
- Retire credits and generate certificates
- Access trading engine
- View transaction history

**Navigation:**
- Marketplace
- Wallet
- Profile
- Purchase Credits

### 2️⃣ Project Owner Portal (`/dashboard` when role = project_owner)
**Features:**
- Register new projects
- Track energy generation (Energy Dashboard)
- Monitor carbon credits generated
- View project verification status
- Upload project documents
- Manage project listings

**Navigation:**
- Register Project
- Energy Dashboard
- Profile
- My Projects

### 3️⃣ Admin Portal (`/admin` when role = admin)
**Features:**
- User management
- Role management
- Project verification
- KYC management
- Transaction monitoring
- Certification workflow
- Reports and analytics
- System settings

**Navigation:**
- Admin Dashboard
- User Management
- Project Management
- KYC Management
- Transaction Monitoring
- Certification Workflow
- Reports
- Settings

## How to Test

### Create New Demo Accounts:

1. **Buyer Account**:
   ```
   Go to: /signup
   Email: buyer@demo.offst.ai
   Password: Demo123!@#
   Full Name: Demo Buyer
   ```

2. **Project Owner Account**:
   ```
   Go to: /signup/project-owner
   Email: owner@demo.offst.ai
   Password: Demo123!@#
   Full Name: Demo Owner
   Company: Green Energy Co.
   ```

3. **Admin Account** (requires manual role assignment):
   ```
   Go to: /signup
   Email: admin@demo.offst.ai
   Password: Demo123!@#
   
   Then run in database:
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ((SELECT id FROM auth.users WHERE email = 'admin@demo.offst.ai'), 'admin');
   ```

### Quick Demo Login:
Visit `/demo-login` for one-click login with pre-configured demo accounts (after creating them as above)

## Database Schema

### user_roles table:
```sql
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);
```

### app_role enum:
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'buyer', 'trader', 'project_owner');
```

## Role Assignment Flow

```
User Signs Up
    ↓
Supabase Auth creates user in auth.users
    ↓
Trigger: on_auth_user_created fires
    ↓
Function: handle_new_user() executes
    ↓
1. Creates profile in public.profiles
2. Creates wallet in public.wallets
3. Reads user_role from raw_user_meta_data
4. Inserts role into public.user_roles
    ↓
User is fully set up with correct role
```

## Checking User Roles

```sql
-- Check all users and their roles
SELECT 
  au.email,
  au.raw_user_meta_data->>'user_role' as metadata_role,
  ur.role as assigned_role,
  p.company_name,
  p.full_name
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
```

## Manually Assigning Roles

```sql
-- Add project_owner role to a user
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'project_owner');

-- Add admin role to a user
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin');

-- Add buyer role to a user (usually automatic)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'buyer');
```

## Frontend Role Checking

The `useUserRole` hook checks user roles:

```typescript
import { useUserRole } from "@/hooks/useUserRole";

const MyComponent = () => {
  const { isAdmin, isBuyer, isProjectOwner, isTrader, loading } = useUserRole();
  
  if (isProjectOwner) {
    // Show project owner features
  }
  
  if (isAdmin) {
    // Show admin features
  }
};
```

## Protected Routes

```typescript
// Admin routes
<Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route index element={<AdminDashboard />} />
  {/* ... other admin routes */}
</Route>

// General protected routes (all authenticated users)
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/energy" element={<ProtectedRoute><EnergyDashboard /></ProtectedRoute>} />
```

## Security Notes

⚠️ **Password Security**: Enable leaked password protection in Supabase Auth settings for production

✅ **RLS Policies**: All tables have Row Level Security enabled with role-based access

✅ **Role Verification**: The `has_role()` function is used in RLS policies:
```sql
CREATE POLICY "Admins can manage all" ON public.projects
FOR ALL USING (has_role(auth.uid(), 'admin'));
```

## Troubleshooting

### User has wrong role:
```sql
-- Delete incorrect role
DELETE FROM public.user_roles WHERE user_id = 'USER_ID' AND role = 'wrong_role';

-- Insert correct role
INSERT INTO public.user_roles (user_id, role) VALUES ('USER_ID', 'correct_role');
```

### User has no role:
```sql
-- Check metadata to see what they signed up as
SELECT email, raw_user_meta_data->>'user_role' FROM auth.users WHERE id = 'USER_ID';

-- Assign the role
INSERT INTO public.user_roles (user_id, role) VALUES ('USER_ID', 'role_from_metadata');
```

### Trigger not working:
```sql
-- Check if trigger exists
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Recreate trigger if missing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
```
