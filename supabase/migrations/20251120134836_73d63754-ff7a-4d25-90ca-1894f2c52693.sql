-- Create energy readings table for tracking project energy generation
CREATE TABLE public.energy_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  reading_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  energy_generated_kwh NUMERIC NOT NULL,
  carbon_credits_generated NUMERIC DEFAULT 0,
  reading_type TEXT NOT NULL DEFAULT 'automatic',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_energy_readings_project_id ON public.energy_readings(project_id);
CREATE INDEX idx_energy_readings_date ON public.energy_readings(reading_date DESC);

-- Enable RLS
ALTER TABLE public.energy_readings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for energy_readings
CREATE POLICY "Project owners can view their project energy readings"
  ON public.energy_readings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = energy_readings.project_id
      AND projects.owner_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Project owners can insert energy readings"
  ON public.energy_readings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = energy_readings.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update their energy readings"
  ON public.energy_readings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = energy_readings.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all energy readings"
  ON public.energy_readings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_energy_readings_updated_at
  BEFORE UPDATE ON public.energy_readings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create energy summary view for dashboard
CREATE OR REPLACE VIEW public.energy_summary AS
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