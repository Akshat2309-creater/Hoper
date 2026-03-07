# from langchain_openai import ChatOpenAI
# from dotenv import load_dotenv
# from langchain_core.prompts import PromptTemplate
# from langchain_core.output_parsers import StrOutputParser
# from langchain_core.output_parsers import PydanticOutputParser  
# from pydantic import BaseModel, Field
# from typing import Literal
# from langchain.schema.runnable import RunnableParallel, RunnableBranch, RunnableLambda

# load_dotenv()

# model = ChatOpenAI()
# parser = StrOutputParser()


# class Feedback(BaseModel):
#     sentiment: Literal['positive','negative'] = Field(description="Give the Sentiment of the Feedback")

# parser2 = PydanticOutputParser(pydantic_object=Feedback)

# prompt1 = PromptTemplate(
#     template="Classify the sentiment of the following feedback text into positive or negative \n {feedback} \n {format_instruction}",
#     input_variables = ['feedback'],
#     partial_variables={'format_instruction': parser2.get_format_instructions()}
# )


# prompt2 = PromptTemplate(
#     template="Write an appropriate response to this positive feedback \n {feedback}",
#     input_variables = ['feedback']
# )

# prompt3 = PromptTemplate(
#     template="Write an appropriate response to this Negative feedback \n {feedback}",
#     input_variables = ['feedback']
# )

# classifier_chain = prompt1 | model | parser2

# branch_chain = RunnableBranch(
#     (lambda x :x['sentiment']=='positive', prompt2 | model | parser),
#     (lambda x :x['sentiment']=='negative', prompt3 | model | parser),
#     RunnableLambda(lambda x: "Could not find sentiment, Maybe its neutral")
# )

# chain = classifier_chain | branch_chain
# print(chain.invoke({'feedback': 'this is a terrible phone'}))


from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from pydantic import BaseModel, Field
from typing import Literal
from langchain.schema.runnable import RunnableBranch, RunnableLambda

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = StrOutputParser()

class Feedback(BaseModel):
    sentiment: Literal["positive", "negative"] = Field(
        description="Give the Sentiment of the Feedback"
    )

parser2 = PydanticOutputParser(pydantic_object=Feedback)

prompt1 = PromptTemplate(
    template=(
        "Classify the sentiment of the following feedback text into positive or negative:\n"
        "{feedback}\n{format_instruction}"
    ),
    input_variables=["feedback"],
    partial_variables={"format_instruction": parser2.get_format_instructions()},
)

prompt2 = PromptTemplate(
    template="Write an appropriate response to this positive feedback:\n{feedback}",
    input_variables=["feedback"],
)

prompt3 = PromptTemplate(
    template="Write an appropriate response to this negative feedback:\n{feedback}",
    input_variables=["feedback"],
)

classifier_chain = prompt1 | model | parser2

branch_chain = RunnableBranch(
    (lambda x: x.sentiment == "positive", prompt2 | model | parser),
    (lambda x: x.sentiment == "negative", prompt3 | model | parser),
    RunnableLambda(lambda x: "Could not find sentiment, maybe it's neutral")
)

chain = classifier_chain | branch_chain

print(chain.invoke({"feedback": "this is a best phone"}))
