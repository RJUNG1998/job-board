import { GreenhouseResponse } from "@/app/constants/api/greenhouse"
import { GREENHOUSE_COMPANIES, TECH_KEYWORDS } from "@/app/constants/general/greenhouse-companies"
import { JobInsert } from "@/app/types/job"
import { NextResponse } from "next/server"

const isTechJob = (title: string): boolean => {
  const lower = title.toLowerCase()
  return TECH_KEYWORDS.some(keyword => lower.includes(keyword))
}

export async function GET() {
  const results = await Promise.allSettled(
  GREENHOUSE_COMPANIES.map(company =>
      fetch(`https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs?content=true`)
        .then(r => r.json())
        .then((data: GreenhouseResponse) =>
          (data.jobs ?? [])
            .filter(job => isTechJob(job.title))
            .map(job => ({
              job_id:      String(job.id),
              source:      'greenhouse' as const,
              title:       job.title,
              company:     company.name,
              location:    job.location?.name ?? null,
              is_remote:   job.location?.name?.toLowerCase().includes('remote') ?? false,
              description: job.content ?? null,
              url:         job.absolute_url,
              salary_min:  null,
              salary_max:  null,
              job_type:    'full-time' as const,
              posted_at:   job.first_published,
            }))
        )
    )
  )

  // 결과 한번에 합치기
  const allJobs = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => (r as PromiseFulfilledResult<JobInsert[]>).value)

  return NextResponse.json({ jobs: allJobs })
}