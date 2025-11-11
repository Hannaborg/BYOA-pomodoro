# Pomodoro Timer

Lightweight, intention-driven Pomodoro timer for the browser. Lock in what you’re focusing on, then cycle between 25-minute work sessions and 5-minute breaks.

## Features

- **Intention lock-in** – Type what you’re focusing on and press Enter; the timer starts immediately and displays your focus badge prominently.
- **Focus & break cycles** – Default durations of 25 minutes (focus) and 5 minutes (break) with skip controls.
- **Start/Pause/Reset controls** – Pause mid-session, resume, or reset back to a clean slate. Reset re-opens the intention prompt so you can choose a new task.
- **Accessible notifications** – Browser tab title updates, speech synthesis, and optional notifications when phases switch.
- **Responsive layout** – Optimized for desktops and small screens with a calm, centered UI.

## Getting Started

```bash
git clone https://github.com/<you>/<your-new-repo>.git
cd your-new-repo
python3 -m http.server 8000
```

Then open [`http://localhost:8000`](http://localhost:8000) in your browser.

## Usage

1. **Set intention** – Type your focus into the prompt and press Enter. The input hides and the timer begins.
2. **Work** – Stay focused for the 25-minute session. Use Pause if you need to stop temporarily.
3. **Break** – When time is up, the app announces the next phase. Use Skip to jump between focus/break manually.
4. **Reset** – Click Reset to end the session early. The intention prompt returns so you can start fresh.

## Customizing Durations

Adjust the default focus or break lengths in `script.js` by editing the `focusDuration` and `breakDuration` constants near the top of the file.

## Tech Stack

- HTML5
- CSS (custom, no frameworks)
- Vanilla JavaScript with Web APIs (Speech Synthesis, Notifications)

## License

MIT License. See `LICENSE` (add one if needed). Feel free to adapt the timer for your own productive flow.