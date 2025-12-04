const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBase}${path}`, {cache: 'no-store'});
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type User = {id: number; name: string; headline?: string | null; role: string; location?: string | null; skills?: string[]};
type Job = {id: number; title: string; headline?: string | null; role: string; location?: string | null; work_style?: string | null};

const activityFeed = [
  {author: 'Ava Chen', role: 'Founder', text: 'Opened a new role for a founding full-stack engineer.', time: '2h'},
  {author: 'Samira Patel', role: 'Software Engineer', text: 'Shipped design system refresh for pods.', time: '5h'},
  {author: 'Leo Martinez', role: 'Job Provider', text: 'Updated compensation for Backend Engineer (Payments).', time: '1d'},
];

export default async function Page() {
  const [users, jobs] = await Promise.all([fetchJson<User[]>('/api/users'), fetchJson<Job[]>('/api/jobs')]);
  const featuredUsers = (users ?? []).slice(0, 4);
  const featuredJobs = (jobs ?? []).slice(0, 4);

  return (
    <main className="stack">
      <section className="surface stack">
        <div className="page-heading">
          <div>
            <h2 style={{margin: 0}}>Your feed</h2>
            <p className="muted" style={{margin: '4px 0 0'}}>Lightweight, LinkedIn-style home for founders and builders.</p>
          </div>
          <div className="row">
            <a className="button secondary" href="/profiles/new">
              Create profile
            </a>
            <a className="button secondary" href="/jobs/new">
              Post a job
            </a>
          </div>
        </div>
        <div className="surface" style={{padding: 12, borderRadius: 12}}>
          <form action="/search" method="get" className="row" style={{width: '100%'}}>
            <input name="q" placeholder="Search people, roles, skills..." style={{flex: 1}} />
            <button className="button" type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="grid">
          <div className="card" style={{gridColumn: 'span 2', minWidth: 0}}>
            <div className="page-heading" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Recommended founders & developers</h3>
              <a className="nav-link" href="/profiles">
                View all
              </a>
            </div>
            <div className="grid">
              {featuredUsers.map((user) => (
                <div key={user.id} className="surface" style={{padding: 14}}>
                  <div className="row" style={{justifyContent: 'space-between'}}>
                    <div>
                      <div style={{fontWeight: 700}}>{user.name}</div>
                      {user.headline ? <div className="muted" style={{fontSize: 13}}>{user.headline}</div> : null}
                    </div>
                    <span className="pill">{user.role.replace('_', ' ')}</span>
                  </div>
                  {user.location ? <div className="muted" style={{marginTop: 6}}>{user.location}</div> : null}
                  <div className="row" style={{marginTop: 8}}>
                    {user.skills?.slice(0, 3).map((skill) => (
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
              {!featuredUsers.length && (
                <>
                  <div className="skeleton" style={{height: 120}} />
                  <div className="skeleton" style={{height: 120}} />
                </>
              )}
            </div>
          </div>

          <div className="card" style={{minWidth: 0}}>
            <div className="page-heading" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>People you may want to meet</h3>
              <div className="badge pulse">Signal-based</div>
            </div>
            <div className="stack">
              {(users ?? []).slice(2, 6).map((user) => (
                <div key={user.id} className="row" style={{justifyContent: 'space-between'}}>
                  <div>
                    <div style={{fontWeight: 700}}>{user.name}</div>
                    {user.headline ? <div className="muted" style={{fontSize: 13}}>{user.headline}</div> : null}
                  </div>
                  <a className="button ghost" href={`/profiles/${user.id}`}>
                    View
                  </a>
                </div>
              ))}
              {!(users ?? []).length ? <div className="muted">No recommendations yet.</div> : null}
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="card" style={{gridColumn: 'span 2', minWidth: 0}}>
            <div className="page-heading" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Recommended startup jobs</h3>
              <a className="nav-link" href="/jobs">
                View all jobs
              </a>
            </div>
            <div className="stack">
              {featuredJobs.map((job) => (
                <div key={job.id} className="surface" style={{padding: 12, borderRadius: 12}}>
                  <div className="row" style={{justifyContent: 'space-between'}}>
                    <div>
                      <div style={{fontWeight: 700}}>{job.title}</div>
                      {job.headline ? <div className="muted" style={{fontSize: 13}}>{job.headline}</div> : null}
                    </div>
                    <span className="pill">{job.role.replace('_', ' ')}</span>
                  </div>
                  {job.location ? <div className="muted" style={{marginTop: 6}}>{job.location}</div> : null}
                  <a className="button secondary" style={{marginTop: 10}} href={`/jobs/${job.id}`}>
                    View job
                  </a>
                </div>
              ))}
              {!featuredJobs.length ? <div className="muted">No jobs yet.</div> : null}
            </div>
          </div>

          <div className="card" style={{minWidth: 0}}>
            <div className="page-heading" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Startup opportunities near you</h3>
              <div className="badge">Location-based</div>
            </div>
            <div className="stack">
              {(jobs ?? []).slice(0, 4).map((job) => (
                <div key={job.id} className="row" style={{justifyContent: 'space-between'}}>
                  <div>
                    <div style={{fontWeight: 700}}>{job.title}</div>
                    {job.location ? <div className="muted" style={{fontSize: 13}}>{job.location}</div> : null}
                  </div>
                  <a className="button ghost" href={`/jobs/${job.id}`}>
                    Open
                  </a>
                </div>
              ))}
              {!(jobs ?? []).length ? <div className="muted">No nearby roles yet.</div> : null}
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="card" style={{gridColumn: 'span 2', minWidth: 0}}>
            <div className="page-heading" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Latest updates</h3>
              <div className="badge">Live</div>
            </div>
            <div className="stack">
              {activityFeed.map((item) => (
                <div key={item.author} className="surface" style={{padding: 12, borderRadius: 12}}>
                  <div className="row" style={{justifyContent: 'space-between'}}>
                    <div>
                      <div style={{fontWeight: 700}}>{item.author}</div>
                      <div className="muted" style={{fontSize: 13}}>{item.role}</div>
                    </div>
                    <span className="muted">{item.time}</span>
                  </div>
                  <p style={{margin: '8px 0 0'}}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{minWidth: 0}}>
            <div className="page-heading" style={{marginBottom: 10}}>
              <h3 style={{margin: 0}}>Quick actions</h3>
            </div>
            <div className="stack">
              <a className="button secondary" href="/profiles/new">
                Complete your profile
              </a>
              <a className="button secondary" href="/jobs/new">
                Post a new role
              </a>
              <a className="button secondary" href="/search">
                Find founders & roles
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
