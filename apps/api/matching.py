# Simple founder-matching based on shared skills and interests.
from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from models import User
from schemas import MatchSuggestionOut
from utils import normalize_tokens, split_csv


def find_user_matches(db: Session, user_id: int, limit: int = 10) -> List[MatchSuggestionOut]:
    subject = db.get(User, user_id)
    if not subject:
        return []

    candidates = db.execute(select(User).where(User.id != user_id)).scalars().unique().all()
    scored = []
    for candidate in candidates:
        score = _score_candidate(subject, candidate)
        if score > 0:
            scored.append((score, candidate))

    scored.sort(key=lambda item: item[0], reverse=True)
    top_matches = scored[:limit]

    return [
        MatchSuggestionOut(
            user_id=user.id,
            name=user.name,
            headline=user.headline,
            founder_type=user.founder_type,
            stage_preference=user.stage_preference,
            time_zone=user.time_zone,
            commitment_level=user.commitment_level,
            skills=user.skills,
            looking_for=user.looking_for,
            match_score=score,
        )
        for score, user in top_matches
    ]


def _score_candidate(subject: User, candidate: User) -> int:
    subject_skills = set(normalize_tokens(split_csv(subject.skills)))
    candidate_skills = set(normalize_tokens(split_csv(candidate.skills)))
    skills_score = _overlap_score(subject_skills, candidate_skills, weight=60)

    subject_interests = set(normalize_tokens(split_csv(subject.looking_for)))
    candidate_interests = set(normalize_tokens(split_csv(candidate.looking_for)))
    interests_score = _overlap_score(subject_interests, candidate_interests, weight=40)

    total = skills_score + interests_score
    return min(100, total)


def _overlap_score(a: set[str], b: set[str], weight: int) -> int:
    if not a or not b:
        return 0
    overlap = len(a & b)
    denominator = max(len(a), len(b))
    fraction = overlap / denominator
    return int(fraction * weight)
