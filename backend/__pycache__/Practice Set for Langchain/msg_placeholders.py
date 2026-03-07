from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

#Chat template
chat_template = ChatPromptTemplate([
    ('system', 'You are  ahelpful cusotomer support agent'),
    MessagesPlaceholder(variable_name="chat_history"),
    ('human', '{query}')
])
chat_history = []
#Load chat history
with open('chat_history.txt') as f:
    chat_history.extend (f.readlines())
print(chat_history)


#Create Promptss

prompt = chat_template.invoke({'chat_history': chat_history, 'query':'Where is my refund'})
print(prompt)