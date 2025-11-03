# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional

# Initialize FastAPI application with a title
app = FastAPI(title="Helicone AI Gateway Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: str  # Message from the developer/system
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4o-mini"  # Optional model selection with default
    api_key: str          # Helicone API key for authentication

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client configured for Helicone AI Gateway
        # Helicone Gateway uses OpenAI SDK format but routes to different providers
        client = OpenAI(
            api_key=request.api_key,
            base_url="https://ai-gateway.helicone.ai/"
        )

        # Create an async generator function for streaming responses
        async def generate():
            try:
                # Prepare messages for the chat completion
                messages = []

                # Add developer/system message if provided
                if request.developer_message:
                    messages.append({"role": "system", "content": request.developer_message})

                # Add user message
                messages.append({"role": "user", "content": request.user_message})

                # Create a streaming chat completion request via Helicone Gateway
                stream = client.chat.completions.create(
                    model=request.model,
                    messages=messages,
                    stream=True  # Enable streaming response
                )

                # Yield each chunk of the response as it becomes available
                try:
                    for chunk in stream:
                        try:
                            if hasattr(chunk, 'choices') and chunk.choices and len(chunk.choices) > 0:
                                delta = chunk.choices[0].delta
                                if delta and hasattr(delta, 'content') and delta.content is not None:
                                    content = delta.content
                                    if content:
                                        # Yield the content as bytes to ensure proper encoding
                                        yield content
                        except Exception as chunk_error:
                            # Log chunk processing error but continue streaming
                            print(f"Error processing chunk: {chunk_error}")
                            continue
                    # Stream completed successfully
                except Exception as stream_iter_error:
                    print(f"Error iterating stream: {stream_iter_error}")
                    # Yield error but don't raise - let the stream complete gracefully
                    yield f"\n\nError: {str(stream_iter_error)}"
            except Exception as stream_error:
                # Yield error message and let stream complete gracefully
                yield f"\n\nError: {str(stream_error)}"

        # Return a streaming response to the client with proper headers
        return StreamingResponse(
            generate(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )

    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
