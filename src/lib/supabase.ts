import { createClient } from '@supabase/supabase-js';
import { Database } from '@shared/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const isGodMode = import.meta.env.VITE_GOD_MODE === 'true';

// In god mode, use service key to bypass RLS; otherwise use anon key
const supabaseKey = isGodMode
  ? import.meta.env.VITE_SUPABASE_SERVICE_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  if (isGodMode && !import.meta.env.VITE_SUPABASE_SERVICE_KEY) {
    throw new Error(
      'GOD_MODE requires VITE_SUPABASE_SERVICE_KEY to bypass RLS.\n' +
        'Get the key by running: supabase status --output json\n' +
        'Then add to .env.local:\n' +
        '  VITE_SUPABASE_SERVICE_KEY="<SERVICE_ROLE_KEY from output>"',
    );
  }
  throw new Error('Missing Supabase credentials');
}

// Debug logging for god mode
if (isGodMode) {
  console.log(
    '%c🔓 GOD MODE: Using service_role key',
    'background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 3px;',
    {
      keyPrefix: supabaseKey.substring(0, 20) + '...',
      url: supabaseUrl,
    },
  );
}

export { isGodMode };
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
