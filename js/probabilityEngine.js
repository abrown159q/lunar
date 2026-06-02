const DAY_MS =
    86400000;

function calculateDistribution(
    startDate,
    minGap,
    maxGap,
    horizonDays
){

    const t0 =
        performance.now();

    debug(
        "Starting calculation"
    );

    const results =
        new Map();

    const queue = [{
        date: startDate,
        probability: 1
    }];

    const cutoff =
        startDate.getTime()
        +
        horizonDays * DAY_MS;

    while(queue.length){

        const current =
            queue.shift();

        if(
            TRACE_QUEUE &&
            queue.length % 1000 === 0
        ){
            debug(
                "Queue",
                queue.length
            );
        }

        for(
            let gap=minGap;
            gap<=maxGap;
            gap++
        ){

            const nextDate =
                new Date(
                    current.date.getTime()
                    +
                    gap * DAY_MS
                );

            if(
                nextDate.getTime()
                >
                cutoff
            ){
                continue;
            }

            const probability =
                current.probability
                /
                (
                    maxGap
                    -
                    minGap
                    +
                    1
                );

            const key =
                nextDate
                .toISOString()
                .slice(0,10);

            results.set(
                key,
                (
                    results.get(key)
                    || 0
                )
                +
                probability
            );

            if(
                TRACE_PROBABILITIES
            ){
                debug(
                    key,
                    probability
                );
            }

            if(
                probability >
                1e-6
            ){
                queue.push({
                    date: nextDate,
                    probability
                });
            }
        }
    }

    debug(
        "Calculation complete",
        {
            dates:
                results.size,
            seconds:
                (
                    performance.now()
                    -
                    t0
                ) / 1000
        }
    );

    return results;
}