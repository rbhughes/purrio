import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = createClient()
  const { data: repos } = await supabase.from('repos').select()

  return <pre>{JSON.stringify(repos, null, 2)}</pre>
}