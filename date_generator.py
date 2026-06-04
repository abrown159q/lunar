from datetime import date, timedelta
import random
import json
import os

OUTPUT_DIR = "test-data"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def save_dataset(name, seed, dates):
    data = {
        "name": name,
        "seed": seed,
        "appearanceDates": [
            d.isoformat()
            for d in dates
        ]
    }

    filename = (
        name.lower()
            .replace(" ", "_")
            .replace(".", "p")
        + ".json"
    )

    with open(
        os.path.join(OUTPUT_DIR, filename),
        "w",
        encoding="utf-8"
    ) as f:
        json.dump(data, f, indent=4)


def generate_fixed_interval(
    start_date,
    interval_days,
    count
):
    dates = [start_date]

    for _ in range(count - 1):
        dates.append(
            dates[-1] +
            timedelta(days=interval_days)
        )

    return dates


def generate_normal_interval(
    start_date,
    mean_days,
    sd_days,
    count,
    seed
):
    rng = random.Random(seed)

    dates = [start_date]

    for _ in range(count - 1):

        interval = round(
            rng.gauss(
                mean_days,
                sd_days
            )
        )

        interval = max(
            interval,
            1
        )

        dates.append(
            dates[-1] +
            timedelta(days=interval)
        )

    return dates


START = date(2020, 1, 1)
COUNT = 150

save_dataset(
    "Every 31 Days",
    0,
    generate_fixed_interval(
        START,
        31,
        COUNT
    )
)

save_dataset(
    "Mean 30 SD 1.3",
    12345,
    generate_normal_interval(
        START,
        30.0,
        1.3,
        COUNT,
        12345
    )
)

save_dataset(
    "Mean 28 SD 2.1",
    67890,
    generate_normal_interval(
        START,
        28.0,
        2.1,
        COUNT,
        67890
    )
)

print("Done")