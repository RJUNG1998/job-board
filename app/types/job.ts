export interface Job {
  id: string,
  job_id: string,
  source: 'greenhouse' | 'lever' | 'ashby' | 'arbeitnow',
  title: string,
  company: string,
  location: string | null,
  is_remote: boolean,
  description: string | null,
  url: string,
  salary_min: number | null,
  salary_max: number | null,
  job_type: 'full-time' | 'part-time' | 'contract' | null,
  posted_at: string | null,
  fetched_at: string
}

export type JobInsert = Omit<Job, 'id' | 'fetched_at'>