import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
  'https://miwhvdyhgzvfclqjqngz.supabase.co';

const SUPABASE_ANON_KEY =
  (
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
  )?.trim() ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pd2h2ZHloZ3p2ZmNscWpxbmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyODkyNDIsImV4cCI6MjA5MDg2NTI0Mn0.wMtPlH_IWixNN6j9BwqWpqMVQpE44nWvfrmnFd-yD3Q';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
