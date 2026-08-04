// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://efrqjxyhdbvagzdztdmp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcnFqeHloZGJ2YWd6ZHp0ZG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MTI5NTcsImV4cCI6MjEwMTM4ODk1N30.n7GwzTESoLqGasiiuo6CY9aDzMhwlN5v6TN1wfnOTpA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
