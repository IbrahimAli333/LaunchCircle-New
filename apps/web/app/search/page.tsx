const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

type User = {id: number; name: string; headline?: string | null; role: string; location?: string | null; availability?: string | null; skills: string[]};
type Job = {id: number; title: string; role: string; headline?: string | null; location?: string | null; work_style?: string | null};

async function fetchUsers(params: URLSearchParams): Promise<User[]> {
  try {
    const res = await fetch(`${apiBase}/api/users?${params.toString()}`, {cache: 'no-store'});
    if (!res.ok) return [];
    return (await res.json()) as User[];
  } catch {
    return [];
  }
}

async function fetchJobs(params: URLSearchParams): Promise<Job[]> {
  try {
    const res = await fetch(`${apiBase}/api/jobs?${params.toString()}`, {cache: 'no-store'});
    if (!res.ok) return [];
    return (await res.json()) as Job[];
  } catch {
    return [];
  }
}

export default async function SearchPage({searchParams}: {searchParams: Record<string, string | string[] | undefined>}) {
  const params = new URLSearchParams();
  if (searchParams.role && typeof searchParams.role === 'string') params.set('role', searchParams.role);
  if (searchParams.skills && typeof searchParams.skills === 'string') params.append('skills', searchParams.skills);
  if (searchParams.location && typeof searchParams.location === 'string') params.set('location', searchParams.location);
  if (searchParams.availability && typeof searchParams.availability === 'string') params.set('availability', searchParams.availability);
  if (searchParams.experience && typeof searchParams.experience === 'string') params.set('experience', searchParams.experience);

  const [users, jobs] = await Promise.all([fetchUsers(params), fetchJobs(params)]);

  return (
    <main className="stack surface">
      <div className="page-heading" style={{marginBottom: 8}}>
        <div>
          <div className="badge">Search</div>
          <h2 style={{margin: '6px 0'}}>Find founders, developers, and roles</h2>
          <p className="muted" style={{margin: 0}}>Filter by role, skills, location, and availability.</p>
        </div>
      </div>
      <form className="form-grid" method="get" style={{marginBottom: 12}}>
        <label>
          Role
          <input name="role" placeholder="founder, software_engineer" defaultValue={typeof searchParams.role === 'string' ? searchParams.role : ''} />
        </label>
        <label>
          Skills (comma)
          <input name="skills" placeholder="React, Python" defaultValue={typeof searchParams.skills === 'string' ? searchParams.skills : ''} />
        </label>
        <label>
          Location
          <input name="location" placeholder="Remote, SF, NYC" defaultValue={typeof searchParams.location === 'string' ? searchParams.location : ''} />
        </label>
        <label>
          Availability
          <input name="availability" placeholder="Full-time, part-time" defaultValue={typeof searchParams.availability === 'string' ? searchParams.availability : ''} />
        </label>
        <label>
          Experience
          <input name="experience" placeholder="backend, design" defaultValue={typeof searchParams.experience === 'string' ? searchParams.experience : ''} />
        </label>
        <div className="row" style={{alignItems: 'flex-end'}}>
          <button className="button" type="submit">
            Search
          </button>
          <a className="button secondary" href="/search">
            Clear
          </a>
        </div>
      </form>

      <div className="grid">
        <div className="card">
          <div className="page-heading" style={{marginBottom: 8}}>
            <h3 style={{margin: 0}}>People</h3>
            <span className="pill">{users.length}</span>
          </div>
          <div className="stack">
            {users.map((user) => (
              <div key={user.id} className="surface" style={{padding: 12, borderRadius: 12}}>
                <div className="row" style={{justifyContent: 'space-between'}}>
                  <div>
                    <div style={{fontWeight: 700}}>{user.name}</div>
                    {user.headline ? <div className="muted" style={{fontSize: 13}}>{user.headline}</div> : null}
                  </div>
                  <span className="pill">{user.role.replace('_', ' ')}</span>
                </div>
                <div className="row" style={{marginTop: 6}}>
                  {user.location ? <span className="pill">{user.location}</span> : null}
                  {user.availability ? <span className="pill">{user.availability}</span> : null}
                </div>
                <div className="row" style={{marginTop: 6}}>
                  {user.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="pill">
                      {skill}
                    </span>
                  ))}
                </div>
                <a className="button secondary" style={{marginTop: 10}} href={`/profiles/${user.id}`}>
                  View profile
                </a>
              </div>
            ))}
            {!users.length ? <div className="muted">No people found.</div> : null}
          </div>
        </div>

        <div className="card">
          <div className="page-heading" style={{marginBottom: 8}}>
            <h3 style={{margin: 0}}>Jobs</h3>
            <span className="pill">{jobs.length}</span>
          </div>
          <div className="stack">
            {jobs.map((job) => (
              <div key={job.id} className="surface" style={{padding: 12, borderRadius: 12}}>
                <div className="row" style={{justifyContent: 'space-between'}}>
                  <div>
                    <div style={{fontWeight: 700}}>{job.title}</div>
                    {job.headline ? <div className="muted" style={{fontSize: 13}}>{job.headline}</div> : null}
                  </div>
                  <span className="pill">{job.role.replace('_', ' ')}</span>
                </div>
                <div className="row" style={{marginTop: 6}}>
                  {job.location ? <span className="pill">{job.location}</span> : null}
                  {job.work_style ? <span className="pill">{job.work_style}</span> : null}
                </div>
                <a className="button secondary" style={{marginTop: 10}} href={`/jobs/${job.id}`}>
                  View job
                </a>
              </div>
            ))}
            {!jobs.length ? <div className="muted">No jobs found.</div> : null}
          </div>
        </div>
      </div>
    </main>
  );
}
