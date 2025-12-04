import ApplyForm from './ApplyForm';
import {notFound} from 'next/navigation';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

type Job = {
  id: number;
  title: string;
  headline?: string | null;
  description?: string | null;
  role: string;
  skills: string[];
  location?: string | null;
  time_zone?: string | null;
  work_style?: string | null;
  availability?: string | null;
   timeline?: string | null;
   compensation?: string | null;
  owner_name?: string | null;
};

async function fetchJob(id: string): Promise<Job | null> {
  try {
    const res = await fetch(`${apiBase}/api/jobs/${id}`, {cache: 'no-store'});
    if (!res.ok) return null;
    return (await res.json()) as Job;
  } catch {
    return null;
  }
}

export default async function JobDetail({params}: {params: {id: string}}) {
  const job = await fetchJob(params.id);
  if (!job) return notFound();

  return (
    <main className="stack">
      <div className="surface stack">
        <div className="page-heading" style={{marginBottom: 6}}>
          <div>
            <div className="badge">Job</div>
            <h2 style={{margin: '6px 0'}}>{job.title}</h2>
            {job.headline ? <p className="muted" style={{margin: 0}}>{job.headline}</p> : null}
          </div>
          <span className="pill">{job.role.replace('_', ' ')}</span>
        </div>
          <div className="row">
            {job.owner_name ? <span className="pill">Posted by {job.owner_name}</span> : null}
            {job.location ? <span className="pill">{job.location}</span> : null}
            {job.work_style ? <span className="pill">{job.work_style}</span> : null}
            {job.availability ? <span className="pill">{job.availability}</span> : null}
            {job.time_zone ? <span className="pill">{job.time_zone}</span> : null}
            {job.timeline ? <span className="pill">{job.timeline}</span> : null}
            {job.compensation ? <span className="pill">{job.compensation}</span> : null}
          </div>
        <div>
          <h3 style={{margin: '12px 0 6px'}}>Description</h3>
          <div className="surface" style={{marginTop: 6}}>
            {job.description ? <p style={{margin: 0, lineHeight: 1.5}}>{job.description}</p> : <p className="muted" style={{margin: 0}}>No description provided.</p>}
          </div>
        </div>
        <div>
          <h3 style={{margin: '12px 0 6px'}}>Skills</h3>
          <div className="row">
            {job.skills?.length ? job.skills.map((skill) => <span key={skill} className="pill">{skill}</span>) : <span className="muted">No skills listed.</span>}
          </div>
        </div>
      </div>

      <ApplyForm jobId={job.id} />
    </main>
  );
}
