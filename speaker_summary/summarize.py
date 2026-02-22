"""
Summarize doctor speech from a labeled transcript using Gemini.

Defaults:
 - input: repository root `labeled_transcript.txt` (file produced by speaker_diarization)
 - output: `speaker_summary/summary.txt`

If `GEMINI_API_KEY` is set and `google-genai` is installed, the script will call Gemini.
Otherwise it falls back to a simple local summarization.
"""
from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path
import time


def _load_env() -> None:
    try:
        from dotenv import load_dotenv

        # Look for a .env next to the repo root (parent of this folder)
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


def extract_doctor_lines(text: str) -> list[str]:
    """Return a list of utterances that belong to the Doctor.

    Expects lines in the form `Doctor: ...` or `Patient: ...` (case-insensitive).
    """
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    doctor = []
    for ln in lines:
        if re.match(r"^doctor\s*:\s*", ln, flags=re.IGNORECASE):
            utter = re.sub(r"^doctor\s*:\s*", "", ln, flags=re.IGNORECASE)
            doctor.append(utter.strip())
    return doctor


def simple_local_summary(utterances: list[str]) -> str:
    """Create a basic fallback summary when Gemini isn't available.

    This is intentionally simple: we take the first one or two short sentences
    from each doctor utterance and do a few word substitutions for readability.
    """
    if not utterances:
        return "No doctor utterances found to summarize."

    subs = {
        r"recommend(?:s|ed)?": "suggest",
        r"administer(?:ed|ing)?": "give",
        r"hypertension": "high blood pressure",
        r"myocardial infarction": "heart attack",
        r"cease": "stop",
        r"discontinue": "stop",
    }

    bullets = []
    for utt in utterances:
        sents = re.split(r"(?<=[.!?])\s+", utt.strip())
        if not sents:
            continue
        take = sents[0]
        if len(sents) > 1 and len(sents[0]) < 80:
            take = sents[0].strip() + " " + sents[1].strip()
        # Apply substitutions
        for pat, repl in subs.items():
            take = re.sub(pat, repl, take, flags=re.IGNORECASE)
        # Truncate to 240 chars for readability
        if len(take) > 240:
            take = take[:237].rsplit(" ", 1)[0] + "..."
        bullets.append(f"- {take.strip()}")

    header = (
        "Summary (fallback): What the doctor said in simple words.\n" "Use these points to help the patient understand.\n\n"
    )
    return header + "\n".join(bullets)


def call_gemini(prompt: str, api_key: str, model: str = "gemini-2.5-flash") -> str | None:
    try:
        from google import genai
    except Exception:
        return None

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(model=model, contents=prompt)
        if not response or not getattr(response, "text", None):
            return None
        return response.text
    except Exception as e:
        print(f"Gemini API error: {e}", file=sys.stderr)
        return None


def build_prompt(doctor_text: str) -> str:
    """Construct a high-quality prompt to summarize doctor speech for a patient.

    The prompt asks for simple language, short sentences, and clear action items.
    """
    instructions = (
        "You are a helpful assistant. This is a conversation between a doctor and a patient. "
        "Your goal is to summarize WHAT THE DOCTOR IS SAYING so the patient can easily understand. "
        "Use short sentences, avoid complex medical jargon when possible, and replace technical words with simple alternatives. "
        "Present the output as a short plain-text summary (no JSON or markup). Start with a one-line. If applicable, describe recovery plan in detail."
        "TL;DR sentence, then list clear action items the patient should follow. If the doctor gave medication, dosage, or follow-up instructions, "
        "list them explicitly. Keep the summary under 300 words."
    )

    prompt = f"{instructions}\n\nConversation (only doctor utterances):\n{doctor_text}\n\nSummary:" 
    return prompt


def main() -> None:
    _load_env()
    repo_root = Path(__file__).resolve().parent.parent
    default_input = repo_root / "labeled_transcript.txt"
    default_output = Path(__file__).resolve().parent / "summary.txt"

    parser = argparse.ArgumentParser(description="Summarize doctor speech for patient-friendly output.")
    parser.add_argument("input_file", nargs="?", default=str(default_input), help="Path to labeled transcript (Doctor:/Patient: lines)")
    parser.add_argument("-o", "--output", default=str(default_output), help="Output file (default: speaker_summary/summary.txt)")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Gemini model to use (if available)")
    args = parser.parse_args()

    input_path = Path(args.input_file)
    if not input_path.is_file():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(2)

    text = input_path.read_text(encoding="utf-8")
    doctor_utts = extract_doctor_lines(text)
    doctor_text = "\n".join(doctor_utts)

    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    prompt = build_prompt(doctor_text)

    summary = None
    if api_key and api_key.strip():
        try:
            summary = call_gemini(prompt, api_key.strip(), model=args.model)
        except Exception:
            summary = None

    if not summary:
        # fallback
        summary = simple_local_summary(doctor_utts)

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(summary, encoding="utf-8")
    print(f"Wrote summary to: {out_path}")


if __name__ == "__main__":
    main()
