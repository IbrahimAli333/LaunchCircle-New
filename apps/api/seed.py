# Seed helpers to populate the database with demo data for LaunchCircle.
from sqlalchemy.orm import Session
from models import ApplicationStatus, JobApplication, JobPost, RoleType, User
from utils import join_csv


def seed_database(session: Session) -> None:
    if session.query(User).first():
        return

    users = [
        User(
            name="Ava Chen",
            email="ava@launchcircle.dev",
            role=RoleType.founder,
            headline="Founder | Building curated talent pods",
            bio="Ex-Stripe PM building better ways to match founders and operators.",
            experience="5+ years PM @ Stripe, led ops tooling.",
            startups="LaunchCircle",
            portfolio=join_csv(["https://launchcircle.dev"]),
            resume_url="https://example.com/resume/ava",
            looking_for_cofounder=True,
            availability="full-time",
            skills=join_csv(["Product strategy", "GTM", "Fundraising"]),
            location="San Francisco, CA",
            time_zone="America/Los_Angeles",
            preferences={"work_style": "hybrid"},
        ),
        User(
            name="Leo Martinez",
            email="leo@launchcircle.dev",
            role=RoleType.job_provider,
            headline="Hiring for AI invoicing startup",
            bio="Fintech engineer turned founder focused on automating billing.",
            experience="7 years backend/payments.",
            startups="Invoice Co-Pilot",
            portfolio=join_csv(["https://invoice-copilot.com"]),
            resume_url=None,
            looking_for_cofounder=False,
            availability="full-time",
            skills=join_csv(["Python", "Fintech", "Data pipelines"]),
            location="New York, NY",
            time_zone="America/New_York",
            preferences={"availability": "full-time"},
        ),
        User(
            name="Samira Patel",
            email="samira@launchcircle.dev",
            role=RoleType.software_engineer,
            headline="Full-stack engineer, design systems nerd",
            bio="Ship fast with TypeScript, React, and great UX taste.",
            experience="6 years frontend/full-stack.",
            startups="DesignOps, StudioX",
            portfolio=join_csv(["https://samira.dev"]),
            resume_url="https://example.com/resume/samira",
            looking_for_cofounder=False,
            availability="full-time",
            skills=join_csv(["Next.js", "React", "TypeScript", "Design systems"]),
            location="Los Angeles, CA",
            time_zone="America/Los_Angeles",
            preferences={"availability": "full-time"},
        ),
        User(
            name="Jonah Reed",
            email="jonah@launchcircle.dev",
            role=RoleType.job_seeker,
            headline="Backend + data infra",
            bio="Enjoy hard backend problems, observability, and data streaming.",
            experience="5 years backend/data infra.",
            startups="DataPulse",
            portfolio=join_csv(["https://jonahreed.dev"]),
            resume_url=None,
            looking_for_cofounder=False,
            availability="part-time",
            skills=join_csv(["FastAPI", "Postgres", "Redis", "Streaming"]),
            location="Chicago, IL",
            time_zone="America/Chicago",
            preferences={"availability": "part-time"},
        ),
    ]

    session.add_all(users)
    session.flush()

    job_posts = [
        JobPost(
            title="Founding Full-Stack Engineer",
            headline="Build the talent pods experience end-to-end",
            description="Ship the founder dashboard, onboarding, and matching flows.",
            role=RoleType.software_engineer,
            skills=join_csv(["Next.js", "FastAPI"]),
            location="Remote",
            time_zone="Flexible",
            work_style="remote",
            availability="full-time",
            timeline="6 months",
            compensation="Equity + stipend",
            owner_id=users[0].id,
        ),
        JobPost(
            title="Backend Engineer (Payments)",
            headline="Hardening payment workflows and reconciliation",
            description="Own payment workflows for AI invoicing product.",
            role=RoleType.software_engineer,
            skills=join_csv(["Python", "Postgres", "Payments"]),
            location="Hybrid NYC",
            time_zone="America/New_York",
            work_style="hybrid",
            availability="full-time",
            timeline="3-6 months",
            compensation="$120k-$160k + equity",
            owner_id=users[1].id,
        ),
    ]
    session.add_all(job_posts)
    session.flush()

    applications = [
        JobApplication(
            job_post_id=job_posts[0].id,
            applicant_id=users[2].id,
            cover_letter="Excited to ship the pod experience — deep Next.js experience.",
            status=ApplicationStatus.applied,
        )
    ]
    session.add_all(applications)
    session.commit()
