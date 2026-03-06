export interface GreenhouseResponse {
  jobs: GreenhouseJob[]
}

export interface GreenhouseJob {
  id: number,
  title: string,
  updated_at: string,
  first_published: string,
  location: { name: string },
  absolute_url: string,
  content: string,
  metadata?: { id: number; name: string; value: string | null }[] | null
}