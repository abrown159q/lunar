function showHome() {
    debug("showHome: switching to home screen");
    document.getElementById("homeScreen").classList.remove("hidden");
    document.getElementById("dashboardScreen").classList.add("hidden");
    debug("showHome: done");
}

function showDashboard() {
    debug("showDashboard: switching to dashboard screen");
    document.getElementById("homeScreen").classList.add("hidden");
    document.getElementById("dashboardScreen").classList.remove("hidden");
    debug("showDashboard: done");
}

function parseHomeInput() {

    debug("parseHomeInput: reading home screen inputs");

    const dateInput =
        document.getElementById("homeDate").value;

    const daysInput =
        document.getElementById("homeDays").value;

    debug("parseHomeInput: dateInput =", dateInput, "| daysInput =", daysInput);

    let lastDate = null;

    if (dateInput) {

        lastDate = new Date(dateInput);

        debug("parseHomeInput: using date input ->", dateInput);
    }
    else if (daysInput) {

        const d = new Date();

        d.setDate(
            d.getDate() - Number(daysInput)
        );

        lastDate = d;

        debug("parseHomeInput: using days input", daysInput, "-> computed date", lastDate);
    }
    else {
        debug("parseHomeInput: no input provided, returning null");
    }

    debug("parseHomeInput: returning", lastDate);

    return lastDate;
}

function updateTopDates(probabilities) {

    debug("updateTopDates: building ranked date list");

    const div =
        document.getElementById("topDates");

    div.innerHTML = "";

    const ranked =
        [...probabilities.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 100);

    debug("updateTopDates: rendering", ranked.length, "entries");

    ranked.forEach(([date, p], i) => {

        const row =
            document.createElement("div");

        row.className = "topDate";

        row.innerHTML =
            "<strong>#"
            + (i + 1)
            + "</strong><br>"
            + date
            + "<br>"
            + (p * 100).toFixed(3)
            + "%";

        div.appendChild(row);
    });

    debug("updateTopDates: done");
}

function runPrediction() {

    clearDebug();

    debug("runPrediction: started");

    const dateStr =
        document.getElementById("lastDate").value;

    debug("runPrediction: lastDate =", dateStr);

    if (!dateStr) {
        debug("runPrediction: no date selected, aborting");
        alert("Select a date.");
        return;
    }

    const minGap =
        Number(document.getElementById("minGap").value);

    const maxGap =
        Number(document.getElementById("maxGap").value);

    debug("runPrediction: minGap =", minGap, "| maxGap =", maxGap);

    debug("runPrediction: calling calculateDistribution");

    const probabilities =
        calculateDistribution(
            new Date(dateStr),
            minGap,
            maxGap,
            90   // SAFE DEBUG HORIZON
        );

    debug("runPrediction: distribution calculated, updating views");

    updateCalendar(probabilities);
    updateChart(probabilities);
    updateTopDates(probabilities);

    debug("runPrediction: saving settings");

    saveSettings();

    debug("runPrediction: done");
}

/* =========================
   HOME SCREEN EVENT
========================= */

function setupHome() {

    debug("setupHome: attaching enterBtn listener");

    document.getElementById("enterBtn").addEventListener(
        "click",
        () => {

            debug("enterBtn: clicked");

            try {

                const lastDate = parseHomeInput();

                if (!lastDate) {
                    debug("enterBtn: no valid date parsed, showing alert");
                    alert("Enter a date or number of days.");
                    return;
                }

                const dateStr = lastDate.toISOString().slice(0, 10);

                debug("enterBtn: setting lastDate input to", dateStr);

                document.getElementById("lastDate").value = dateStr;

                showDashboard();
                initializeCalendar();

                debug("enterBtn: entered dashboard successfully");
            }
            catch (err) {
                console.error("enterBtn: error during click handler ->", err);
                debug("enterBtn: ERROR - " + err.message);
            }
        }
    );

    debug("setupHome: done");
}

/* =========================
   BACK BUTTON
========================= */

function setupBackButton() {

    debug("setupBackButton: attaching backBtn listener");

    const backBtn =
        document.getElementById("backBtn");

    if (!backBtn) {
        debug("setupBackButton: backBtn not found in DOM, skipping");
        return;
    }

    backBtn.addEventListener(
        "click",
        () => {
            debug("backBtn: clicked, returning to home");
            showHome();
        }
    );

    debug("setupBackButton: done");
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    debug("DOMContentLoaded: application starting");

    // Show home first so the dashboard is never visible on load
    showHome();

    debug("DOMContentLoaded: initializing calendar");
    initializeCalendar();

    debug("DOMContentLoaded: loading saved settings");
    loadSettings();

    setupHome();
    setupBackButton();

    debug("DOMContentLoaded: attaching runBtn listener");

    // Calculate, runBtn
    document.getElementById("runBtn")
        .addEventListener("click", runPrediction);

    const clearBtn =
        document.getElementById("clearBtn");

    if (clearBtn) {
        debug("DOMContentLoaded: attaching clearBtn listener");
        clearBtn.addEventListener("click", clearStorage);
    }
    else {
        debug("DOMContentLoaded: clearBtn not present in DOM, skipping");
    }

    debug("DOMContentLoaded: application ready");
});