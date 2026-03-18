import time
import logging

logger = logging.getLogger("ai_logger")
logging.basicConfig(level=logging.INFO)


def truncate(text: str, max_length: int = 500):
    if not text:
        return text
    return text[:max_length] + "...[truncated]" if len(text) > max_length else text


def log_ai_request(request_id: str, prompt: str):
    logger.info({
        "event": "OPENAI_REQUEST",
        "requestId": request_id,
        "prompt": truncate(prompt),
    })


def log_ai_response(request_id: str, response: str, duration: float, tokens: int):
    logger.info({
        "event": "OPENAI_RESPONSE",
        "requestId": request_id,
        "duration": duration,
        "tokens": tokens,
        "response": truncate(response),
    })


def log_ai_error(request_id: str, error: str):
    logger.error({
        "event": "OPENAI_ERROR",
        "requestId": request_id,
        "error": error,
    })