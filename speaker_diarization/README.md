# Speaker diarization (doctor–patient)

Labels a **single block of doctor–patient conversation text** with **Doctor** and **Patient**. The script splits the text into turns by sentence boundaries, then uses **Gemini** to infer who is speaking for each turn. If the API key is missing or the request fails, it falls back to alternating Doctor/Patient.

## Setup

1. **API key**: Set `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in your environment, or create a `.env` file in the project root (parent of `speaker_diarization/`) with:

   ```
   GEMINI_API_KEY=your_key_here
   ```

2. **Install dependencies**:

   ```bash
   cd speaker_diarization
   pip install -r requirements.txt
   ```

## Input

One continuous block of text (no pre-labeled speakers). The script splits on sentence-ending punctuation (`.`, `!`, `?`); each segment is one turn. Gemini then labels each turn as Doctor or Patient.

## Usage

- **From a file:**

  ```bash
  python diarize.py conversation.txt
  ```

- **From stdin (e.g. paste or pipe):**

  ```bash
  python diarize.py < conversation.txt
  ```

- **Write output to a file:**

  ```bash
  python diarize.py conversation.txt -o labeled_transcript.txt
  ```

- **Fallback only** (who speaks first when Gemini is not used):

  ```bash
  python diarize.py conversation.txt --first patient
  ```

## Output

Lines in the form `Doctor: ...` and `Patient: ...`, one per turn.

## Dependencies

- **google-generativeai** – Gemini API for speaker labeling
- **python-dotenv** – loads `GEMINI_API_KEY` from a `.env` file in the project root when present

Without a valid API key or if the request fails, the script falls back to alternating Doctor/Patient and prints a warning to stderr.
