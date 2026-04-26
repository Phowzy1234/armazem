import { supabase } from './supabase'

export async function getAuthUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
}

export async function getAuthUserId() {
  const user = await getAuthUser()
  return user?.id || null
}