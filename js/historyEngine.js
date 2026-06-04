// historyEngine.js
// Historical appearance statistics and prediction engine

const HISTORY_DAY_MS = 86400000;

/*
------------------------------------------------------------
Utilities
------------------------------------------------------------
*/

function historyFormatDate(date) {

    return date.toISOString().slice(0, 10);
}

function historyParseDate(dateString) {

    return new Date(dateString);
}

/*
------------------------------------------------------------
Interval calculations
------------------------------------------------------------
*/

function getIntervals(
    appearanceDates
) {

    if (
        !appearanceDates ||
        appearanceDates.length < 2
    ) {
        return [];
    }

    const sortedDates =
        [...appearanceDates]
        .sort();

    const intervals = [];

    for (
        let i = 1;
        i < sortedDates.length;
        i++
    ) {

        const d1 =
            historyParseDate(
                sortedDates[i - 1]
            );

        const d2 =
            historyParseDate(
                sortedDates[i]
            );

        intervals.push(
            (
                d2.getTime()
                -
                d1.getTime()
            )
            /
            HISTORY_DAY_MS
        );
    }

    return intervals;
}

/*
------------------------------------------------------------
Basic statistics
------------------------------------------------------------
*/

function mean(
    values
) {

    if (
        !values ||
        values.length === 0
    ) {
        return null;
    }

    return (
        values.reduce(
            (a, b) => a + b,
            0
        )
        /
        values.length
    );
}

function variance(
    values
) {

    if (
        !values ||
        values.length < 2
    ) {
        return null;
    }

    const m =
        mean(values);

    return (
        values.reduce(
            (
                sum,
                value
            ) =>
                sum
                +
                Math.pow(
                    value - m,
                    2
                ),
            0
        )
        /
        values.length
    );
}

function standardDeviation(
    values
) {

    const v =
        variance(values);

    if (
        v === null
    ) {
        return null;
    }

    return Math.sqrt(v);
}

/*
------------------------------------------------------------
Statistics summary
------------------------------------------------------------
*/

function calculateStatistics(
    appearanceDates
) {

    const intervals =
        getIntervals(
            appearanceDates
        );

    if (
        intervals.length === 0
    ) {

        return {

            count:
                appearanceDates.length,

            intervals:
                0,

            mean:
                null,

            stdDev:
                null,

            min:
                null,

            max:
                null
        };
    }

    return {

        count:
            appearanceDates.length,

        intervals:
            intervals.length,

        mean:
            mean(intervals),

        stdDev:
            standardDeviation(
                intervals
            ),

        min:
            Math.min(
                ...intervals
            ),

        max:
            Math.max(
                ...intervals
            )
    };
}

/*
------------------------------------------------------------
Normal distribution
------------------------------------------------------------
*/

function normalPdf(
    x,
    meanValue,
    stdDevValue
) {

    if (
        stdDevValue <= 0
    ) {
        return 0;
    }

    const coefficient =
        1
        /
        (
            stdDevValue
            *
            Math.sqrt(
                2 * Math.PI
            )
        );

    const exponent =
        -Math.pow(
            x - meanValue,
            2
        )
        /
        (
            2
            *
            Math.pow(
                stdDevValue,
                2
            )
        );

    return (
        coefficient
        *
        Math.exp(
            exponent
        )
    );
}

/*
------------------------------------------------------------
Prediction model
------------------------------------------------------------
*/

function calculateDistributionFromHistory(
    appearanceDates,
    horizonDays
) {

    debug(
        "History prediction started"
    );

    if (
        !appearanceDates ||
        appearanceDates.length < 2
    ) {

        debug(
            "Not enough appearance dates"
        );

        return new Map();
    }

    const stats =
        calculateStatistics(
            appearanceDates
        );

    debug(
        "History statistics",
        JSON.stringify(
            stats
        )
    );

    const lastDate =
        historyParseDate(
            appearanceDates
            [
                appearanceDates.length
                - 1
            ]
        );

    const meanInterval =
        stats.mean;

    let stdDevInterval =
        stats.stdDev;

    /*
    Prevent divide-by-zero
    if all intervals identical.
    */

    if (
        !stdDevInterval ||
        stdDevInterval < 0.25
    ) {

        stdDevInterval =
            0.25;
    }

    const probabilityMap =
        new Map();

    let totalProbability =
        0;

    for (
        let day = 1;
        day <= horizonDays;
        day++
    ) {

        const candidateDate =
            new Date(
                lastDate.getTime()
                +
                day
                *
                HISTORY_DAY_MS
            );

        const probability =
            normalPdf(
                day,
                meanInterval,
                stdDevInterval
            );

        probabilityMap.set(
            historyFormatDate(
                candidateDate
            ),
            probability
        );

        totalProbability +=
            probability;
    }

    /*
    Normalize so that
    probabilities sum to 1.
    */

    for (
        const
        [
            date,
            probability
        ]
        of probabilityMap
    ) {

        probabilityMap.set(
            date,
            probability
            /
            totalProbability
        );
    }

    debug(
        "History prediction complete",
        "Dates:",
        probabilityMap.size
    );

    return probabilityMap;
}

/*
------------------------------------------------------------
Convenience helpers
------------------------------------------------------------
*/

function getMostRecentAppearance(
    appearanceDates
) {

    if (
        !appearanceDates ||
        appearanceDates.length === 0
    ) {
        return null;
    }

    return [...appearanceDates]
        .sort()
        .at(-1);
}

function getMeanInterval(
    appearanceDates
) {

    return calculateStatistics(
        appearanceDates
    ).mean;
}

function getStandardDeviationInterval(
    appearanceDates
) {

    return calculateStatistics(
        appearanceDates
    ).stdDev;
}