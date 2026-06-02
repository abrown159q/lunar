let calendar;

function probabilityColor(p){

    if(p > 50)
        return "#ff4444";

    if(p > 30)
        return "#ffbb44";

    if(p > 15)
        return "#4488ff";

    if(p > 5)
        return "#88ccff";

    return "#ddeeff";
}

function initializeCalendar(){

    calendar =
        new FullCalendar.Calendar(
            document.getElementById(
                "calendar"
            ),
            {
                initialView:
                    "dayGridMonth",
                height: 700
            }
        );

    calendar.render();

    debug(
        "Calendar initialized"
    );
}

function updateCalendar(
    probabilities
){

    calendar.removeAllEvents();

    const events = [];

    for(
        const
        [date, prob]
        of probabilities
    ){

        const pct =
            prob * 100;

        events.push({

            start: date,

            title:
                pct.toFixed(1)
                + "%",

            backgroundColor:
                probabilityColor(
                    pct
                ),

            borderColor:
                probabilityColor(
                    pct
                )
        });
    }

    calendar.addEventSource(
        events
    );

    debug(
        "Calendar events",
        events.length
    );
}