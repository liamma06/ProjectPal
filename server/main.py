from typing import Union, Dict, List, Annotated, TypedDict,Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage, AIMessage, SystemMessage
import uuid
import json
import re

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver


load_dotenv()
model = ChatAnthropic(
    model="claude-3-sonnet-20240229",
    temperature=0.7,
)

#input models
class Project_Idea(BaseModel):
    idea:str

#conversation model
class ConversationState(TypedDict):
    messages: List[Union[HumanMessage, AIMessage, SystemMessage]]
    original_idea: str
    generated_concept:str
    iteration: int
    conversation_id: str
    regeneration_attempts: int
    project_plan: Optional[str]
    verdict: Optional[str]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


conversation_graphs = {}

#concept generation 
def generate_concept(state:ConversationState):
    original_idea = state["original_idea"]

    concept_prompt = f"""Based on the user's general idea, create a unique and innovative project concept.
    
    User's idea: {original_idea}
    
    Generate a project concept that is:
    1. Unique and original
    2. Solves a real problem
    3. Has potential for implementation
    4. Contains a creative twist or angle
    
    Your response should be just the project concept itself, clearly and concisely stated in 2-3 sentences."""

    #send and store messages
    messages = state["messages"] + [HumanMessage(content=concept_prompt)]
    response = model.invoke(messages)

    return{
        "messages": messages + [AIMessage(content=response.content)],
        "generated_concept": response.content.strip(),
    }

#generate uniquness and validation
def validate_concept(state:ConversationState):
    concept = state["generated_concept"]

    validation_prompt = f"""Evaluate the following project concept for uniqueness and innovation:
    
    "{concept}"
    
    Score this concept on:
    1. Originality (1-10)
    2. Innovation (1-10)
    3. Differentiation from existing products (1-10)
    
    First, provide scores. Then analyze if this concept is truly unique or just a rehash of common ideas.
    
    End with a verdict: Either "UNIQUE" if the concept is sufficiently original (average score 7+), 
    or "RETRY" if it's too generic or similar to existing products.
    
    Format as a JSON object with keys: "originality", "innovation", "differentiation", "analysis", and "verdict"
    """

    #send and store messages
    messages = state["messages"] + [HumanMessage(content=validation_prompt)]
    response = model.invoke(messages)

    #getting json response
    json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
    if json_match:
        try:
            validation_result = json.loads(json_match.group(0))
            verdict = validation_result.get("verdict", "RETRY")
        except json.JSONDecodeError:
            verdict = "RETRY" 
    else:
        verdict = "RETRY"
    
    #state update 
    return{
        "messages":state["messages"] + [HumanMessage(content=validation_prompt), AIMessage(content=response.content)],
        "verdict": verdict   
    }

#regenerate concept for more uniqueness
def regenerate_concept(state:ConversationState):
    original_idea = state["original_idea"]
    current_concept= state["generated_concept"]
    
    regenerate_prompt = f"""Your previous project concept was not unique enough:
    
    "{current_concept}"
    
    Please generate a MORE UNIQUE project concept based on the user's idea:
    
    "{original_idea}"
    
    Be more creative, innovative and differentiated. Think outside the box.
    Focus on novel combinations of technologies or approaches that aren't commonly seen.
    Create something that solves a problem in an unexpected way.
    
    Your response should be just the new project concept itself, clearly and concisely stated in 2-3 sentences.
    """

    #send and store messages
    messages = state["messages"] + [HumanMessage(content=regenerate_prompt)]
    response = model.invoke(messages)

    return{
        "messages": messages + [AIMessage(content=response.content)],
        "generated_concept": response.content.strip(),
        "regeneration_attempts": state.get("regeneration_attempts", 0) + 1
    }

#generate full project plan 
def generate_plan(state:ConversationState):
    concept = state["generated_concept"]
    original_idea = state["original_idea"]

    plan_prompt = f"""Create a comprehensive project plan for this validated concept:
    
    "{concept}"
    
    Original user idea: {original_idea}
    
    Include:
    1. Project title (make it catchy and memorable)
    2. Executive summary (1 paragraph overview)
    3. Problem statement (what issue does this solve?)
    4. Target audience (who will use this?)
    5. Key Features (at least 3 main features with brief descriptions)
    6. Technology stack (recommend specific technologies and why they're suitable)
    7. Competitive analysis (2-3 similar products and how this project differentiates)
    8. Unique selling points (what makes this special?)
    
    Format your response in clean markdown with:
    - Use H1 (# Title) for the project title
    - Use H2 (## Section) for major sections
    - Use H3 (### Subsection) for subsections when needed
    - Include a blank line between sections
    - Use bullet points (- item) for lists
    - Bold important concepts with **bold text**
    - Use horizontal rules (---) to separate major sections
    
    Make your markdown visually clean and well-spaced.
    """

    #send and store messages
    messages = state["messages"] + [HumanMessage(content=plan_prompt)]
    response = model.invoke(messages)
    return{
        "messages": messages + [AIMessage(content=response.content)],
        "project_plan": response.content.strip(),
    }

#conditional logic if not UNIQUE enough, regenerate concept again
def should_regenerate(state:ConversationState):
    verdict = state.get("verdict", "UNIQUE")
    regeneration_attempts = state.get("regeneration_attempts", 0)
    if verdict == "UNIQUE" or  regeneration_attempts >= 2:
        return "generate_plan"
    else:
        return "regenerate_concept"
    

# Create memory saver instead
shared_memory = MemorySaver()

#create graph 
def create_conversation_graph(idea:str,conversation_id:str):
    workflow = StateGraph(ConversationState)

    #initial
    initial_state = {
        "messages": [SystemMessage(content="You are a helpful project ideation assistant.")],
        "original_idea": idea,
        "generated_concept": "",
        "iteration": 1,
        "conversation_id": conversation_id,
        "regeneration_attempts": 0
    }
    #nodes
    workflow.add_node("generate_concept", generate_concept)
    workflow.add_node("validate_concept", validate_concept)
    workflow.add_node("regenerate_concept", regenerate_concept)
    workflow.add_node("generate_plan", generate_plan)

    #edges 
    workflow.add_edge(START, "generate_concept")
    workflow.add_edge("generate_concept", "validate_concept")
    workflow.add_conditional_edges(
        "validate_concept",
        should_regenerate,
        {
            "generate_plan": "generate_plan",
            "regenerate_concept": "regenerate_concept"
        }
    )
    workflow.add_edge("regenerate_concept", "validate_concept")
    workflow.add_edge("generate_plan", END)

    return workflow.compile(checkpointer=shared_memory)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/idea")
async def process_idea(data:Project_Idea):
    print(f"Received idea: {data.idea}")
    try:
        conversation_id = str(uuid.uuid4())

        # New graph 
        graph = create_conversation_graph(data.idea, conversation_id)
        conversation_graphs[conversation_id] = graph

        # Initial state
        initial_state = {
            "messages": [SystemMessage(content="You are a helpful project ideation assistant.")],
            "original_idea": data.idea,
            "generated_concept": "",
            "iteration": 1,
            "conversation_id": conversation_id,
            "regeneration_attempts": 0
        }
        
        # Run with the checkpoint_id to identify this conversation
        result = await graph.ainvoke(
            initial_state, 
            config={"thread_id": conversation_id}
        )

        return {
            "message": result.get("project_plan", "No project plan generated."),
            "conversation_id": conversation_id,
            "generated_concept": result.get("generated_concept", ""),
            "iteration": 1,
            "status": "success",
        }
    
    except Exception as redis_error:
            print(f"Redis error: {str(redis_error)}")
            return {"message": "Error connecting to state storage. Please try again.", "status": "error"}   
    
    except Exception as e:
        print(f"Error processing idea: {str(e)}")
        return {"message": f"Error processing your idea: {str(e)}", "status": "error"}
    
