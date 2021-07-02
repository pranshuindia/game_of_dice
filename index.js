const readline = require('readline');
var playersArray = [];
const initialObject = require('./initial_object.json');
var flag = true;
var input = false;
var gameOver=false;
var turn;
var finalRankings = [];

//dynamic Sorting function to sort an array of object in ascending order based on the property provided as a parameter
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
//Function to determine which player must throw the dice next.
function whoseTurnNext() {
    turn = (turn+1) % parseInt(process.argv[2]) !== 0 ? (turn+1) % parseInt(process.argv[2]) : parseInt(process.argv[2]);
    console.log(`Next is Player ${turn}'s turn`);
}
/*
Function to generate random number on the dice and add it to the points of the current player throwing the dice.
It also ensures setting a flag to determine if the user must skip his next turn or if he has completed the game.
 */
function diceRoll() {
    const rndInt = Math.floor(Math.random() * 6) + 1;
    console.log(`Player ${turn} rolled ${rndInt}`);
    playersArray.forEach(player=> {
        if(player.player === turn) {
            if(player.previousTurn === 1 && rndInt === 1) {
                player.skip = true;
            }
            player.points = player.points + rndInt;
            player.previousTurn = rndInt;
            if(rndInt!==6 && player.points >= parseInt(process.argv[3])) {
                player.complete = true;
                finalRankings.push({
                    "player" : player.player,
                    "ranking" : finalRankings.length + 1
                })
            }
        }
    })
    return rndInt;
}
//Generic Utility function to ask for input and return the response after input is made
function askQuestion(query) {
    const readLineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => readLineInterface.question(query, ans => {
        readLineInterface.close();
        resolve(ans);
    }))
}
/*
Function which takes the command line arguments and sets the inital array of players. It uses the initial_object.json
and build upon that object assigning each player a numeric value.
It also checks which player's turn is next and calls the diceRoll function.
Logic to skip (if two consecutive 1s) or give a player another chance (if dice has shown a 6)
*/
async function main() {
    if(process.argv.length === 4) {
        console.log("No of Players", process.argv[2]);
        console.log("No of Maximum Points Needed", process.argv[3]);
        for(var i=0;i<parseInt(process.argv[2]);i++) {
            playersArray.push({
                ...initialObject,
                player : i+1
            })
        }
        turn = Math.floor(Math.random()*parseInt(process.argv[2])) + 1;
        while (finalRankings.length!== parseInt(process.argv[2])) {
            var ans;
            if(playersArray[turn-1].complete===false && playersArray[turn-1].skip === false){
                ans = await askQuestion(`Player ${turn} Should we role the dice ?`);
                if (ans === 'r') {
                    ans = undefined;
                    const diceRollValue = playersArray[turn-1].complete===false ? diceRoll() : 0;
                    if(diceRollValue===6) {
                        console.log(`Player ${turn} gets another change because the rolled 6`)
                    }
                    else if(diceRollValue===0) {
                        console.log(`Player ${turn} has completed the game`);
                        whoseTurnNext();
                    }
                    else {
                        var showRankings = [...playersArray];
                        showRankings.sort(dynamicSort("points"));
                        showRankings.reverse();
                        console.log("\n\nCurrent Ranking (Descending order of Points) :\n", JSON.parse(JSON.stringify(showRankings,['player','points'])));
                        if(finalRankings.length!== parseInt(process.argv[2]))
                            whoseTurnNext();
                    }
                } else {
                    console.log("Please enter r or R to roll the dice as game is not complete");
                }
            }
            else if(playersArray[turn-1].complete===false && playersArray[turn-1].skip === true) {
                console.log(`Skipping Player ${turn}'s turn as rolled 1 twice consecutively`);
                playersArray[turn-1].skip = false
                whoseTurnNext();
            }
            else
                whoseTurnNext();
        }
    }
    else {
        console.log("Please Provide correct number of arguments");
        console.log("Run the file using -> npm start \<numeric_value_no_of_players\> \<maximum_points_needed_to_win\>")
    }
    console.log("\n\nFinal Rankings (in Order of Game Completion) : \n");
    finalRankings.forEach(finalRanking =>{
        console.log(`Player ${finalRanking.player} -> Rank ${finalRanking.ranking}`);
    });
}
//callingMainFunction
main();

