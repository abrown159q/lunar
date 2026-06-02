function updateTopDates(
    probabilities
){

    const div =
        document.getElementById(
            "topDates"
        );

    div.innerHTML = "";

    const ranked =
        [...probabilities.entries()]
        .sort(
            (a,b)=>
            b[1]-a[1]
        )
        .slice(0,100);

    ranked.forEach(
        ([date,p],i)=>{

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "topDate";

            row.innerHTML =
                "<strong>#"
                + (i+1)
                + "</strong><br>"
                + date
                + "<br>"
                + (p*100)
                .toFixed(3)
                + "%";

            div.appendChild(row);
        }
    );

    debug(
        "Top dates updated"
    );
}

function runPrediction(){

    clearDebug();

    const dateStr =
        document.getElementById(
            "lastDate"
        ).value;

    if(!dateStr){

        alert(
            "Select a date."
        );

        return;
    }

    const minGap =
        Number(
            document.getElementById(
                "minGap"
            ).value
        );

    const maxGap =
        Number(
            document.getElementById(
                "maxGap"
            ).value
        );

    debug(
        "Running prediction"
    );

    const probabilities =
        calculateDistribution(
            new Date(dateStr),
            minGap,
            maxGap,
            365
        );

    updateCalendar(
        probabilities
    );

    updateChart(
        probabilities
    );

    updateTopDates(
        probabilities
    );

    saveSettings();
}

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        initializeCalendar();

        loadSettings();

        document
        .getElementById(
            "runBtn"
        )
        .addEventListener(
            "click",
            runPrediction
        );

        document
        .getElementById(
            "clearBtn"
        )
        .addEventListener(
            "click",
            clearStorage
        );

        debug(
            "Application ready"
        );
    }
);