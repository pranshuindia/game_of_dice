#Game of Dice

The "Game of Dice" is a multiplayer game where N players roll a 6 faced dice in a round-robin
fashion. Each time a player rolls the dice their points increase by the number (1 to 6) achieved
by the roll.

As soon as a player accumulates M points they complete the game and are assigned a rank.
Remaining players continue to play the game till they accumulate at least M points. The game
ends when all players have accumulated at least M points.

### Steps to Run

Clone the Repo:

`git clone https://github.com/pranshuindia/game_of_dice.git`

Install Necessary Packages : 

`npm install`

Run the Code : 

`npm start <numeric_value_number_of_players> <numeric_value_maximum_points>`

i.e. for 4 players and 15 maximum points

`npm start 4 15`

### Final Output

Final Rankings (in Order of Game Completion) :\
Player 4 -> Rank 1 \
Player 2 -> Rank 2 \
Player 3 -> Rank 3 \
Player 1 -> Rank 4
