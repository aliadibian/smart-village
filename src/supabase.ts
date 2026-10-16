import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://oamawlgcvndsleuunyzq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbWF3bGdjdm5kc2xldXVueXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNjcyMzIsImV4cCI6MjEwNzc0MzIzMn0.WhlzFxXXY4a5e_Hhz81PTxxbY0sD0-Q5-B5FEON899w'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)