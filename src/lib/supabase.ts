import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient("anon")

export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createMockClient("admin")

function createMockClient(type: "anon" | "admin") {
  const mockClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { code: "MOCK_MODE" } }),
          limit: async () => ({ data: [], error: null }),
          order: async () => ({ data: [], error: null }),
        }),
        insert: async () => ({ error: null }),
        update: async () => ({ error: null }),
      }),
    }),
  }
  return mockClient as any
}
