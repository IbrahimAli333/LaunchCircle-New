"use client";

import {FormEvent, useEffect, useState} from 'react';
import {useParams} from 'next/navigation';

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
  preferences?: Record<string, string> | null;
};

export default function EditProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${apiBase}/api/users/${id}`, {cache: 'no-store'});
      if (res.ok) {
        const data = (await res.json()) as UserProfile;
        setUser(data);
        setStatus('');
      } else {
        setStatus('Could not load profile');
      }
    };
    if (id) load();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    const skills = (form.get('skills') as string)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.get('name') || undefined,
      email: form.get('email') || undefined,
      profile_photo: form.get('profile_photo') || undefined,
      headline: form.get('headline') || undefined,
      bio: form.get('bio') || undefined,
      experience: form.get('experience') || undefined,
      startups: form.get('startups') || undefined,
      portfolio: (form.get('portfolio') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      resume_url: form.get('resume_url') || undefined,
      looking_for_cofounder: form.get('looking_for_cofounder') === 'on' ? true : undefined,
      availability: form.get('availability') || undefined,
      skills: skills.length ? skills : undefined,
      location: form.get('location') || undefined,
      time_zone: form.get('time_zone') || undefined,
      role: form.get('role') || undefined,
      preferences: {
        work_style: form.get('work_style') || undefined,
        availability: form.get('availability') || undefined,
      },
    };

    setStatus('Saving...');
    const res = await fetch(`${apiBase}/api/users/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      window.location.href = `/profiles/${id}`;
    } else {
      const err = await res.json();
      setStatus(err.detail ?? 'Something went wrong');
    }
  };

  if (!user) {
    return (
      <main className="surface">
        <p className="muted">{status}</p>
      </main>
    );
  }

  return (
    <main className="stack surface">
      <div className="page-heading">
        <div>
          <div className="badge">Profile</div>
          <h2 style={{margin: '6px 0'}}>Edit profile</h2>
          <p className="muted" style={{margin: 0}}>Keep it short and LinkedIn-simple.</p>
        </div>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name
            <input name="name" defaultValue={user.name} required />
          </label>
          <label>
            Email
            <input name="email" type="email" defaultValue={user.email ?? ''} />
          </label>
          <label>
            Role type
            <select name="role" defaultValue={user.role} required>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>
          <label>
            Profile photo URL
            <input name="profile_photo" defaultValue={user.profile_photo ?? ''} />
          </label>
          <label>
            Location
            <input name="location" defaultValue={user.location ?? ''} />
          </label>
          <label>
            Time zone
            <input name="time_zone" defaultValue={user.time_zone ?? ''} />
          </label>
          <label>
            Work style
            <input name="work_style" defaultValue={user.preferences?.work_style ?? ''} />
          </label>
          <label>
            Availability
            <input name="availability" defaultValue={user.preferences?.availability ?? ''} />
          </label>
        </div>
        <label>
          Headline
          <input name="headline" defaultValue={user.headline ?? ''} />
        </label>
        <label>
          Bio / About
          <textarea name="bio" defaultValue={user.bio ?? ''} />
        </label>
        <label>
          Experience
          <textarea name="experience" defaultValue={user.experience ?? ''} />
        </label>
        <label>
          Startups worked on
          <textarea name="startups" defaultValue={user.startups ?? ''} />
        </label>
        <label>
          Skills (comma separated)
          <input name="skills" defaultValue={user.skills?.join(', ') ?? ''} />
        </label>
        <label>
          Portfolio links (comma separated)
          <input name="portfolio" defaultValue={user.portfolio?.join(', ') ?? ''} />
        </label>
        <label>
          Resume URL (optional)
          <input name="resume_url" defaultValue={user.resume_url ?? ''} />
        </label>
        <label className="row" style={{alignItems: 'center'}}>
          <input type="checkbox" name="looking_for_cofounder" defaultChecked={user.looking_for_cofounder} /> Looking for a co-founder
        </label>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="muted">{status}</span>
          <button className="button" type="submit">
            Save changes
          </button>
        </div>
      </form>
    </main>
  );
}
