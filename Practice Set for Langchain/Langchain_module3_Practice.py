from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

embedding = OpenAIEmbeddings(model= "text-embedding-3-large", dimensions=300)

document = [
    "Terrassen cafe is a  vegan cafe",
    "Maple and Basil is A resturant providing both Veg as well as Non-veg",
    "Virat Kohki is a Vegan"
]

query = "Tell me a cool vibe resturant that provided best food"

doc_embeddings= embedding.embed_documents(document)
query_embeddings = embedding.embed_query(query)

score = cosine_similarity([query_embeddings], doc_embeddings) [0]

index,score = sorted(list(enumerate(score)), key = lambda x:x[1])[-1]
print(query)    
print(document[index])
print(f"Similarity score is : {score}")