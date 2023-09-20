from langchain.chat_models import ChatOpenAI

try:
    from secret_api_keys import OPEN_AI_API_KEY
except ModuleNotFoundError:
    OPEN_AI_API_KEY = None



def get_llm(model: str, temperature=0):
    if OPEN_AI_API_KEY is None:
        return None
    # imports the open ai model into langchain
    # temperature of 0 means the responses will be less varied (which we want)
    # model is set to gpt 3.5
    llm = ChatOpenAI(
        openai_api_key=OPEN_AI_API_KEY, temperature=temperature, model=model
    )
    return llm
