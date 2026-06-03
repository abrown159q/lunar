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
    probabilities,
    lastAppearanceDate
){

    console.log(">>> updateCalendar CALLED");
    debug("updateCalendar CALLED");

    console.log("args:", probabilities, lastAppearanceDate);
    calendar.removeAllEvents();

    const events = [];
 

    events.push({

        start: lastAppearanceDate,

        title: "★ Known",

        backgroundColor: "#00aa00",

        borderColor: "#006600"
    });


    debug(
        "Added known appearance:",
        lastAppearanceDate
    );


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


    debug(
        "Added known appearance:",
        lastAppearanceDate
    );

    console.log(events);
    
    
    calendar.addEventSource(
        events
    );

    debug(
        "Calendar events",
        events.length
    );
}