import { supabase } from "@/app/lib/supabase-browser"
import { JobInsert } from "@/app/types/job"
import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  const [greenhouseResponse] = await Promise.allSettled([
    fetch(`${baseUrl}/api/sources/greenhouse`).then(r => r.json()),
  ])

  const allJobs: JobInsert[] = [
    ...(greenhouseResponse.status === 'fulfilled' ? greenhouseResponse.value.jobs : []),
  ]

  const chunkSize = 1000
  let inserted = 0

  for (let i = 0; i < allJobs.length; i += chunkSize) {
    const chunk = allJobs.slice(i, i + chunkSize)
    const { data, error } = await supabase
      .from('jobs')
      .upsert(chunk, { onConflict: 'job_id,source' })
      .select()

    if (error) throw error
    inserted += data?.length ?? 0
  }

  return NextResponse.json({
    success: true,
    fetched: allJobs.length,
    inserted,
  })
}