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
            ).value
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

    document.getElementById(
        "minGap"
    ).value =
    settings.minGap || 26;

    document.getElementById(
        "maxGap"
    ).value =
    settings.maxGap || 30;
}

function clearStorage() {

    localStorage.clear();

    debug(
        "localStorage cleared"
    );
}