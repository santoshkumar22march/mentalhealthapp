import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from supabase import create_client, Client
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use Service Role Key for backend!
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Model
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI(title="Nila.ai Backend", version="2.0")

# CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    user_id: str


def update_memory_task(user_id: str, last_message: str, last_response: str, current_memory: str):
    """
    Background task to summarize the conversation and update user memory.
    """
    summary_prompt = f"""
    Current Memory of User: {current_memory}
    
    New Interaction:
    User: {last_message}
    AI: {last_response}
    
    Update the 'Current Memory' to include important life details, mood patterns, 
    and events mentioned in this new interaction. Keep it concise.
    """
    
    try:
        # Use a separate model instance or same one, flash is stateless enough here
        summary_res = model.generate_content(
            f"You are a memory manager. {summary_prompt}"
        )
        new_memory = summary_res.text
        
        # Update Supabase
        supabase.table("profiles").update({"nila_memory": new_memory}).eq("id", user_id).execute()
        print(f"Memory updated for {user_id}")
    except Exception as e:
        print(f"Failed to update memory: {e}")


@app.get("/")
async def root():
    return {"message": "Nila.ai Backend is running (Gemini Powered)"}


@app.post("/chat")
async def chat_endpoint(request: ChatRequest, background_tasks: BackgroundTasks):
    try:
        memory_context = ""
        is_guest = request.user_id == "guest_user" or not is_valid_uuid(request.user_id)
        
        # 1. Fetch User Memory (only for real users)
        if not is_guest:
            try:
                user_data = supabase.table("profiles").select("nila_memory").eq("id", request.user_id).execute()
                if user_data.data and len(user_data.data) > 0:
                    memory_context = user_data.data[0].get("nila_memory", "")
            except Exception as e:
                print(f"Error fetching user memory: {e}")

        # 2. Construct System Prompt + Message
        # Gemini handles system prompts differently or as part of the context.
        # We can prepend it.
        
        full_prompt = f"""
        System: You are Nila, an empathetic mental health companion for Indian students.
        
        USER CONTEXT (MEMORY):
        "{memory_context}"
        
        Instructions:
        - Use the memory to personalize your response.
        - If they mentioned an exam previously, ask about it.
        - Be supportive, non-judgmental, and calm.
        - Keep responses concise but warm.
        - Use simple language.
        
        User's Message: {request.message}
        """

        try:
            # 3. Call Gemini
            response = model.generate_content(full_prompt)
            ai_message = response.text
            
        except Exception as e: # Generic catch for Google API errors
            print(f"Gemini API Error: {e}")
            ai_message = "My connection to the cloud is a bit floaty today. I'm still here with you though. 🌙"

        # 4. Schedule Memory Update (only for real users)
        if not is_guest and memory_context is not None:
            background_tasks.add_task(
                update_memory_task, 
                request.user_id, 
                request.message, 
                ai_message, 
                memory_context
            )

        return {"response": ai_message}
    except Exception as e:
        print(f"Error: {e}")
        # Return fallback instead of 500
        return {"response": "I'm listening, but my thoughts are drifting. Can you say that again? 💙"}


def is_valid_uuid(val):
    """Check if a string is a valid UUID"""
    import uuid
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
