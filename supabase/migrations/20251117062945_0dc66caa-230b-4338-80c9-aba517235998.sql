-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', true);

-- Policy: Anyone can view project documents
CREATE POLICY "Project documents are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-documents');

-- Policy: Authenticated users can upload their own documents
CREATE POLICY "Users can upload their own project documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update their own project documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete their own project documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);