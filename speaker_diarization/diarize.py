"""
Text-based speaker diarization for doctor–patient conversations.
Splits a block of text into turns by sentence boundaries and uses Gemini to label each turn as Doctor or Patient.
Falls back to alternating Doctor/Patient if the API key is missing or the request fails.
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path


# Load .env from repo root (parent of speaker_diarization) when present
def _load_env() -> None:
    try:
        from pathlib import Path
        import dotenv
        # Look in the same folder first!
        env_file = Path(__file__).resolve().parent / ".env"
        if not env_file.is_file():
            # Fallback to the old way just in case
            env_file = Path(__file__).resolve().parent.parent / ".env"
        if env_file.is_file():
            dotenv.load_dotenv(env_file)
    except ImportError:
        pass


def segment_into_turns(text: str) -> list[str]:
    """Split text on sentence-ending punctuation (. ! ?), trim and drop empty segments."""
    if not text or not text.strip():
        return []
    pattern = r"(?<=[.!?])\s+"
    raw = re.split(pattern, text.strip())
    turns = [s.strip() for s in raw if s.strip()]
    return turns


def _gemini_label_speakers(turns: list[str], api_key: str) -> list[str] | None:
    """
    Ask Gemini to label each turn as Doctor or Patient. Returns a list of "Doctor"/"Patient"
    in order, or None on failure.
    """
    if not turns:
        return []
    try:
        # Import the brand new SDK!
        from google import genai
    except ImportError:
        print("Error: google-genai is not installed! (｡>﹏<｡)", file=sys.stderr)
        return None
    
    # The new way to initialize the client!
    client = genai.Client(api_key=api_key)
    
    numbered = "\n".join(f"Turn {i + 1}: {t}" for i, t in enumerate(turns))
    
    # BUG FIX: Define the prompt BEFORE calling the model!
    prompt = f"""This is a doctor–patient conversation split into turns. For each turn, say only "Doctor" or "Patient".
Output exactly one label per line, in order: first line = label for Turn 1, second line = label for Turn 2, etc.
Use only the words Doctor or Patient, one per line, nothing else. Note: one speaker maybe speak more than one turn.

Conversation:
{numbered}

Labels (one per line):"""

    for attempt in range(3):
        try:
            # #region agent log
            _dlog("diarize.py:_gemini_label_speakers", "before Gemini generate_content", {"attempt": attempt + 1, "num_turns": len(turns)}, "C")
            # #endregion
            
            # The new, correct way to call the model!
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            
            # #region agent log
            _dlog("diarize.py:_gemini_label_speakers", "after Gemini generate_content", {"has_response": response is not None, "has_text": bool(response and response.text)}, "C")
            # #endregion
            if not response or not response.text:
                continue
            lines = [ln.strip() for ln in response.text.strip().splitlines() if ln.strip()]
            labels = []
            for ln in lines:
                ln_lower = ln.lower()
                if "doctor" in ln_lower and "patient" not in ln_lower:
                    labels.append("Doctor")
                elif "patient" in ln_lower:
                    labels.append("Patient")
                else:
                    labels.append("Doctor" if "doctor" in ln_lower else "Patient")
            if len(labels) >= len(turns):
                return labels[: len(turns)]
            if len(labels) > 0:
                # Pad with alternating if Gemini returned fewer
                last = "Patient" if labels[-1] == "Doctor" else "Doctor"
                while len(labels) < len(turns):
                    last = "Patient" if last == "Doctor" else "Doctor"
                    labels.append(last)
                return labels
        except Exception as e:
            # Actually print the error to the console so we can debug!
            print(f"API Error on attempt {attempt + 1}: {e}", file=sys.stderr)
            time.sleep(1.0 * (attempt + 1))
            continue
    return None


def diarize(
    text: str,
    first_speaker: str = "doctor",
    api_key: str | None = None,
) -> list[tuple[str, str]]:
    """
    Segment text into turns and label each as Doctor or Patient using Gemini when possible.
    Falls back to alternating Doctor/Patient if API key is missing or the request fails.
    Returns a list of (speaker_label, utterance) tuples.
    """
    turns = segment_into_turns(text)
    # #region agent log
    _dlog("diarize.py:diarize", "after segment_into_turns", {"num_turns": len(turns)}, "B")
    # #endregion
    if not turns:
        return []

    labels = None
    if api_key and api_key.strip():
        labels = _gemini_label_speakers(turns, api_key.strip())

    if labels is None or len(labels) != len(turns):
        # Fallback: alternating
        speakers = ["Doctor", "Patient"] if first_speaker.lower() == "doctor" else ["Patient", "Doctor"]
        labels = [speakers[i % 2] for i in range(len(turns))]
        if api_key and api_key.strip():
            print("Warning: Gemini labeling failed or unavailable; using alternating Doctor/Patient.", file=sys.stderr)

    return list(zip(labels, turns))


def format_output(labeled: list[tuple[str, str]]) -> str:
    """Format labeled turns as 'Speaker: utterance' lines."""
    return "\n".join(f"{speaker}: {utt}" for speaker, utt in labeled)


def main() -> None:
    _load_env()
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

    parser = argparse.ArgumentParser(
        description="Diarize doctor–patient conversation text using Gemini (Doctor/Patient per turn)."
    )
    parser.add_argument(
        "input_file",
        nargs="?",
        default=None,
        help="Path to a text file containing the conversation (omit to read from stdin)",
    )
    parser.add_argument(
        "-o", "--output",
        metavar="FILE",
        default="labeled_transcript.txt",
        help="Write output to FILE instead of stdout (default: labeled_transcript.txt)",
    )
    parser.add_argument(
        "--first",
        choices=["doctor", "patient"],
        default="doctor",
        help="Who speaks first when falling back to alternating (default: doctor)",
    )
    args = parser.parse_args()
    # #region agent log
    _dlog("diarize.py:main", "main started", {"input_file": args.input_file, "cwd": os.getcwd()}, "A")
    _dlog("diarize.py:main", "main started", {"input_file": args.input_file}, "E")
    # #endregion

    if args.input_file is not None:
        with open(args.input_file, encoding="utf-8") as f:
            text = f.read()
    else:
        text = sys.stdin.read()
    # #region agent log
    _dlog("diarize.py:main", "after read file", {"len_text": len(text), "text_preview": text[:100] if text else ""}, "A")
    # #endregion

    labeled = diarize(text, first_speaker=args.first, api_key=api_key)
    # #region agent log
    _dlog("diarize.py:main", "after diarize", {"len_labeled": len(labeled)}, "D")
    # #endregion
    out = format_output(labeled)
    # #region agent log
    _dlog("diarize.py:main", "before print/write", {"len_out": len(out)}, "D")
    _dlog("diarize.py:main", "before print/write", {"len_out": len(out)}, "E")
    # #endregion

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(out)
    else:
        # #region agent log
        _dlog("diarize.py:main", "about to print stdout", {"len_out": len(out), "out_preview": out[:200]}, "F2")
        # #endregion
        print(out, flush=True)
        # #region agent log
        _dlog("diarize.py:main", "after print stdout", {}, "F2")
        # #endregion


if __name__ == "__main__":
    main()