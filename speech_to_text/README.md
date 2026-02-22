# Speech to Text

Two ways to do speech-to-text in this folder.

## 1. Browser (no install)

Open `index.html` in **Chrome** or **Edge**. Click "Start listening", speak, then "Stop". Uses the Web Speech API (no backend, no API key).

## 2. Python (microphone or WAV file)

### Setup

```bash
cd speech_to_text
pip install -r requirements.txt
```

On Windows, if `pip install PyAudio` fails, install the [PyAudio wheel](https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyaudio) or use:

```bash
pip install pipwin
pipwin install pyaudio
```

### Run

- **From microphone** (speak when prompted):

  ```bash
  python transcribe.py
  ```

- **From a WAV file**:

  ```bash
  python transcribe.py path/to/audio.wav
  ```

  Optional language code (default `en-US`):

  ```bash
  python transcribe.py path/to/audio.wav en-GB
  ```

The Python script uses Google’s free web recognition (short clips; for long or heavy use you may need an API key or another backend like Whisper).
