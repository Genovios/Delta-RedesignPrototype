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
    function updateMainDisplay() {
        const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
        const ss = String(remaining % 60).padStart(2, "0");
        $display.text(`${mm}:${ss}`);
    }

    function updateMinutesSeconds() {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        $msDisplay.text(`${mins}m ${secs}s`);
    }

    function updateAllDisplays() {
        updateMainDisplay();
        updateMinutesSeconds();
    }

    /* -----------------------------
       Core Timer Logic
    --------------------------------*/
    function stopInterval() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function tick() {
        if (remaining <= 0) {
            stopInterval();
            $status.text("Finished");
            updateAllDisplays();
            return;
        }
        remaining--;
        updateAllDisplays();

        if (remaining <= 0) {
            stopInterval();
            $status.text("Finished");
        }
    }

    function startTimer() {
        if (remaining <= 0 || timerId) return;
        $status.text("Running");
        timerId = setInterval(tick, 1000);
    }

    /* -----------------------------
       Control Functions
    --------------------------------*/
    function setTimer(seconds, autoStart) {
        stopInterval();
        remaining = Math.max(0, parseInt(seconds, 10));
        initial = remaining;
        updateAllDisplays();
        $status.text("Set");
        if (autoStart) startTimer();
    }

    function pauseTimer() {
        stopInterval();
        $status.text("Paused");
    }

    function resetTimer() {
        stopInterval();
        remaining = initial;
        updateAllDisplays();
        $status.text(remaining > 0 ? "Reset" : "Stopped");
    }

    function stopTimer() {
        stopInterval();
        remaining = 0;
        initial = 0;
        updateAllDisplays();
        $status.text("Stopped");
    }

    function addMinute() {
        remaining += 60;
        if (initial === 0) initial = remaining;
        updateAllDisplays();
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
