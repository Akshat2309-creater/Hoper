#Prompt -> LLM  -> LLM response display USING CHAINs

from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
prompt = PromptTemplate(
    template = 'Generate 5 intresting facts about {topic}',
    input_variables=['topic']
)

model = ChatOpenAI(model = 'gpt-5')

parser=StrOutputParser()

chain = prompt | model | parser

result = chain.invoke({'topic':'Love'})
print(result)

chain.get_graph().print_ascii()
