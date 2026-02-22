"""
Generate a JSON-formatted EMR (Electronic Medical Record) document from conversation text.

Defaults:
 - input: `speaker_diarization/conversation.txt` (raw conversation)
 - output: `emr_generator/emr_document.json` (structured EMR as JSON)

Calls Gemini to infer and structure the conversation into an EMR format with:
 - Patient Storyboard (name, DOB, age, MRN, chief complaint)
 - Vitals Flowsheet (temp, HR, BP, etc.)
 - Clinical Notes (SOAP format: Subjective, Objective, Assessment, Plan)
 - Suspected ICD-10 codes
 - Active Orders

If a field cannot be inferred, it is left blank.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

try:
    from google import genai
except ImportError:
    genai = None


def _load_env() -> None:
    """Load environment variables from .env files."""
    try:
        from dotenv import load_dotenv

        repo_root = Path(__file__).resolve().parent.parent
        env1 = repo_root / ".env"
        env2 = Path(__file__).resolve().parent / ".env"
        if env2.is_file():
            load_dotenv(env2)
        elif env1.is_file():
            load_dotenv(env1)
        else:
            load_dotenv()
    except Exception:
        pass


def call_gemini_for_emr(conversation_text: str, api_key: str, model: str = "gemini-2.5-flash") -> dict | None:
    """Call Gemini to extract and structure EMR data from conversation text.

    Returns a JSON-compatible dict or None on failure.
    """
    if not genai:
        return None

    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}", file=sys.stderr)
        return None

    # Build a detailed prompt for EMR extraction
    prompt = f"""You are a medical documentation expert. Extract and structure the following doctor-patient conversation into a JSON-formatted EMR document.

Follow this exact JSON schema:
{{
  "patientStoryboard": {{
    "name": "...",
    "dob": "MM/DD/YYYY or blank if unknown",
    "age": "number or blank",
    "mrn": "Medical Record Number or blank",
    "chiefComplaint": "..."
  }},
  "vitalsFlowsheet": {{
    "temp": {{"value": "number or blank", "unit": "°F or °C or blank", "status": "Normal/Elevated/Low/blank"}},
    "hr": {{"value": "number or blank", "unit": "bpm or blank", "status": "Normal/Elevated/Low/blank"}},
    "bp": {{"value": "###/## or blank", "unit": "mmHg or blank", "status": "Normal/Elevated/Low/blank"}},
    "rr": {{"value": "number or blank", "unit": "breaths/min or blank", "status": "Normal/Elevated/Low/blank"}},
    "o2Sat": {{"value": "number or blank", "unit": "% or blank", "status": "Normal/Low/blank"}}
  }},
  "clinicalNotes": {{
    "subjective": "Patient's reported symptoms and history. Be detailed and clear.",
    "objective": "Physical exam findings, lab results, imaging. Note: if not mentioned in conversation, write (not documented) or leave blank.",
    "assessment": "Doctor's clinical impression and suspected diagnoses.",
    "plan": "Treatment plan, medications, orders, and follow-up."
  }},
  "suspectedICD10": [
    {{"code": "K35.80", "description": "Unspecified acute appendicitis"}}
  ],
  "activeOrders": [
    "CT Abdomen/Pelvis",
    "IV Fluids",
    "Zofran 4mg IV"
  ]
}}

Conversation:
{conversation_text}

Return ONLY valid JSON (no markdown, no explanation). If a field cannot be inferred from the conversation, leave it as an empty string or empty array."""

    try:
        response = client.models.generate_content(model=model, contents=prompt)
        if not response or not getattr(response, "text", None):
            print("Gemini returned no response.", file=sys.stderr)
            return None

        # Parse the JSON response
        json_str = response.text.strip()
        # Remove markdown code blocks if present
        if json_str.startswith("```"):
            json_str = json_str.split("```")[1]
            if json_str.startswith("json"):
                json_str = json_str[4:]
        json_str = json_str.strip()

        emr_data = json.loads(json_str)
        return emr_data
    except json.JSONDecodeError as e:
        print(f"Failed to parse Gemini's JSON response: {e}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Gemini API error: {e}", file=sys.stderr)
        return None


def fallback_emr_template() -> dict:
    """Return a blank EMR template when Gemini is unavailable."""
    return {
        "patientStoryboard": {
            "name": "",
            "dob": "",
            "age": "",
            "mrn": "",
            "chiefComplaint": "",
        },
        "vitalsFlowsheet": {
            "temp": {"value": "", "unit": "", "status": ""},
            "hr": {"value": "", "unit": "", "status": ""},
            "bp": {"value": "", "unit": "", "status": ""},
            "rr": {"value": "", "unit": "", "status": ""},
            "o2Sat": {"value": "", "unit": "", "status": ""},
        },
        "clinicalNotes": {
            "subjective": "",
            "objective": "",
            "assessment": "",
            "plan": "",
        },
        "suspectedICD10": [],
        "activeOrders": [],
    }


def main() -> None:
    _load_env()
    repo_root = Path(__file__).resolve().parent.parent
    default_input = repo_root / "speaker_diarization" / "conversation.txt"
    default_output = Path(__file__).resolve().parent / "emr_document.json"

    parser = argparse.ArgumentParser(description="Generate a JSON-formatted EMR document from conversation text.")
    parser.add_argument("input_file", nargs="?", default=str(default_input), help="Path to conversation.txt")
    parser.add_argument("-o", "--output", default=str(default_output), help="Output JSON file (default: emr_generator/emr_document.json)")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Gemini model to use")
    args = parser.parse_args()

    input_path = Path(args.input_file)
    if not input_path.is_file():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(2)

    text = input_path.read_text(encoding="utf-8")

    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    emr_data = None
    if api_key and api_key.strip():
        try:
            emr_data = call_gemini_for_emr(text, api_key.strip(), model=args.model)
        except Exception:
            emr_data = None

    if not emr_data:
        if api_key and api_key.strip():
            print("Warning: Gemini EMR generation failed; using blank template.", file=sys.stderr)
        emr_data = fallback_emr_template()

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(emr_data, f, indent=2)
    print(f"Wrote EMR document to: {out_path}")


if __name__ == "__main__":
    main()
