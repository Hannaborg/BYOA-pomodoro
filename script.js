// Sets up a basic two-phase Pomodoro timer (focus + break) with start, pause, and reset controls.
(function () {
    const focusDuration = 25 * 60; // seconds
    const breakDuration = 5 * 60;  // seconds
    const durations = { focus: focusDuration, break: breakDuration };

    const display = document.getElementById("timerDisplay");
    const phaseLabel = document.getElementById("phaseLabel");
    const startPauseBtn = document.getElementById("startPauseBtn");
    const resetBtn = document.getElementById("resetBtn");
    const togglePhaseBtn = document.getElementById("togglePhaseBtn");
    const intentionForm = document.getElementById("intentionForm");
    const intentionInput = document.getElementById("intentionInput");
    const intentionDisplay = document.querySelector(".intention__display");
    const intentionText = document.getElementById("intentionText");

    const state = {
        phase: "focus",
        remaining: durations.focus,
        isRunning: false,
        intervalId: null,
        intention: ""
    };

    function formatTime(totalSeconds) {
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    function announce(message) {
        if (document.hidden && "Notification" in window && Notification.permission === "granted") {
            new Notification(message, { body: "Pomodoro" });
            return;
        }

        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
            return;
        }

        console.log(message);
    }

    function updateView() {
        display.textContent = formatTime(state.remaining);
        phaseLabel.textContent = state.phase === "focus" ? "Focus" : "Break";
        phaseLabel.dataset.phase = state.phase;
        document.title = `${display.textContent} · ${phaseLabel.textContent}`;

        startPauseBtn.textContent = state.isRunning ? "Pause" : "Start";
        togglePhaseBtn.textContent = state.phase === "focus" ? "Skip to Break" : "Skip to Focus";

        const hasIntention = Boolean(state.intention);
        if (!state.isRunning && !hasIntention) {
            startPauseBtn.disabled = true;
        } else {
            startPauseBtn.disabled = false;
        }

        togglePhaseBtn.disabled = !hasIntention && !state.isRunning;

        const pristine = state.phase === "focus" && state.remaining === durations.focus && !state.isRunning;
        resetBtn.disabled = pristine;
    }

    function clearTimer() {
        if (state.intervalId !== null) {
            window.clearInterval(state.intervalId);
            state.intervalId = null;
        }
    }

    function stopTimer() {
        state.isRunning = false;
        clearTimer();
        updateView();
    }

    function startTimer() {
        if (state.isRunning) {
            return;
        }

        state.isRunning = true;
        state.intervalId = window.setInterval(tick, 1000);
        updateView();
    }

    function setPhase(nextPhase, shouldAutoStart) {
        const targetPhase = nextPhase ?? (state.phase === "focus" ? "break" : "focus");
        const autoStart = shouldAutoStart ?? state.isRunning;

        if (autoStart) {
            clearTimer();
        }

        state.phase = targetPhase;
        state.remaining = durations[targetPhase];
        state.isRunning = Boolean(autoStart);

        if (state.isRunning) {
            state.intervalId = window.setInterval(tick, 1000);
        }

        updateView();
    }

    function tick() {
        if (!state.isRunning) {
            return;
        }

        if (state.remaining <= 0) {
            handlePhaseComplete();
            return;
        }

        state.remaining -= 1;
        updateView();

        if (state.remaining <= 0) {
            handlePhaseComplete();
        }
    }

    function handlePhaseComplete() {
        const message = state.phase === "focus" ? "Break time!" : "Back to focus.";
        announce(message);
        setPhase(state.phase === "focus" ? "break" : "focus", true);
    }

    function setIntention(nextIntention) {
        state.intention = nextIntention;
        intentionText.textContent = nextIntention;
        intentionForm.classList.add("is-hidden");
        intentionDisplay.classList.remove("is-hidden");
        intentionInput.value = "";
        intentionInput.blur();

        startTimer();
    }

    function resetIntention() {
        state.intention = "";
        intentionText.textContent = "";
        intentionDisplay.classList.add("is-hidden");
        intentionForm.classList.remove("is-hidden");
        startPauseBtn.disabled = true;
        togglePhaseBtn.disabled = true;
        intentionInput.value = "";
        intentionInput.focus();
    }

    startPauseBtn.addEventListener("click", () => {
        if (state.isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    intentionForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = intentionInput.value.trim();
        if (!value) {
            intentionInput.focus();
            intentionInput.select();
            return;
        }

        setIntention(value);
    });

    resetBtn.addEventListener("click", () => {
        clearTimer();
        state.phase = "focus";
        state.remaining = durations.focus;
        state.isRunning = false;
        resetIntention();
        updateView();
    });

    togglePhaseBtn.addEventListener("click", () => {
        const nextPhase = state.phase === "focus" ? "break" : "focus";
        setPhase(nextPhase, state.isRunning);
        if (state.isRunning) {
            announce(state.phase === "focus" ? "Focus resumed" : "Break started");
        }
    });

    document.addEventListener("visibilitychange", updateView);

    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
    }

    updateView();
})();
