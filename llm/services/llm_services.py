from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
import prompts
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

llm_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=GEMINI_API_KEY,
    temperature=0.7
)


class GeminiLLM:

    def chat(self, user_prompt):
        try:
            response = llm_model.invoke([
                SystemMessage(content=prompts.system_message),
                HumanMessage(content=user_prompt)
            ])

            return response.content

        except Exception as e:
            print("\nERROR:\n")
            print(type(e).__name__)
            print(e)

    def response_parser(self, response: str) -> dict:
        # Strip markdown code fences if present (```json ... ``` or ``` ... ```)
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", response.strip(), flags=re.DOTALL)
        parsed = json.loads(cleaned)
        return parsed.get("response", parsed)


llm = GeminiLLM()

response = llm.chat("what is Deep learning")
print(response)
print("-------------------------------------")
print(llm.response_parser(response))