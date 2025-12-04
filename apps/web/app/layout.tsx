import './globals.css';
import React from 'react';

export const metadata = {
  title: 'LaunchCircle',
  description: 'Simple profiles and jobs for builders.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <nav className="nav">
            <div className="row" style={{gap: 12}}>
              <div className="brand">LaunchCircle</div>
              <a className="nav-link" href="/">Home</a>
              <a className="nav-link" href="/profiles">People</a>
              <a className="nav-link" href="/jobs">Jobs</a>
              <a className="nav-link" href="/search">Search</a>
            </div>
            <div className="row" style={{gap: 8}}>
              <a className="button ghost" href="/auth/login">
                Login
              </a>
              <a className="button" href="/auth/signup">
                Sign up
              </a>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
