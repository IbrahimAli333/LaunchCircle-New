import {notFound} from 'next/navigation';

type UserProfile = {
  id: number;
  name: string;
  email?: string | null;
  profile_photo?: string | null;
  headline?: string | null;
  bio?: string | null;
  experience?: string | null;
  startups?: string | null;
  portfolio?: string[] | null;
  resume_url?: string | null;
  looking_for_cofounder?: boolean;
  availability?: string | null;
  role: string;
  skills: string[];
  location?: string | null;
  time_zone?: string | null;
  preferences?: Record<string, unknown> | null;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

async function fetchUser(id: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${apiBase}/api/users/${id}`, {cache: 'no-store'});
    if (!res.ok) return null;
    return (await res.json()) as UserProfile;
  } catch {
    return null;
  }
}

export default async function ProfilePage({params}: {params: {id: string}}) {
  const user = await fetchUser(params.id);
  if (!user) return notFound();

  return (
    <main className="stack">
      <div className="surface stack">
        <div className="page-heading" style={{marginBottom: 6}}>
          <div className="row" style={{alignItems: 'flex-start'}}>
            {user.profile_photo ? (
              <img src={user.profile_photo} alt="" style={{width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)'}} />
            ) : (
              <div style={{width: 64, height: 64, borderRadius: '50%', background: 'var(--muted-surface)', display: 'grid', placeItems: 'center', fontWeight: 700}}>
                {user.name.slice(0, 1)}
              </div>
            )}
            <div>
              <div className="badge" style={{marginBottom: 6}}>{user.role.replace('_', ' ')}</div>
              <h1 style={{margin: '0 0 4px'}}>{user.name}</h1>
              {user.headline ? <p className="muted" style={{margin: 0}}>{user.headline}</p> : null}
              <div className="row" style={{marginTop: 8}}>
                {user.location ? <span className="pill">{user.location}</span> : null}
                {user.time_zone ? <span className="pill">{user.time_zone}</span> : null}
                {user.availability ? <span className="pill">{user.availability}</span> : null}
                {user.email ? <span className="pill">{user.email}</span> : null}
                {user.looking_for_cofounder ? <span className="pill">Looking for co-founder</span> : null}
              </div>
            </div>
          </div>
          <div className="row">
            <a className="button secondary" href={`/profiles/${user.id}/edit`}>Edit profile</a>
            <a className="button secondary" href="/jobs">Browse jobs</a>
          </div>
        </div>

        <div>
          <h3 style={{margin: '0 0 6px'}}>About</h3>
          <div className="surface" style={{marginTop: 8}}>
            {user.bio ? <p style={{margin: 0, lineHeight: 1.5}}>{user.bio}</p> : <p className="muted" style={{margin: 0}}>No bio yet.</p>}
          </div>
        </div>

        <div>
          <h3 style={{margin: '0 0 6px'}}>Experience</h3>
          <div className="surface" style={{marginTop: 8}}>
            {user.experience ? <p style={{margin: 0, lineHeight: 1.5}}>{user.experience}</p> : <p className="muted" style={{margin: 0}}>No experience added.</p>}
          </div>
        </div>

        <div>
          <h3 style={{margin: '0 0 6px'}}>Startups</h3>
          <div className="surface" style={{marginTop: 8}}>
            {user.startups ? <p style={{margin: 0, lineHeight: 1.5}}>{user.startups}</p> : <p className="muted" style={{margin: 0}}>No startup history yet.</p>}
          </div>
        </div>

        <div>
          <h3 style={{margin: '0 0 6px'}}>Skills</h3>
          <div className="surface" style={{marginTop: 8}}>
            {user.skills?.length ? (
              <div className="row">
                {user.skills.map((skill) => (
                  <span key={skill} className="pill">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted" style={{margin: 0}}>No skills listed.</p>
            )}
          </div>
        </div>

        <div>
          <h3 style={{margin: '0 0 6px'}}>Portfolio & resume</h3>
          <div className="surface" style={{marginTop: 8}}>
            <div className="row">
              {user.portfolio?.length
                ? user.portfolio.map((link) => (
                    <a key={link} className="pill" href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  ))
                : null}
              {user.resume_url ? (
                <a className="pill" href={user.resume_url} target="_blank" rel="noreferrer">
                  Resume
                </a>
              ) : null}
              {!user.portfolio?.length && !user.resume_url ? <p className="muted" style={{margin: 0}}>No links yet.</p> : null}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{margin: '0 0 6px'}}>Preferences</h3>
          <div className="surface" style={{marginTop: 8}}>
            {user.preferences ? <pre style={{margin: 0, whiteSpace: 'pre-wrap'}}>{JSON.stringify(user.preferences, null, 2)}</pre> : <p className="muted" style={{margin: 0}}>No preferences saved.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
