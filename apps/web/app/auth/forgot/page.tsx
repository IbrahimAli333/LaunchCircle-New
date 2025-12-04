"use client";

import {FormEvent, useState} from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export default function ForgotPage() {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {email: form.get('email')};
    setStatus('Sending reset link...');
    const res = await fetch(`${apiBase}/api/auth/forgot`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus('Check your email for reset instructions.');
    } else {
      setStatus('Unable to send reset link.');
    }
  };

  return (
    <main className="stack surface">
      <div className="page-heading">
        <div>
          <div className="badge">Reset</div>
          <h2 style={{margin: '6px 0'}}>Forgot password</h2>
          <p className="muted" style={{margin: 0}}>We’ll send a reset link to your email.</p>
        </div>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="muted">{status}</span>
          <button className="button" type="submit">
            Send link
          </button>
        </div>
      </form>
    </main>
  );
}
