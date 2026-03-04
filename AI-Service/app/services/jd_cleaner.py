import re


def clean_job_description(raw_text: str) -> str:
    text = raw_text

    # Remove HTML tags
    text = re.sub(r"<.*?>", "", text)

    # Remove bullet characters
    text = re.sub(r"[•▪●◦]", "", text)

    # Replace multiple newlines with single space
    text = re.sub(r"\n+", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()
