import os
from dotenv import load_dotenv
from google import genai

# 1. Load the secret variables from your .env file! (Super important!)
load_dotenv()

# 2. Grab the specific key you saved
my_api_key = os.environ.get("GEMINI_API_KEY")

# Let's add a quick safety check so you know if it failed to load!
if not my_api_key:
    print("Uh oh! I couldn't find the GEMINI_API_KEY in the .env file! (｡>﹏<｡)")
else:
    # 3. Feed the key to the new GenAI client!
    client = genai.Client(api_key=my_api_key)
    
    # 4. Create your chat session!
    chat = client.chats.create(model="gemini-2.5-flash")
    print("Yay! Triagify's brain is online! ✨ Type 'quit' to exit.")

    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break
            
        response = chat.send_message(user_input)
        print(f"Bot: {response.text}")