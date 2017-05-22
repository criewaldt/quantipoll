function quantipoll() {
    var labels = [],
        colors = [],
        pollData = [];
    
    for (var key in analytics) {
        labels.push(key);
        colors.push(analytics[key].color);
        pollData.push(analytics[key].count);
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
                        maintainAspectRatio: true,
                    }
    };
    
    
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: data});
}

$(document).ready(function(){
    //quantipoll    
    try {quantipoll();}
    catch (err) {console.log(err);}
    
    $('button').on('click', function(){
        
        var data = {
            pollid: $( "input[name=pollid]" ).val(),
            vote: $(this).prev('input').attr('value')
        };

        $.post( "/vote/cast", data, function() {
                //do something
            })
        .done(function(data) {
              window.location.href = data.link;
            })
        .fail(function() {
              alert('You must be logged in to vote!');
              window.location.href = "/auth/google";
        });
        
    });
});

