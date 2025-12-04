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

export default function NewProfilePage() {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const skills = (form.get('skills') as string)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      profile_photo: form.get('profile_photo'),
      headline: form.get('headline'),
      bio: form.get('bio'),
      experience: form.get('experience'),
      startups: form.get('startups'),
      portfolio: (form.get('portfolio') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      resume_url: form.get('resume_url'),
      looking_for_cofounder: Boolean(form.get('looking_for_cofounder')),
      availability: form.get('availability'),
      skills,
      location: form.get('location'),
      time_zone: form.get('time_zone'),
      role: form.get('role'),
      preferences: {
        work_style: form.get('work_style') || undefined,
        availability: form.get('availability') || undefined,
      },
    };

    setStatus('Saving...');
    const res = await fetch(`${apiBase}/api/users`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const user = await res.json();
      window.location.href = `/profiles/${user.id}`;
    } else {
      const err = await res.json();
      setStatus(err.detail ?? 'Something went wrong');
    }
  };

  return (
    <main className="stack surface">
      <div className="page-heading">
        <div>
          <div className="badge">Profile</div>
          <h2 style={{margin: '6px 0'}}>Create your profile</h2>
          <p className="muted" style={{margin: 0}}>Keep it short and LinkedIn-simple.</p>
        </div>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name
            <input name="name" required placeholder="Your name" />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" />
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
            Profile photo URL
            <input name="profile_photo" placeholder="https://..." />
          </label>
          <label>
            Location
            <input name="location" placeholder="City, Country" />
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
        </div>
        <label>
          Headline
          <input name="headline" placeholder="Software Engineer, Product Manager, etc." />
        </label>
        <label>
          Bio / About
          <textarea name="bio" placeholder="Short summary about you" />
        </label>
        <label>
          Experience
          <textarea name="experience" placeholder="Years, highlights, domains" />
        </label>
        <label>
          Startups worked on
          <textarea name="startups" placeholder="Names / roles" />
        </label>
        <label>
          Skills (comma separated)
          <input name="skills" placeholder="React, Python, Product design" />
        </label>
        <label>
          Portfolio links (comma separated)
          <input name="portfolio" placeholder="https://github.com/you, https://yourportfolio.com" />
        </label>
        <label>
          Resume URL (optional)
          <input name="resume_url" placeholder="https://..." />
        </label>
        <label className="row" style={{alignItems: 'center'}}>
          <input type="checkbox" name="looking_for_cofounder" /> Looking for a co-founder
        </label>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="muted">{status}</span>
          <button className="button" type="submit">
            Save profile
          </button>
        </div>
      </form>
    </main>
  );
}
