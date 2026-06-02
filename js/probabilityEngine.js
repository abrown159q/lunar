const DAY_MS = 86400000;

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

function calculateDistribution(
    startDate,
    minGap,
    maxGap,
    horizonDays
) {

    const t0 = performance.now();

    debug("Starting probability calculation");

    const horizon =
        startDate.getTime()
        + horizonDays * DAY_MS;

    /*
    Probability mass by date
    */

    const probabilityMap = new Map();

    probabilityMap.set(
        formatDate(startDate),
        1.0
    );

    const arrivalProbabilities =
        new Map();

    const datesToProcess = [
        startDate
    ];

    let processed = 0;

    while(datesToProcess.length) {

        const currentDate =
            datesToProcess.shift();

        const currentKey =
            formatDate(currentDate);

        const currentProbability =
            probabilityMap.get(currentKey);

        processed++;

        if(processed % 100 === 0) {
            debug(
                "Processed dates:",
                processed,
                "Queue:",
                datesToProcess.length
            );
        }

        for(
            let gap=minGap;
            gap<=maxGap;
            gap++
        ) {

            const nextDate =
                new Date(
                    currentDate.getTime()
                    +
                    gap * DAY_MS
                );

            if(
                nextDate.getTime()
                >
                horizon
            ) {
                continue;
            }

            const nextKey =
                formatDate(nextDate);

            const nextProbability =
                currentProbability
                /
                (
                    maxGap
                    -
                    minGap
                    +
                    1
                );

            arrivalProbabilities.set(
                nextKey,
                (
                    arrivalProbabilities.get(
                        nextKey
                    )
                    || 0
                )
                +
                nextProbability
            );

            if(
                !probabilityMap.has(
                    nextKey
                )
            ) {

                probabilityMap.set(
                    nextKey,
                    nextProbability
                );

                datesToProcess.push(
                    nextDate
                );

            } else {

                probabilityMap.set(
                    nextKey,
                    probabilityMap.get(
                        nextKey
                    )
                    +
                    nextProbability
                );
            }
        }
    }

    debug(
        "Calculation complete",
        {
            processedDates:
                processed,
            uniqueDates:
                arrivalProbabilities.size,
            runtimeSeconds:
                (
                    performance.now()
                    - t0
                ) / 1000
        }
    );

    return arrivalProbabilities;
}