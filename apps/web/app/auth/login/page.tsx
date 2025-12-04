"use client";

import {FormEvent, useState} from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export default function LoginPage() {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      email: form.get('email'),
      password: form.get('password'),
    };
    setStatus('Signing in...');
    const res = await fetch(`${apiBase}/api/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      window.location.href = `/profiles/${data.user.id}`;
    } else {
      const err = await res.json();
      setStatus(err.detail ?? 'Invalid credentials');
    }
  };

  return (
    <main className="stack surface">
      <div className="page-heading">
        <div>
          <div className="badge">Login</div>
          <h2 style={{margin: '6px 0'}}>Welcome back</h2>
          <p className="muted" style={{margin: 0}}>Keep building with your network.</p>
        </div>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input name="password" type="password" required placeholder="••••••••" />
        </label>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="muted">{status}</span>
          <button className="button" type="submit">
            Login
          </button>
        </div>
        <div className="row" style={{justifyContent: 'space-between'}}>
          <a href="/auth/signup" className="nav-link">
            Create account
          </a>
          <a href="/auth/forgot" className="nav-link">
            Forgot password?
          </a>
        </div>
      </form>
    </main>
  );
}
