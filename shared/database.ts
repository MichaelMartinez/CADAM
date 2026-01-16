export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string | null;
          current_message_leaf_id: string | null;
          id: string;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          current_message_leaf_id?: string | null;
          id?: string;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          current_message_leaf_id?: string | null;
          id?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      inflection_points: {
        Row: {
          context: Json;
          created_at: string;
          description: string | null;
          id: string;
          options: Json;
          resolved_at: string | null;
          step_id: string;
          title: string;
          user_choice: string | null;
          user_feedback: string | null;
          workflow_id: string;
        };
        Insert: {
          context?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          options: Json;
          resolved_at?: string | null;
          step_id: string;
          title: string;
          user_choice?: string | null;
          user_feedback?: string | null;
          workflow_id: string;
        };
        Update: {
          context?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          options?: Json;
          resolved_at?: string | null;
          step_id?: string;
          title?: string;
          user_choice?: string | null;
          user_feedback?: string | null;
          workflow_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inflection_points_step_id_fkey';
            columns: ['step_id'];
            isOneToOne: false;
            referencedRelation: 'workflow_steps';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'inflection_points_workflow_id_fkey';
            columns: ['workflow_id'];
            isOneToOne: false;
            referencedRelation: 'workflows';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          content: Json;
          conversation_id: string;
          created_at: string;
          id: string;
          parent_message_id: string | null;
          role: string;
        };
        Insert: {
          content: Json;
          conversation_id: string;
          created_at?: string;
          id?: string;
          parent_message_id?: string | null;
          role: string;
        };
        Update: {
          content?: Json;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          parent_message_id?: string | null;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
        ];
      };
      workflow_steps: {
        Row: {
          completed_at: string | null;
          created_at: string;
          duration_ms: number | null;
          error: string | null;
          id: string;
          input: Json | null;
          model_used: string | null;
          output: Json | null;
          prompt_version: string | null;
          status: string;
          step_name: string;
          step_type: string;
          tokens_used: number | null;
          workflow_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          duration_ms?: number | null;
          error?: string | null;
          id?: string;
          input?: Json | null;
          model_used?: string | null;
          output?: Json | null;
          prompt_version?: string | null;
          status?: string;
          step_name: string;
          step_type: string;
          tokens_used?: number | null;
          workflow_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          duration_ms?: number | null;
          error?: string | null;
          id?: string;
          input?: Json | null;
          model_used?: string | null;
          output?: Json | null;
          prompt_version?: string | null;
          status?: string;
          step_name?: string;
          step_type?: string;
          tokens_used?: number | null;
          workflow_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workflow_steps_workflow_id_fkey';
            columns: ['workflow_id'];
            isOneToOne: false;
            referencedRelation: 'workflows';
            referencedColumns: ['id'];
          },
        ];
      };
      workflows: {
        Row: {
          config: Json;
          conversation_id: string;
          created_at: string;
          current_step: string | null;
          error: string | null;
          id: string;
          state: Json;
          status: string;
          trigger_message_id: string;
          updated_at: string;
          workflow_type: string;
        };
        Insert: {
          config?: Json;
          conversation_id: string;
          created_at?: string;
          current_step?: string | null;
          error?: string | null;
          id?: string;
          state?: Json;
          status?: string;
          trigger_message_id: string;
          updated_at?: string;
          workflow_type: string;
        };
        Update: {
          config?: Json;
          conversation_id?: string;
          created_at?: string;
          current_step?: string | null;
          error?: string | null;
          id?: string;
          state?: Json;
          status?: string;
          trigger_message_id?: string;
          updated_at?: string;
          workflow_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workflows_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workflows_trigger_message_id_fkey';
            columns: ['trigger_message_id'];
            isOneToOne: false;
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
