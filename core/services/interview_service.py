
import os
import json
import re

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from llm.services import prompts
from dotenv import load_dotenv

from company.models import QuestionBank

load_dotenv()

_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.7,
)


def get_questions(company, role):
    filters = {"role": role}
    if company:
        filters["role__company"] = company
    questions = QuestionBank.objects.filter(**filters).order_by('?')[:3]
    return list(questions)


def generate_interview(company, role):
    db_questions = get_questions(company, role)

    if not db_questions:
        return {"error": "No questions found for the given role."}

    reference_text = "\n".join(
        f"{i+1}. [{q.category} | {q.difficulty}] {q.question}"
        for i, q in enumerate(db_questions)
    )

    user_prompt = prompts.interview_generation_prompt.format(
        reference_questions=reference_text
    )

    response = _llm.invoke([
        SystemMessage(content="You are a JSON-only response assistant. Never use markdown."),
        HumanMessage(content=user_prompt),
    ])

    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.content.strip(), flags=re.DOTALL)
    return json.loads(cleaned)









# def start_interview(ques_obj):
    