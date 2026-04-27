# 🏥 EarlyAxxess

**Description**
The ultimate next-generation healthcare platform! EarlyAxxess is an intelligent diagnostic assistant and structured EMR auto-filing system. By combining GraphRAG, a Neo4j knowledge graph, and the power of the Gemini LLM, it perfectly streamlines the entire patient-doctor interaction! 

**✨ Key Features**
* **🎙️ Smart Audio Processing:** Seamlessly converts patient-doctor conversations into text (`speech_to_text`) and perfectly identifies who is speaking (`speaker_diarization`) so no detail is ever lost!
* **📝 Automated EMR Generation:** Takes the raw conversation, summarizes the key medical details (`speaker_summary`), and automatically generates a highly structured Electronic Medical Record (`emr_generator`)!
* **🧠 Diagnostic Reasoner:** Uses an advanced Neo4j knowledge base to map patient symptoms to diseases, generating evidence-based medical insights! 
* **💻 Interactive Dashboards:** Beautiful, responsive React/Vite web apps tailored specifically for both Patient and Doctor views!

**🚀 Project Structure**
* `/frontend` - The gorgeous user interface for medical professionals and patients!
* `/speech_to_text` & `/speaker_diarization` - The ears of the operation!
* `/speaker_summary` & `/emr_generator` - The clinical brain that writes the reports!
* `/chat` - The interactive interface module!

**🛠️ Getting Started**

**1. Launch the Frontend UI!**
```bash
cd frontend
npm install
npm run dev
```

**2. Start the AI Microservices!**
Make sure your Neo4j container is running and your `GOOGLE_API_KEY` is securely set in your environment! Then you can run the individual Python modules for processing:
```bash
# Example: Running the EMR generator
python3 emr_generator/generate_emr.py
```
