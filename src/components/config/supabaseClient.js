import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://szclqphcsshcmgtsogyd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6Y2xxcGhjc3NoY21ndHNvZ3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MjI1NzUsImV4cCI6MjAyNTk5ODU3NX0.KBuLlb5R_nwqJA4gP8T8ewl18KB68t_adNAnMS0IGpI';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;