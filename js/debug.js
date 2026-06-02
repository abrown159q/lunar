const DEBUG = true;

const TRACE_QUEUE = false;
const TRACE_PROBABILITIES = false;

function debug(...args) {

    if(!DEBUG)
        return;

    console.log("[DEBUG]", ...args);

    const panel =
        document.getElementById(
            "debugConsole"
        );

    if(panel){

        panel.textContent +=
            args.map(
                x =>
                typeof x === "object"
                ? JSON.stringify(x,null,2)
                : x
            ).join(" ")
            + "\n";

        panel.scrollTop =
            panel.scrollHeight;
    }
}

function clearDebug() {

    const panel =
        document.getElementById(
            "debugConsole"
        );

    if(panel)
        panel.textContent = "";
}