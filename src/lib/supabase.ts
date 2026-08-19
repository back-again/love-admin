import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://heddincpvgpehisfdaoa.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_wB5zVAL_lQ8quWG3UiQxjg_hi1qxfK7';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
