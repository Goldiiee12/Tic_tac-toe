# Tic_tac-toe

Set project with HTML, CSS and Javascript files and get the Git repo all set up.

Store the gameboard as an array inside of a Gameboard object, players are also going to be stored in objects, and you’re probably going to want an object to control the flow of the game itself.

Goal here is to have as little global code as possible using factories. 

If you only need a single instance of something (e.g. the gameboard, the displayController etc.) then wrap the factory inside an IIFE (module pattern) so it cannot be reused to create additional instances.

Create an object that will handle the display/DOM logic. Write a function that will render the contents of the gameboard array to the webpage.

Write the functions that allow players to add marks to a specific spot on the board by interacting with the appropriate DOM elements (e.g. letting players click on a board square to place their marker). Don’t forget the logic that keeps players from playing in spots that are already taken!

Allow for player vs player and player vs pc

Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that shows the results upon game end!