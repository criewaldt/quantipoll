//votes.js


function quantipoll() {
    var labels = [];
    var colors = [];
    var pollData = [];
    
    for (var key in analytics.quantipoll) {
        labels.push(key);
        colors.push(analytics.quantipoll[key].color);
        pollData.push(analytics.quantipoll[key].count);
    }
    
    var ctx = document.getElementById("QuantiPoll");
    var data = {
        labels: labels,
        datasets: [
            {
                data: pollData,
                backgroundColor: colors
            }],
        options: {
                        maintainAspectRatio: false,
                    }
    };
    
    
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: data});
}

quantipoll();