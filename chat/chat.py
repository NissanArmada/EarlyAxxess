import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Load your secret keys!
load_dotenv()
my_api_key = os.environ.get("GEMINI_API_KEY")

if not my_api_key:
    print("Uh oh! I couldn't find the GEMINI_API_KEY in the .env file! (｡>﹏<｡)")
else:
    client = genai.Client(api_key=my_api_key)
    
    # 2. Your super smart EarlyAxxess System Prompt
    my_system_prompt = """You are a warm, helpful Medical Assistant for the EarlyAxxess ER app. 
    Your job is to answer the patient's questions based strictly on the provided transcript. 
    Always speak directly to the patient using 'you'. Translate any complex medical jargon 
    into plain English at a 5th-grade reading level. Be comforting but factual."""

    # 3. Create your chat session
    chat = client.chats.create(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            system_instruction=my_system_prompt,
            temperature=0.2, 
        )
    )
    
    # 🌟 NEW MAGIC: Read the .txt file and feed it to the bot! 🌟
    file_path = "speaker_diarization/conversation.txt" # Change this to your actual file name!
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            transcript_text = f.read()
            
        print("Loading patient file into EarlyAxxess... ⏳")
        
        # Send the file contents to the bot as the very first message!
        # We give it a little instruction so it knows what the text is.
        initial_prompt = f"Here is the patient's transcript. Please read it and prepare to answer the patient's questions:\n\n{transcript_text}"
        chat.send_message(initial_prompt)
        
        print("Patient file loaded! The assistant is ready! ✨ Type 'quit' to exit.\n")
        
    except FileNotFoundError:
        print(f"Oops! I couldn't find the file named {file_path} (｡>﹏<｡)")

    # 4. Your normal chat loop!
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break
            
        response = chat.send_message(user_input)
        print(f"EarlyAxxess Bot: {response.text}")