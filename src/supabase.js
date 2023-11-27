import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yydvuvlhccvmanajfoxq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZHZ1dmxoY2N2bWFuYWpmb3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEwMjQ4MDYsImV4cCI6MjAxNjYwMDgwNn0.sxEnJ0Dl76K9z13Ju_yeElEmcVh9H30quq_yd6Gahd8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
