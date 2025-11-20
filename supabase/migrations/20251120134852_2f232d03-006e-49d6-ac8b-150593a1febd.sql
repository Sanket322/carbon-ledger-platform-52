-- Drop the existing view and recreate with SECURITY INVOKER
DROP VIEW IF EXISTS public.energy_summary;

CREATE OR REPLACE VIEW public.energy_summary
WITH (security_invoker = true)
AS
SELECT 
  p.id as project_id,
  p.title as project_name,
  p.owner_id,
  COUNT(er.id) as total_readings,
  SUM(er.energy_generated_kwh) as total_energy_kwh,
  SUM(er.carbon_credits_generated) as total_credits_generated,
  MAX(er.reading_date) as last_reading_date,
  AVG(er.energy_generated_kwh) as avg_energy_per_reading
FROM public.projects p
LEFT JOIN public.energy_readings er ON p.id = er.project_id
GROUP BY p.id, p.title, p.owner_id;