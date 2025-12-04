"use client";

import {FormEvent, useState} from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export default function ApplyForm({jobId}: {jobId: number}) {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      job_post_id: jobId,
      applicant_id: Number(form.get('applicant_id')),
      cover_letter: form.get('cover_letter'),
    };
    setStatus('Submitting...');
    const res = await fetch(`${apiBase}/api/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus('Applied');
      e.currentTarget.reset();
    } else {
      const err = await res.json();
      setStatus(err.detail ?? 'Something went wrong');
    }
  };

  return (
    <section className="surface stack">
      <div className="page-heading" style={{marginBottom: 8}}>
        <div>
          <div className="badge">Apply</div>
          <h3 style={{margin: '6px 0'}}>Send a quick application</h3>
          <p className="muted" style={{margin: 0}}>Enter your user ID (from your profile) and a short note.</p>
        </div>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Your user ID
          <input name="applicant_id" required type="number" placeholder="e.g. 3" />
        </label>
        <label>
          Cover letter / note
          <textarea name="cover_letter" placeholder="Brief note, availability, links" />
        </label>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="muted">{status}</span>
          <button className="button" type="submit">
            Apply
          </button>
        </div>
      </form>
    </section>
  );
}
