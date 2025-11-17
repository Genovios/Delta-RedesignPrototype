$(function () {
    let remaining = 0;
    let initial = 0;
    let timerId = null;

    const $display = $("#timeDisplay");
    const $msDisplay = $("#msDisplay");
    const $status = $("#status");

    /* -----------------------------
       Display Update Functions
    --------------------------------*/

    // Updates the Main Timer Display
    function updateMainDisplay() {
        const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
        const ss = String(remaining % 60).padStart(2, "0");
        $display.text(`${mm}:${ss}`);
    }

    // Calls update for the Main Timer Display
    function updateDisplay() {
        updateMainDisplay();
    }

    /* -----------------------------
       Core Timer Logic
    --------------------------------*/

    // Forcefully stops the timer and clears it
    function stopInterval() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    // Defines a tick for the timer to countdown with
    function tick() {
        if (remaining <= 0) {
            stopInterval();
            $status.text("Finished!");
            updateDisplay();
            return;
        }
        remaining--;
        updateDisplay();

        if (remaining <= 0) {
            stopInterval();
            $status.text("Finished!");
        }
    }

    // Starts the timer from a reset / stopped state
    function startTimer() {
        if (remaining <= 0 || timerId) return;
        $status.text("Running...");
        timerId = setInterval(tick, 1000);
    }

    /* -----------------------------
       Control Functions
    --------------------------------*/

    // Sets the timer, automatically starts when user clicks a preset
    function setTimer(seconds, autoStart) {
        stopInterval();
        remaining = Math.max(0, parseInt(seconds, 10));
        initial = remaining;
        updateDisplay();
        $status.text("Set the timer using one of the above buttons.");
        if (autoStart) startTimer();
    }

    // Pauses the timer
    function pauseTimer() {
        stopInterval();
        $status.text("Paused.");
    }

    // Resets the timer to the initial preset / time
    function resetTimer() {
        stopInterval();
        remaining = initial;
        updateDisplay();
        $status.text(remaining > 0 ? "Timer has been reset." : "Stopped!");
    }

    // Stops the timer
    function stopTimer() {
        stopInterval();
        remaining = 0;
        initial = 0;
        updateDisplay();
        $status.text("Stopped!");
    }

    // Allows user to add additional, non-preset minutes, one at a time
    function addMinute() {
        remaining += 60;
        if (initial === 0) initial = remaining;
        updateDisplay();
    }

    /* -----------------------------
       jQuery Event Bindings
    --------------------------------*/

    $(".preset").on("click", function () {
        const secs = $(this).data("seconds");
        setTimer(secs, true);
    });

    $("#startBtn").on("click", function () {
        if (remaining <= 0) setTimer(60, true);
        else startTimer();
    });

    $("#pauseBtn").on("click", pauseTimer);
    $("#resetBtn").on("click", resetTimer);
    $("#stopBtn").on("click", stopTimer);
    $("#addMinBtn").on("click", addMinute);

    /* -----------------------------
       Initialize
    --------------------------------*/
    
    setTimer(0, false);
});
