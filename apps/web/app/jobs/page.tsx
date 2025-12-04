const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

type Job = {
  id: number;
  title: string;
  headline?: string | null;
  role: string;
  location?: string | null;
  work_style?: string | null;
  timeline?: string | null;
  compensation?: string | null;
  owner_name?: string | null;
};

async function fetchJobs(searchParams: URLSearchParams): Promise<Job[]> {
  try {
    const res = await fetch(`${apiBase}/api/jobs?${searchParams.toString()}`, {cache: 'no-store'});
    if (!res.ok) return [];
    return (await res.json()) as Job[];
  } catch {
    return [];
  }
}

export default async function JobsPage({searchParams}: {searchParams: Record<string, string | string[] | undefined>}) {
  const params = new URLSearchParams();
  if (searchParams.role && typeof searchParams.role === 'string') params.set('role', searchParams.role);
  if (searchParams.location && typeof searchParams.location === 'string') params.set('location', searchParams.location);
  if (searchParams.skills && typeof searchParams.skills === 'string') params.append('skills', searchParams.skills);
  if (searchParams.work_style && typeof searchParams.work_style === 'string') params.set('work_style', searchParams.work_style);

  const jobs = await fetchJobs(params);
  return (
    <main className="stack surface">
      <div className="page-heading" style={{marginBottom: 8}}>
        <div>
          <div className="badge">Jobs</div>
          <h2 style={{margin: '6px 0'}}>Open roles</h2>
          <p className="muted" style={{margin: 0}}>Simple cards like LinkedIn job search.</p>
        </div>
        <a className="button secondary" href="/jobs/new">
          Post a job
        </a>
      </div>
      <form className="form-grid" method="get" style={{marginBottom: 8}}>
        <label>
          Role
          <input name="role" placeholder="software_engineer" defaultValue={typeof searchParams.role === 'string' ? searchParams.role : ''} />
        </label>
        <label>
          Location
          <input name="location" placeholder="Remote, NYC" defaultValue={typeof searchParams.location === 'string' ? searchParams.location : ''} />
        </label>
        <label>
          Skills (comma separated)
          <input name="skills" placeholder="React, Python" defaultValue={typeof searchParams.skills === 'string' ? searchParams.skills : ''} />
        </label>
        <label>
          Work style
          <input name="work_style" placeholder="Remote, Hybrid" defaultValue={typeof searchParams.work_style === 'string' ? searchParams.work_style : ''} />
        </label>
        <div className="row" style={{alignItems: 'flex-end'}}>
          <button className="button secondary" type="submit">
            Filter
          </button>
          <a className="button secondary" href="/jobs">
            Clear
          </a>
        </div>
      </form>
      <div className="grid">
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <div className="row" style={{justifyContent: 'space-between'}}>
              <div>
                <div style={{fontWeight: 700}}>{job.title}</div>
                {job.headline ? <div className="muted" style={{fontSize: 13}}>{job.headline}</div> : null}
              </div>
              <span className="pill">{job.role.replace('_', ' ')}</span>
            </div>
            <div className="row" style={{marginTop: 6}}>
              {job.owner_name ? <span className="muted">By {job.owner_name}</span> : null}
              {job.location ? <span className="pill">{job.location}</span> : null}
              {job.work_style ? <span className="pill">{job.work_style}</span> : null}
              {job.timeline ? <span className="pill">{job.timeline}</span> : null}
              {job.compensation ? <span className="pill">{job.compensation}</span> : null}
            </div>
            <a className="button secondary" style={{marginTop: 12}} href={`/jobs/${job.id}`}>
              View job
            </a>
          </div>
        ))}
        {!jobs.length ? <div className="muted">No jobs posted yet.</div> : null}
      </div>
    </main>
  );
}
