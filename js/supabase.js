/* Supabase Client Configuration & Helper Functions */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://npjraxiuwtchokzfknka.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_4dfUyYMnO5vU689jG1YTyg_2xEyxxLq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('⚡ Supabase Client initialized successfully!');
