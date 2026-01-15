import { createClient } from '@supabase/supabase-js';
import { Database } from '@shared/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const isGodMode = import.meta.env.VITE_GOD_MODE === 'true';

// In god mode, use service key to bypass RLS; otherwise use anon key
const supabaseKey = isGodMode
  ? import.meta.env.VITE_SUPABASE_SERVICE_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    isGodMode
      ? 'Missing Supabase credentials. Ensure VITE_SUPABASE_SERVICE_KEY is set for god mode.'
      : 'Missing Supabase credentials',
  );
}

export { isGodMode };
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
