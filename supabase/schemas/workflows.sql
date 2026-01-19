-- Workflow system tables for multi-modal agentic workflows
-- Supports verification loops and other workflow types
-- Note: vision-to-scad was removed - use one-shot chat for image-to-CAD conversion (better results, lower cost)

-- Main workflows table
CREATE TABLE IF NOT EXISTS "public"."workflows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "trigger_message_id" "uuid" NOT NULL,
    "workflow_type" "text" NOT NULL,
    "status" "text" NOT NULL DEFAULT 'pending',
    "current_step" "text",
    "state" "jsonb" NOT NULL DEFAULT '{}',
    "config" "jsonb" NOT NULL DEFAULT '{}',
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "workflows_type_check" CHECK (("workflow_type" = ANY (ARRAY[
        'verification-loop'::"text",
        'assembly-explode'::"text",
        'multi-angle-optimize'::"text"
    ]))),
    CONSTRAINT "workflows_status_check" CHECK (("status" = ANY (ARRAY[
        'pending'::"text",
        'running'::"text",
        'awaiting_decision'::"text",
        'completed'::"text",
        'failed'::"text",
        'cancelled'::"text"
    ])))
);

CREATE UNIQUE INDEX IF NOT EXISTS workflows_pkey ON "public"."workflows" USING btree (id);

ALTER TABLE "public"."workflows" ADD CONSTRAINT "workflows_pkey" PRIMARY KEY USING INDEX "workflows_pkey";

ALTER TABLE "public"."workflows" ADD CONSTRAINT "workflows_conversation_id_fkey"
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE not valid;
ALTER TABLE "public"."workflows" VALIDATE CONSTRAINT "workflows_conversation_id_fkey";

ALTER TABLE "public"."workflows" ADD CONSTRAINT "workflows_trigger_message_id_fkey"
    FOREIGN KEY (trigger_message_id) REFERENCES messages(id) ON DELETE CASCADE not valid;
ALTER TABLE "public"."workflows" VALIDATE CONSTRAINT "workflows_trigger_message_id_fkey";

CREATE INDEX IF NOT EXISTS workflows_conversation_id_idx ON "public"."workflows" USING btree (conversation_id);
CREATE INDEX IF NOT EXISTS workflows_status_idx ON "public"."workflows" USING btree (status);
CREATE INDEX IF NOT EXISTS workflows_created_at_idx ON "public"."workflows" USING btree (created_at);


-- Workflow steps table (audit trail + state snapshots)
CREATE TABLE IF NOT EXISTS "public"."workflow_steps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workflow_id" "uuid" NOT NULL,
    "step_name" "text" NOT NULL,
    "step_type" "text" NOT NULL,
    "input" "jsonb",
    "output" "jsonb",
    "model_used" "text",
    "prompt_version" "text",
    "tokens_used" integer,
    "duration_ms" integer,
    "status" "text" NOT NULL DEFAULT 'pending',
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    CONSTRAINT "workflow_steps_type_check" CHECK (("step_type" = ANY (ARRAY[
        'preprocessing'::"text",
        'ai_call'::"text",
        'inflection_point'::"text",
        'postprocessing'::"text",
        'verification'::"text"
    ]))),
    CONSTRAINT "workflow_steps_status_check" CHECK (("status" = ANY (ARRAY[
        'pending'::"text",
        'running'::"text",
        'completed'::"text",
        'failed'::"text",
        'skipped'::"text"
    ])))
);

CREATE UNIQUE INDEX IF NOT EXISTS workflow_steps_pkey ON "public"."workflow_steps" USING btree (id);

ALTER TABLE "public"."workflow_steps" ADD CONSTRAINT "workflow_steps_pkey" PRIMARY KEY USING INDEX "workflow_steps_pkey";

ALTER TABLE "public"."workflow_steps" ADD CONSTRAINT "workflow_steps_workflow_id_fkey"
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE not valid;
ALTER TABLE "public"."workflow_steps" VALIDATE CONSTRAINT "workflow_steps_workflow_id_fkey";

CREATE INDEX IF NOT EXISTS workflow_steps_workflow_id_idx ON "public"."workflow_steps" USING btree (workflow_id);
CREATE INDEX IF NOT EXISTS workflow_steps_status_idx ON "public"."workflow_steps" USING btree (status);


-- Inflection points table (decision cards shown to user)
CREATE TABLE IF NOT EXISTS "public"."inflection_points" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workflow_id" "uuid" NOT NULL,
    "step_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "context" "jsonb" NOT NULL DEFAULT '{}',
    "options" "jsonb" NOT NULL,
    "user_choice" "text",
    "user_feedback" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "resolved_at" timestamp with time zone
);

CREATE UNIQUE INDEX IF NOT EXISTS inflection_points_pkey ON "public"."inflection_points" USING btree (id);

ALTER TABLE "public"."inflection_points" ADD CONSTRAINT "inflection_points_pkey" PRIMARY KEY USING INDEX "inflection_points_pkey";

ALTER TABLE "public"."inflection_points" ADD CONSTRAINT "inflection_points_workflow_id_fkey"
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE not valid;
ALTER TABLE "public"."inflection_points" VALIDATE CONSTRAINT "inflection_points_workflow_id_fkey";

ALTER TABLE "public"."inflection_points" ADD CONSTRAINT "inflection_points_step_id_fkey"
    FOREIGN KEY (step_id) REFERENCES workflow_steps(id) ON DELETE CASCADE not valid;
ALTER TABLE "public"."inflection_points" VALIDATE CONSTRAINT "inflection_points_step_id_fkey";

CREATE INDEX IF NOT EXISTS inflection_points_workflow_id_idx ON "public"."inflection_points" USING btree (workflow_id);
CREATE INDEX IF NOT EXISTS inflection_points_resolved_idx ON "public"."inflection_points" USING btree (resolved_at) WHERE resolved_at IS NULL;


-- Row Level Security policies
-- Users can only access workflows in their own conversations

CREATE POLICY "Users can manage workflows in their conversations" ON "public"."workflows"
    USING (((SELECT "auth"."uid"()) IN (
        SELECT "conversations"."user_id"
        FROM "public"."conversations"
        WHERE ("conversations"."id" = "workflows"."conversation_id")
    )));

ALTER TABLE "public"."workflows" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can manage workflow steps in their conversations" ON "public"."workflow_steps"
    USING (((SELECT "auth"."uid"()) IN (
        SELECT "conversations"."user_id"
        FROM "public"."conversations"
        JOIN "public"."workflows" ON "workflows"."conversation_id" = "conversations"."id"
        WHERE ("workflows"."id" = "workflow_steps"."workflow_id")
    )));

ALTER TABLE "public"."workflow_steps" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can manage inflection points in their conversations" ON "public"."inflection_points"
    USING (((SELECT "auth"."uid"()) IN (
        SELECT "conversations"."user_id"
        FROM "public"."conversations"
        JOIN "public"."workflows" ON "workflows"."conversation_id" = "conversations"."id"
        WHERE ("workflows"."id" = "inflection_points"."workflow_id")
    )));

ALTER TABLE "public"."inflection_points" ENABLE ROW LEVEL SECURITY;
