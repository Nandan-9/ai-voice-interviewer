
import os
import json
import re

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from llm.services import prompts
from dotenv import load_dotenv

load_dotenv()

_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.4,
    generation_config={
        "response_mime_type": "application/json",
        "max_output_tokens": 8192,
    },
)


def analyze_interview(questions, responses):
    interview_data = json.dumps({
        "questions": [
            {
                "id": q["id"],
                "question": q["question"],
                "category": q.get("category", ""),
                "difficulty": q.get("difficulty", ""),
                "response": next(
                    (r["response_text"] for r in responses if r["question_id"] == q["id"]),
                    ""
                ),
            }
            for q in questions
        ]
    }, indent=2)

    user_prompt = prompts.interview_analysis_prompt.format(interview_data=interview_data)

    response = _llm.invoke([
        SystemMessage(content="You are a JSON-only response assistant. Never use markdown."),
        HumanMessage(content=user_prompt),
    ])

    raw = response.content.strip()
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw, flags=re.DOTALL).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return _repair_and_parse(cleaned)


def _repair_and_parse(text: str) -> dict:
    # Extract the outermost {...} block
    start = text.find("{")
    if start == -1:
        raise ValueError("No JSON object found in LLM response")

    # Walk forward tracking open braces/brackets to find where the object ends
    # or patch it closed if the response was truncated
    depth_brace = 0
    depth_bracket = 0
    in_string = False
    escape = False
    end = len(text)

    for i, ch in enumerate(text[start:], start):
        if escape:
            escape = False
            continue
        if ch == "\\" and in_string:
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == "{":
            depth_brace += 1
        elif ch == "}":
            depth_brace -= 1
            if depth_brace == 0:
                end = i + 1
                break
        elif ch == "[":
            depth_bracket += 1
        elif ch == "]":
            depth_bracket -= 1

    fragment = text[start:end]

    # If still unbalanced (truncated response), close open structures
    if depth_brace > 0 or depth_bracket > 0:
        fragment = fragment.rstrip().rstrip(",")
        # Close any open string at the very end
        fragment = re.sub(r'"[^"]*\Z', '""', fragment, flags=re.DOTALL)
        fragment += "]" * depth_bracket + "}" * depth_brace

    return json.loads(fragment)
