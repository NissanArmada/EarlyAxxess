# EMR Generator

This utility reads a raw `conversation.txt` file (doctor-patient conversation) and uses Gemini to extract and structure it into a JSON-formatted EMR (Electronic Medical Record) document.

## Usage

```powershell
python emr_generator/generate_emr.py
python emr_generator/generate_emr.py path/to/conversation.txt -o path/to/emr.json
```

## Output

The output JSON includes:
- **Patient Storyboard**: name, DOB, age, MRN, chief complaint
- **Vitals Flowsheet**: temperature, heart rate, blood pressure, respiratory rate, O2 saturation
- **Clinical Notes**: SOAP format (Subjective, Objective, Assessment, Plan)
- **Suspected ICD-10 codes**: diagnoses with codes and descriptions
- **Active Orders**: tests, medications, interventions

If a field cannot be inferred from the conversation, it is left blank.

## Requirements

- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) environment variable set
- `google-genai` installed
- `python-dotenv` (optional, for `.env` support)

If Gemini is unavailable or fails, the script outputs a blank template.
