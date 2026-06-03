function saveSettings() {

    const settings = {

        lastDate:
            document.getElementById(
                "lastDate"
            ).value,

        minGap:
            document.getElementById(
                "minGap"
            ).value,

        maxGap:
            document.getElementById(
                "maxGap"
            ).value,


            
    };

    debug(
        "Saving settings",
        settings
    );

    localStorage.setItem(
        "celestialSettings",
        JSON.stringify(settings)
    );
}

function loadSettings() {

    const raw =
        localStorage.getItem(
            "celestialSettings"
        );

    if(!raw)
        return;

    const settings =
        JSON.parse(raw);

    debug(
        "Loaded settings",
        settings
    );

    document.getElementById(
        "lastDate"
    ).value =
    settings.lastDate || "";
    
    /*
     * Restore home screen date field
     */

    document.getElementById(
        "homeDate"
    ).value =
        settings.lastDate || "";

    /*
     * Recompute days-since from stored date
     */

    if (settings.lastDate) {

        const today =
            new Date();

        const lastDate =
            new Date(
                settings.lastDate
            );

        const daysSince =
            Math.floor(
                (
                    today -
                    lastDate
                ) / 86400000
            );

        document.getElementById(
            "homeDays"
        ).value =
            daysSince;
    }

    document.getElementById(
        "minGap"
    ).value =
    settings.minGap || 26;

    document.getElementById(
        "maxGap"
    ).value =
    settings.maxGap || 30;

    document.getElementById(
        "homeDays"
    ).value =
        calculateDaysSince(
            settings.lastDate
        );

}



function clearStorage() {

    localStorage.clear();

    debug(
        "localStorage cleared"
    );
}

function calculateDaysSince(lastDateString) {

    const today =
        new Date();

    const lastDate =
        new Date(lastDateString);

    const diffMs =
        today - lastDate;

    return Math.floor(
        diffMs / 86400000
    );
}