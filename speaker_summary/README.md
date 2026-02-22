# Speaker summary

This utility reads a `labeled_transcript.txt` file (lines like `Doctor: ...` and `Patient: ...`) and summarizes the doctor's speech into simple, patient-friendly language.

Usage:

```powershell
python speaker_summary/summarize.py                # reads repo_root/labeled_transcript.txt -> speaker_summary/summary.txt
python speaker_summary/summarize.py path/to/input -o path/to/summary.txt
```

If `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) is set and `google-genai` is installed, the script will call Gemini to produce a high-quality summary. Otherwise it uses a small local fallback summarizer.

Output file: `speaker_summary/summary.txt` by default.
