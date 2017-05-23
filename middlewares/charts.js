//charts middleware for analytics



/*
///

Very important:

Each chart should take: pollID => the poll object, the vote result array, and the payload from the specific sorting function.
This is to limit DB select calls when serving poll view due to analytics.

Also, only enough colors for up to 10 answers!

///
*/

var models = require('../models/index'),
    User = models.User,
    Vote = models.Vote,
    Poll = models.Poll;

var colors = [
    "#9b59b6",
    "#1abc9c",
    "#f39c12",
    "#CC5D53",
    
    "#003171",
    
    "#3498db",
    "#d35400",
    "#FF003B",
    "#A17917",
    "#34495e"];

function getPollAndVotes(pollID, callback) {
    Poll.findOne({
            where: {id: pollID}
    }).then(poll => {
        Vote.findAndCountAll({
                where: {pollid: pollID}
                })
            .then(result => {
                if (poll && result) {
                    //callback
                    callback(poll.dataValues, [result.count, result.rows]); 
                }  
            });
    });
}

//Main vote distribution graph
function quantipoll(pollID, callback) {
    getPollAndVotes(pollID, function(poll, votes){
        //Create payload with answers, and add colors
        var payload = {};
        //console.log(poll.answers);
        for (var key in poll.answers) {
            //assign keys and colors to payload before counting votes
            payload[key] = {
                count: 0,
                color: colors[parseInt(key, 10)-1]
            }};
        //count votes per answer
        
        votes[1].forEach(function(result){
            //count vote
            payload[result.vote].count ++;
        });
        //console.log(payload);
        //callback results
        callback(poll, votes, payload);
        
        
    });
    /*
    poll = {
        id:id,
        question:question,
        answers : {index:answer,},
        userid : userid,
        handle : handle,
        createdAt: date,
        updatedAt: date
        };
    results = [
            {
                id,
                pollid: pollid
                handle: handle
                userid: userid
                vote: vote
                createdAt: date
                updatedAt: date
            }, ...
        ];
    payload = {
            {1: {
                count:count,
                color: color},
                },
            }, ...
        };
    */
}



module.exports = {
    quantipoll:quantipoll
};
