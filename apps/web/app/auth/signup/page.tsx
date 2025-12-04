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

export default function SignupPage() {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      password: form.get('password'),
      role: form.get('role'),
    };
    setStatus('Creating account...');
    const res = await fetch(`${apiBase}/api/auth/signup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      window.location.href = `/profiles/${data.user.id}`;
    } else {
      const err = await res.json();
      setStatus(err.detail ?? 'Could not sign up');
    }
  };

  return (
    <main className="stack surface">
      <div className="page-heading">
        <div>
          <div className="badge">Sign up</div>
          <h2 style={{margin: '6px 0'}}>Join LaunchCircle</h2>
          <p className="muted" style={{margin: 0}}>Pick your role to tailor recommendations.</p>
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
            <input name="email" type="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" required placeholder="••••••••" />
          </label>
          <label>
            Role
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
        </div>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="muted">{status}</span>
          <button className="button" type="submit">
            Create account
          </button>
        </div>
        <p className="muted">
          Already have an account? <a href="/auth/login">Log in</a>
        </p>
      </form>
    </main>
  );
}
