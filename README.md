Maze Game
=========

Description:
------------
This is a maze game built using React, where the player navigates through a dynamically generated maze. The game features a red player that starts at a random position, and the goal is to reach the green endpoint. The game also tracks elapsed time, and players can aim to beat their high score.

Game Features:
--------------
1. Maze Size: The maze is 15x15.
2. Path Generation: The maze is generated using the reference of Origin Shift algorithm.
3. Player Controls: Use arrow keys to move the player (red) through the maze.
4. Winning Condition: When the player reaches the green endpoint, the game displays a 'You Win!' message.
5. Replay Option: After winning, players can click the "Play Again" button to generate a new maze and start over.
6. High Score: The game tracks the best completion time, encouraging players to improve.

How to Play:
------------
1. Use the arrow keys to navigate through the maze.
2. Reach the green square to win the game.
3. Try to complete the maze as quickly as possible to set a high score.

Dependencies:
-------------
- React
- Webpack
- CSS for styling
- Webpack Dev Server for local development

Setup Instructions:
-------------------
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Use `npm run build` to bundle the app with Webpack.
4. Start the development server with `npm run serve` to play the game locally.
5. Open `index.html` in your browser to view the game.

Viewing the Extension in Chrome (Developer Mode):
-------------------------------------------------
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer Mode** by toggling the switch in the top right corner.
3. Click **Load unpacked** and select the folder where the maze game files are located (make sure your `manifest.json` and `index.html` are in the root folder).
4. The maze game extension will now appear in your list of Chrome extensions. Click on the extension icon to play the game.

Customizations:
---------------
- You can change the maze size by modifying the `generateMaze` function in the `MazeGame` component.
- The player and endpoint positions are randomized, but they can be set manually for testing.
- The walls of the maze are rendered with custom components, and the player and endpoint colors can be adjusted in the `Cell` component.

Enjoy playing the Maze Game!
