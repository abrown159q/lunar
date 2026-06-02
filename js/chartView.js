let chart;

function updateChart(
    probabilities
){

    const labels = [];
    const values = [];

    const sorted =
        [...probabilities.entries()]
        .sort(
            (a,b)=>
            new Date(a[0])
            -
            new Date(b[0])
        );

    sorted.forEach(
        ([d,p]) => {

            labels.push(d);

            values.push(
                p * 100
            );
        }
    );

    if(chart)
        chart.destroy();

    chart =
        new Chart(
            document
            .getElementById(
                "probabilityChart"
            ),
            {
                type: "line",

                data: {

                    labels,

                    datasets: [{
                        label:
                        "Probability (%)",

                        data: values
                    }]
                }
            }
        );

    debug(
        "Chart updated",
        labels.length
    );
}