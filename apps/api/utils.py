# Helper utilities for parsing and normalizing list-like fields.
from typing import Iterable, List


def split_csv(value: str | None) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item and item.strip()]


def join_csv(items: Iterable[str] | None) -> str:
    if not items:
        return ""
    return ",".join(str(item).strip() for item in items if item and str(item).strip())


def normalize_tokens(items: Iterable[str] | None) -> List[str]:
    return [token.strip().lower() for token in items or [] if token and str(token).strip()]
