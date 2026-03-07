import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
MOCK_DIR = BASE_DIR / "mock_data"


def load_mock(file_name: str):
    file_path = MOCK_DIR / file_name

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)