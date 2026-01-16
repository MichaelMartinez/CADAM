
  create table "public"."inflection_points" (
    "id" uuid not null default gen_random_uuid(),
    "workflow_id" uuid not null,
    "step_id" uuid not null,
    "title" text not null,
    "description" text,
    "context" jsonb not null default '{}'::jsonb,
    "options" jsonb not null,
    "user_choice" text,
    "user_feedback" text,
    "created_at" timestamp with time zone not null default now(),
    "resolved_at" timestamp with time zone
      );


alter table "public"."inflection_points" enable row level security;


  create table "public"."workflow_steps" (
    "id" uuid not null default gen_random_uuid(),
    "workflow_id" uuid not null,
    "step_name" text not null,
    "step_type" text not null,
    "input" jsonb,
    "output" jsonb,
    "model_used" text,
    "prompt_version" text,
    "tokens_used" integer,
    "duration_ms" integer,
    "status" text not null default 'pending'::text,
    "error" text,
    "created_at" timestamp with time zone not null default now(),
    "completed_at" timestamp with time zone
      );


alter table "public"."workflow_steps" enable row level security;


  create table "public"."workflows" (
    "id" uuid not null default gen_random_uuid(),
    "conversation_id" uuid not null,
    "trigger_message_id" uuid not null,
    "workflow_type" text not null,
    "status" text not null default 'pending'::text,
    "current_step" text,
    "state" jsonb not null default '{}'::jsonb,
    "config" jsonb not null default '{}'::jsonb,
    "error" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."workflows" enable row level security;

CREATE UNIQUE INDEX inflection_points_pkey ON public.inflection_points USING btree (id);

CREATE INDEX inflection_points_resolved_idx ON public.inflection_points USING btree (resolved_at) WHERE (resolved_at IS NULL);

CREATE INDEX inflection_points_workflow_id_idx ON public.inflection_points USING btree (workflow_id);

CREATE UNIQUE INDEX workflow_steps_pkey ON public.workflow_steps USING btree (id);

CREATE INDEX workflow_steps_status_idx ON public.workflow_steps USING btree (status);

CREATE INDEX workflow_steps_workflow_id_idx ON public.workflow_steps USING btree (workflow_id);

CREATE INDEX workflows_conversation_id_idx ON public.workflows USING btree (conversation_id);

CREATE INDEX workflows_created_at_idx ON public.workflows USING btree (created_at);

CREATE UNIQUE INDEX workflows_pkey ON public.workflows USING btree (id);

CREATE INDEX workflows_status_idx ON public.workflows USING btree (status);

alter table "public"."inflection_points" add constraint "inflection_points_pkey" PRIMARY KEY using index "inflection_points_pkey";

alter table "public"."workflow_steps" add constraint "workflow_steps_pkey" PRIMARY KEY using index "workflow_steps_pkey";

alter table "public"."workflows" add constraint "workflows_pkey" PRIMARY KEY using index "workflows_pkey";

alter table "public"."inflection_points" add constraint "inflection_points_step_id_fkey" FOREIGN KEY (step_id) REFERENCES public.workflow_steps(id) ON DELETE CASCADE not valid;

alter table "public"."inflection_points" validate constraint "inflection_points_step_id_fkey";

alter table "public"."inflection_points" add constraint "inflection_points_workflow_id_fkey" FOREIGN KEY (workflow_id) REFERENCES public.workflows(id) ON DELETE CASCADE not valid;

alter table "public"."inflection_points" validate constraint "inflection_points_workflow_id_fkey";

alter table "public"."workflow_steps" add constraint "workflow_steps_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'running'::text, 'completed'::text, 'failed'::text, 'skipped'::text]))) not valid;

alter table "public"."workflow_steps" validate constraint "workflow_steps_status_check";

alter table "public"."workflow_steps" add constraint "workflow_steps_type_check" CHECK ((step_type = ANY (ARRAY['preprocessing'::text, 'ai_call'::text, 'inflection_point'::text, 'postprocessing'::text, 'verification'::text]))) not valid;

alter table "public"."workflow_steps" validate constraint "workflow_steps_type_check";

alter table "public"."workflow_steps" add constraint "workflow_steps_workflow_id_fkey" FOREIGN KEY (workflow_id) REFERENCES public.workflows(id) ON DELETE CASCADE not valid;

alter table "public"."workflow_steps" validate constraint "workflow_steps_workflow_id_fkey";

alter table "public"."workflows" add constraint "workflows_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE not valid;

alter table "public"."workflows" validate constraint "workflows_conversation_id_fkey";

alter table "public"."workflows" add constraint "workflows_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'running'::text, 'awaiting_decision'::text, 'completed'::text, 'failed'::text, 'cancelled'::text]))) not valid;

alter table "public"."workflows" validate constraint "workflows_status_check";

alter table "public"."workflows" add constraint "workflows_trigger_message_id_fkey" FOREIGN KEY (trigger_message_id) REFERENCES public.messages(id) ON DELETE CASCADE not valid;

alter table "public"."workflows" validate constraint "workflows_trigger_message_id_fkey";

alter table "public"."workflows" add constraint "workflows_type_check" CHECK ((workflow_type = ANY (ARRAY['vision-to-scad'::text, 'verification-loop'::text, 'assembly-explode'::text, 'multi-angle-optimize'::text]))) not valid;

alter table "public"."workflows" validate constraint "workflows_type_check";

grant delete on table "public"."inflection_points" to "anon";

grant insert on table "public"."inflection_points" to "anon";

grant references on table "public"."inflection_points" to "anon";

grant select on table "public"."inflection_points" to "anon";

grant trigger on table "public"."inflection_points" to "anon";

grant truncate on table "public"."inflection_points" to "anon";

grant update on table "public"."inflection_points" to "anon";

grant delete on table "public"."inflection_points" to "authenticated";

grant insert on table "public"."inflection_points" to "authenticated";

grant references on table "public"."inflection_points" to "authenticated";

grant select on table "public"."inflection_points" to "authenticated";

grant trigger on table "public"."inflection_points" to "authenticated";

grant truncate on table "public"."inflection_points" to "authenticated";

grant update on table "public"."inflection_points" to "authenticated";

grant delete on table "public"."inflection_points" to "service_role";

grant insert on table "public"."inflection_points" to "service_role";

grant references on table "public"."inflection_points" to "service_role";

grant select on table "public"."inflection_points" to "service_role";

grant trigger on table "public"."inflection_points" to "service_role";

grant truncate on table "public"."inflection_points" to "service_role";

grant update on table "public"."inflection_points" to "service_role";

grant delete on table "public"."workflow_steps" to "anon";

grant insert on table "public"."workflow_steps" to "anon";

grant references on table "public"."workflow_steps" to "anon";

grant select on table "public"."workflow_steps" to "anon";

grant trigger on table "public"."workflow_steps" to "anon";

grant truncate on table "public"."workflow_steps" to "anon";

grant update on table "public"."workflow_steps" to "anon";

grant delete on table "public"."workflow_steps" to "authenticated";

grant insert on table "public"."workflow_steps" to "authenticated";

grant references on table "public"."workflow_steps" to "authenticated";

grant select on table "public"."workflow_steps" to "authenticated";

grant trigger on table "public"."workflow_steps" to "authenticated";

grant truncate on table "public"."workflow_steps" to "authenticated";

grant update on table "public"."workflow_steps" to "authenticated";

grant delete on table "public"."workflow_steps" to "service_role";

grant insert on table "public"."workflow_steps" to "service_role";

grant references on table "public"."workflow_steps" to "service_role";

grant select on table "public"."workflow_steps" to "service_role";

grant trigger on table "public"."workflow_steps" to "service_role";

grant truncate on table "public"."workflow_steps" to "service_role";

grant update on table "public"."workflow_steps" to "service_role";

grant delete on table "public"."workflows" to "anon";

grant insert on table "public"."workflows" to "anon";

grant references on table "public"."workflows" to "anon";

grant select on table "public"."workflows" to "anon";

grant trigger on table "public"."workflows" to "anon";

grant truncate on table "public"."workflows" to "anon";

grant update on table "public"."workflows" to "anon";

grant delete on table "public"."workflows" to "authenticated";

grant insert on table "public"."workflows" to "authenticated";

grant references on table "public"."workflows" to "authenticated";

grant select on table "public"."workflows" to "authenticated";

grant trigger on table "public"."workflows" to "authenticated";

grant truncate on table "public"."workflows" to "authenticated";

grant update on table "public"."workflows" to "authenticated";

grant delete on table "public"."workflows" to "service_role";

grant insert on table "public"."workflows" to "service_role";

grant references on table "public"."workflows" to "service_role";

grant select on table "public"."workflows" to "service_role";

grant trigger on table "public"."workflows" to "service_role";

grant truncate on table "public"."workflows" to "service_role";

grant update on table "public"."workflows" to "service_role";


  create policy "Users can manage inflection points in their conversations"
  on "public"."inflection_points"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT conversations.user_id
   FROM (public.conversations
     JOIN public.workflows ON ((workflows.conversation_id = conversations.id)))
  WHERE (workflows.id = inflection_points.workflow_id))));



  create policy "Users can manage workflow steps in their conversations"
  on "public"."workflow_steps"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT conversations.user_id
   FROM (public.conversations
     JOIN public.workflows ON ((workflows.conversation_id = conversations.id)))
  WHERE (workflows.id = workflow_steps.workflow_id))));



  create policy "Users can manage workflows in their conversations"
  on "public"."workflows"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) IN ( SELECT conversations.user_id
   FROM public.conversations
  WHERE (conversations.id = workflows.conversation_id))));



