// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uxnzneihlcllrkhsvxaj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bnpuZWlobGNsbHJraHN2eGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTM5NjksImV4cCI6MjA4Mzg2OTk2OX0.GGQE2bNR1OBkZnTSvJ6lJ8eThfbokCLbCZY-gWf1fIA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
