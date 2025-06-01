// filepath: src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yzdhjvppecvxmayibzkc.supabase.co'; // Reemplaza con tu URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZGhqdnBwZWN2eG1heWliemtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NTE2NjMsImV4cCI6MjA2NDMyNzY2M30.BDRn0BHWeULDx02_5G4d9x-t0lBFlyR_nKU4j6VfXc0'; // Reemplaza con tu clave pública

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);