
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

    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content.strip(), flags=re.DOTALL)
    return json.loads(cleaned)
