-- Remove vision-to-scad from workflow types
-- This workflow was removed in favor of one-shot chat (better results, lower cost)

-- First, delete any existing vision-to-scad workflows and related data
-- (cascade will handle workflow_steps and inflection_points)
DELETE FROM "public"."workflows" WHERE workflow_type = 'vision-to-scad';

-- Now update the constraint
alter table "public"."workflows" drop constraint "workflows_type_check";

alter table "public"."workflows" add constraint "workflows_type_check" CHECK ((workflow_type = ANY (ARRAY['verification-loop'::text, 'assembly-explode'::text, 'multi-angle-optimize'::text]))) not valid;

alter table "public"."workflows" validate constraint "workflows_type_check";
