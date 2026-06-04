const DAY_MS = 86400000;
const DEFAULT_MIN_GAP = 30;
const DEFAULT_MAX_GAP = 32;

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}
function calculateDistributionFromLastDate(
    startDate,
    horizonDays
) {

    const minGap =
        DEFAULT_MIN_GAP;

    const maxGap =
        DEFAULT_MAX_GAP;

    debug(
        "calculateDistribution:",
        "minGap =", minGap,
        "maxGap =", maxGap
    );

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

function getMostLikelyDate(
    probabilities
) {

    let bestDate = null;
    let bestProb = -1;

    for (
        const [date, prob]
        of probabilities
    ) {

        if (prob > bestProb) {

            bestProb = prob;
            bestDate = date;
        }
    }

    return bestDate;
}

function getDaysUntilAppearance(
    probabilities
) {

    const bestDate =
        getMostLikelyDate(
            probabilities
        );

    if (!bestDate)
        return null;

    const today =
        new Date();

    const target =
        new Date(bestDate);

    const diffMs =
        target - today;

    return Math.ceil(
        diffMs / 86400000
    );
}