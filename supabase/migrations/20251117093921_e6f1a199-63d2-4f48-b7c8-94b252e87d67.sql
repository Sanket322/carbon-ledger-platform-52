-- Add certification workflow fields to projects table

-- Add new columns for certification process
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS installed_capacity TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS ownership_proof_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS no_harm_declaration_signed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS no_harm_declaration_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS carbon_asset_mandate_signed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS carbon_asset_mandate_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS impact_criteria_compliance TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS baseline_justification TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS additionality_demonstration TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS monitoring_plan_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS stakeholder_consultation_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS current_stage TEXT DEFAULT 'application';

-- Add new project statuses for certification workflow
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'application';
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'registration';
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'pre_validation';
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'validation';
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'monitoring';
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'audited';

-- Add comments for documentation
COMMENT ON COLUMN public.projects.company_name IS 'Company or organization name';
COMMENT ON COLUMN public.projects.contact_email IS 'Primary contact email for the project';
COMMENT ON COLUMN public.projects.contact_phone IS 'Primary contact phone number';
COMMENT ON COLUMN public.projects.installed_capacity IS 'Project installed capacity (e.g., MW for solar)';
COMMENT ON COLUMN public.projects.ownership_proof_url IS 'URL to proof of ownership document';
COMMENT ON COLUMN public.projects.no_harm_declaration_signed IS 'Whether no-harm declaration has been signed';
COMMENT ON COLUMN public.projects.carbon_asset_mandate_signed IS 'Whether carbon asset ownership mandate has been signed';
COMMENT ON COLUMN public.projects.impact_criteria_compliance IS 'Description of impact criteria compliance';
COMMENT ON COLUMN public.projects.baseline_justification IS 'Baseline scenario justification';
COMMENT ON COLUMN public.projects.additionality_demonstration IS 'Demonstration of project additionality';
COMMENT ON COLUMN public.projects.monitoring_plan_url IS 'URL to monitoring plan document';
COMMENT ON COLUMN public.projects.stakeholder_consultation_url IS 'URL to stakeholder consultation evidence';
COMMENT ON COLUMN public.projects.current_stage IS 'Current stage in certification workflow';