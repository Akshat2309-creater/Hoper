from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage

# Define the chat prompt template
chat_template = ChatPromptTemplate.from_messages([

    ('system', 'You are a helpful {domain} expert.'),
    ('human', 'Explain in simple terms, what is {topic}?')

])

# Invoke the template with actual values
prompt = chat_template.invoke({'domain': 'cricket', 'topic': 'Dusra'})

print(prompt)
