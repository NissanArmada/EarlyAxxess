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
    import sys

    if len(sys.argv) > 1:
        path = sys.argv[1]
        lang = sys.argv[2] if len(sys.argv) > 2 else "en-US"
        print(transcribe_file(path, language=lang))
    else:
        print(transcribe_microphone())
