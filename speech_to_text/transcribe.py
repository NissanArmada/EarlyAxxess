"""
Speech-to-text using the speech_recognition library.
Supports: microphone input, WAV files, and multiple backends (Google, Whisper, etc.).
"""

import speech_recognition as sr


def transcribe_microphone(language="en-US"):
    """Capture from microphone and transcribe using Google Speech Recognition (free, no API key for short clips)."""
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Calibrating for ambient noise...")
        r.adjust_for_ambient_noise(source, duration=0.5)
        print("Speak now (then wait for result)...")
        audio = r.listen(source, timeout=10, phrase_time_limit=15)
    return _recognize(r, audio, language)


def transcribe_file(audio_path: str, language="en-US"):
    """Transcribe from a WAV file."""
    r = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = r.record(source)
    return _recognize(r, audio, language)


def _recognize(recognizer, audio, language):
    """Try Google first; add other backends as needed."""
    try:
        text = recognizer.recognize_google(audio, language=language)
        return text
    except sr.UnknownValueError:
        return "[Could not understand audio]"
    except sr.RequestError as e:
        return f"[Recognition service error: {e}]"


if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Transcribe audio from microphone or WAV file.")
    parser.add_argument("input", nargs="?", help="Path to WAV file. Omit to use microphone.")
    parser.add_argument("-l", "--language", default="en-US", help="Language for transcription (default: en-US)")
    parser.add_argument("-o", "--output", help="Write transcription to this text file (optional)")
    args = parser.parse_args()

    if args.input:
        result = transcribe_file(args.input, language=args.language)
    else:
        try:
            result = transcribe_microphone(language=args.language)
        except Exception as e:
            print(f"Microphone error: {e}", file=sys.stderr)
            sys.exit(1)

    # Print to stdout and optionally write to a file
    print(result)
    if args.output:
        out_path = args.output
        try:
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(result)
            print(f"Wrote transcription to: {out_path}")
        except Exception as e:
            print(f"Failed to write output file: {e}", file=sys.stderr)
            sys.exit(1)
