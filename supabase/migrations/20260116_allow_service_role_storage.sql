-- God Mode Development Setup
-- Allows local development without authentication
-- God mode user UUID: 00000000-0000-0000-0000-000000000000

-- =============================================================================
-- Storage Policies
-- =============================================================================

-- Allow service_role to insert into images bucket
CREATE POLICY "Service role can insert images"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'images');

-- Allow service_role to select from images bucket
CREATE POLICY "Service role can select images"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id = 'images');

-- Allow service_role to update images bucket
CREATE POLICY "Service role can update images"
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'images');

-- Allow service_role to delete from images bucket
CREATE POLICY "Service role can delete images"
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id = 'images');

-- Allow god mode user folder access (UUID-based)
CREATE POLICY "God mode folder access"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'images' AND (storage.foldername(name))[1] = '00000000-0000-0000-0000-000000000000')
WITH CHECK (bucket_id = 'images' AND (storage.foldername(name))[1] = '00000000-0000-0000-0000-000000000000');

-- =============================================================================
-- God Mode User
-- =============================================================================

-- Create god mode user in auth.users (required for FK constraints)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, instance_id, aud, role)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'god@local.dev',
  '',
  now(),
  now(),
  now(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Table RLS Policies for God Mode
-- =============================================================================

-- Allow god mode user to manage conversations
CREATE POLICY "God mode conversations access"
ON public.conversations
FOR ALL
TO public
USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid)
WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Allow god mode user to manage messages in their conversations
CREATE POLICY "God mode messages access"
ON public.messages
FOR ALL
TO public
USING (conversation_id IN (SELECT id FROM conversations WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid))
WITH CHECK (conversation_id IN (SELECT id FROM conversations WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid));

-- Allow god mode user to manage workflows in their conversations
CREATE POLICY "God mode workflows access"
ON public.workflows
FOR ALL
TO public
USING (conversation_id IN (SELECT id FROM conversations WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid))
WITH CHECK (conversation_id IN (SELECT id FROM conversations WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid));

-- Allow god mode user to manage workflow_steps in their workflows
CREATE POLICY "God mode workflow_steps access"
ON public.workflow_steps
FOR ALL
TO public
USING (workflow_id IN (
    SELECT w.id FROM workflows w
    JOIN conversations c ON w.conversation_id = c.id
    WHERE c.user_id = '00000000-0000-0000-0000-000000000000'::uuid
))
WITH CHECK (workflow_id IN (
    SELECT w.id FROM workflows w
    JOIN conversations c ON w.conversation_id = c.id
    WHERE c.user_id = '00000000-0000-0000-0000-000000000000'::uuid
));

-- Allow god mode user to manage inflection_points in their workflows
CREATE POLICY "God mode inflection_points access"
ON public.inflection_points
FOR ALL
TO public
USING (workflow_id IN (
    SELECT w.id FROM workflows w
    JOIN conversations c ON w.conversation_id = c.id
    WHERE c.user_id = '00000000-0000-0000-0000-000000000000'::uuid
))
WITH CHECK (workflow_id IN (
    SELECT w.id FROM workflows w
    JOIN conversations c ON w.conversation_id = c.id
    WHERE c.user_id = '00000000-0000-0000-0000-000000000000'::uuid
));
