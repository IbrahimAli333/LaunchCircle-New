"use client";

import {FormEvent, useState} from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
const roles = [
  'founder',
  'software_developer',
  'software_engineer',
  'designer',
  'product_manager',
  'marketer',
  'growth',
  'sales',
  'operations',
  'job_seeker',
  'job_provider',
];

export default function NewJobPage() {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const skills = (form.get('skills') as string)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: form.get('title'),
      headline: form.get('headline'),
      description: form.get('description'),
      role: form.get('role'),
      skills,
      location: form.get('location'),
      time_zone: form.get('time_zone'),
      work_style: form.get('work_style'),
      availability: form.get('availability'),
      timeline: form.get('timeline'),
      compensation: form.get('compensation'),
      owner_id: Number(form.get('owner_id')),
    };

    setStatus('Posting...');
    const res = await fetch(`${apiBase}/api/jobs`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const job = await res.json();
      window.location.href = `/jobs/${job.id}`;
    } else {
      const err = await res.json();
      setStatus(err.detail ?? 'Something went wrong');
    }
  };

  return (
    <main className="stack surface">
      <div className="page-heading">
        <div>
          <div className="badge">Jobs</div>
          <h2 style={{margin: '6px 0'}}>Create a job post</h2>
          <p className="muted" style={{margin: 0}}>Only founders or job providers should post roles.</p>
        </div>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Title
            <input name="title" required placeholder="Founding Engineer" />
          </label>
          <label>
            Role type
            <select name="role" required defaultValue="">
              <option value="" disabled>
                Select role
              </option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>
          <label>
            Location
            <input name="location" placeholder="Remote, City" />
          </label>
          <label>
            Time zone
            <input name="time_zone" placeholder="America/Los_Angeles" />
          </label>
          <label>
            Work style
            <input name="work_style" placeholder="Remote, Hybrid, Onsite" />
          </label>
          <label>
            Availability
            <input name="availability" placeholder="Full-time, Part-time, Contract" />
          </label>
          <label>
            Timeline
            <input name="timeline" placeholder="3 months, 6 months" />
          </label>
          <label>
            Compensation (optional)
            <input name="compensation" placeholder="$120k, equity, hourly" />
          </label>
          <label>
            Owner user ID
            <input name="owner_id" type="number" required placeholder="Your user id" />
          </label>
        </div>
        <label>
          Headline
          <input name="headline" placeholder="Short hook for the role" />
        </label>
        <label>
          Description
          <textarea name="description" placeholder="What will this person do?" />
        </label>
        <label>
          Skills (comma separated)
          <input name="skills" placeholder="Next.js, API design, Product" />
        </label>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="muted">{status}</span>
          <button className="button" type="submit">
            Post job
          </button>
        </div>
      </form>
    </main>
  );
}
