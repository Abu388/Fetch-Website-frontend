import { supabase } from './supabaseClient'

// Fetch all messages, including replies (parent_id will link replies)
export async function fetchMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

// Insert a new message (or reply if parent_id is passed)
export async function insertMessage(username: string, content: string, parent_id: string | null = null) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ username, content, parent_id }])
    .select()
  
  if (error) throw error
  return data
}

// Delete a message by id (will cascade delete replies)
export async function deleteMessage(id: string) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}



// Listen to real-time changes on the 'messages' table
export function onMessageChange(callback: (payload: unknown) => void) {
  const channel = supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'messages' },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return channel
}


