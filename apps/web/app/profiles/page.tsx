const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

type User = {
  id: number;
  name: string;
  headline?: string | null;
  role: string;
  location?: string | null;
  skills: string[];
};

async function fetchUsers(searchParams: URLSearchParams): Promise<User[]> {
  try {
    const res = await fetch(`${apiBase}/api/users?${searchParams.toString()}`, {cache: 'no-store'});
    if (!res.ok) return [];
    return (await res.json()) as User[];
  } catch {
    return [];
  }
}

export default async function ProfilesPage({searchParams}: {searchParams: Record<string, string | string[] | undefined>}) {
  const params = new URLSearchParams();
  if (searchParams.role && typeof searchParams.role === 'string') params.set('role', searchParams.role);
  if (searchParams.location && typeof searchParams.location === 'string') params.set('location', searchParams.location);
  if (searchParams.skills && typeof searchParams.skills === 'string') params.append('skills', searchParams.skills);
  if (searchParams.availability && typeof searchParams.availability === 'string') params.set('availability', searchParams.availability);
  if (searchParams.experience && typeof searchParams.experience === 'string') params.set('experience', searchParams.experience);

  const users = await fetchUsers(params);
  return (
    <main className="stack surface">
      <div className="page-heading" style={{marginBottom: 8}}>
        <div>
          <div className="badge">People</div>
          <h2 style={{margin: '6px 0'}}>Browse profiles</h2>
          <p className="muted" style={{margin: 0}}>LinkedIn-simple cards with role, headline, and skills.</p>
        </div>
        <a className="button secondary" href="/profiles/new">
          Create profile
        </a>
      </div>
      <form className="form-grid" method="get" style={{marginBottom: 8}}>
        <label>
          Role
          <input name="role" placeholder="software_engineer" defaultValue={typeof searchParams.role === 'string' ? searchParams.role : ''} />
        </label>
        <label>
          Location
          <input name="location" placeholder="San Francisco" defaultValue={typeof searchParams.location === 'string' ? searchParams.location : ''} />
        </label>
        <label>
          Skills (comma separated)
          <input name="skills" placeholder="React, Product" defaultValue={typeof searchParams.skills === 'string' ? searchParams.skills : ''} />
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
          <button className="button secondary" type="submit">
            Filter
          </button>
          <a className="button secondary" href="/profiles">
            Clear
          </a>
        </div>
      </form>
      <div className="grid">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="row" style={{justifyContent: 'space-between'}}>
              <div>
                <div style={{fontWeight: 700}}>{user.name}</div>
                {user.headline ? <div className="muted" style={{fontSize: 13}}>{user.headline}</div> : null}
              </div>
              <span className="pill">{user.role.replace('_', ' ')}</span>
            </div>
            {user.location ? <div className="muted" style={{marginTop: 6}}>{user.location}</div> : null}
            <div className="row" style={{marginTop: 8}}>
              {user.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="pill">
                  {skill}
                </span>
              ))}
            </div>
            <a className="button secondary" style={{marginTop: 12}} href={`/profiles/${user.id}`}>
              View profile
            </a>
          </div>
        ))}
        {!users.length ? <div className="muted">No profiles yet.</div> : null}
      </div>
    </main>
  );
}
