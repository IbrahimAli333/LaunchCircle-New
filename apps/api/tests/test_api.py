import os
import pathlib
import sys
from fastapi.testclient import TestClient

CURRENT_DIR = pathlib.Path(__file__).resolve()
API_DIR = CURRENT_DIR.parent.parent
sys.path.insert(0, str(API_DIR))

TEST_DB = pathlib.Path("test.db")
if TEST_DB.exists():
    TEST_DB.unlink()

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

import db  # noqa: E402
from main import app  # noqa: E402
from models import RoleType  # noqa: E402

db.init_db(seed=True)
client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_create_and_fetch_user():
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "role": RoleType.job_seeker,
        "skills": ["Python", "APIs"],
        "headline": "API tester",
        "experience": "3 years QA",
        "looking_for_cofounder": False,
    }
    res = client.post("/api/users", json=payload)
    assert res.status_code == 201
    created = res.json()
    user_id = created["id"]
    assert created["name"] == payload["name"]
    detail = client.get(f"/api/users/{user_id}")
    assert detail.status_code == 200
    assert detail.json()["id"] == user_id


def test_profiles_search():
    res = client.get("/api/users", params={"role": RoleType.founder})
    assert res.status_code == 200
    users = res.json()
    assert isinstance(users, list)
    assert any(u["role"] == RoleType.founder for u in users)


def test_job_post_and_apply():
    job_payload = {
        "title": "QA Engineer",
        "headline": "Keep us stable",
        "description": "Write tests",
        "role": RoleType.software_engineer,
        "skills": ["Testing"],
        "timeline": "3 months",
        "compensation": "Hourly",
        "owner_id": 2,  # seeded job provider
    }
    res = client.post("/api/jobs", json=job_payload)
    assert res.status_code == 201
    job = res.json()
    job_id = job["id"]

    detail = client.get(f"/api/jobs/{job_id}")
    assert detail.status_code == 200
    assert detail.json()["id"] == job_id

    apply_payload = {"job_post_id": job_id, "applicant_id": 3, "cover_letter": "I can help."}
    res_apply = client.post(f"/api/jobs/{job_id}/apply", json=apply_payload)
    assert res_apply.status_code == 201
    app_json = res_apply.json()
    assert app_json["job_post_id"] == job_id
    assert app_json["applicant_id"] == 3


def test_auth_signup_and_login():
    signup_payload = {"name": "Login User", "email": "login@example.com", "password": "secret123", "role": RoleType.job_seeker}
    res_signup = client.post("/api/auth/signup", json=signup_payload)
    assert res_signup.status_code == 201
    login_payload = {"email": "login@example.com", "password": "secret123"}
    res_login = client.post("/api/auth/login", json=login_payload)
    assert res_login.status_code == 200
    assert "token" in res_login.json()
