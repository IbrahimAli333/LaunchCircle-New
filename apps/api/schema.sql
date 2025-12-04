-- SQL schema for LaunchCircle demo (Postgres compatible) focused on profiles and jobs.
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE,
  profile_photo VARCHAR(255),
  headline VARCHAR(255),
  bio TEXT,
  skills TEXT,
  location VARCHAR(120),
  time_zone VARCHAR(80),
  role VARCHAR(40) NOT NULL,
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS job_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  headline VARCHAR(255),
  description TEXT,
  role VARCHAR(40) NOT NULL,
  skills TEXT,
  location VARCHAR(120),
  time_zone VARCHAR(80),
  work_style VARCHAR(60),
  availability VARCHAR(80),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  job_post_id INTEGER NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  applicant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(32) NOT NULL DEFAULT 'applied',
  cover_letter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
