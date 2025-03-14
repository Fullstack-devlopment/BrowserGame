// Initialize the socket connection
const socket = io('https://130.225.170.52:10242'); // Use your actual server address and port

socket.on('playerJoined', (data) => {
    console.log('playerJoined event received:', data);

    // Fetch the game ID from the waiting room (ensure it exists)
    const gameIdElement = document.getElementById('gameIdDisplay');
    if (!gameIdElement) {
        console.warn('Game ID display element not found. Players list update skipped.');
        return;
    }

    const currentGameId = gameIdElement.textContent.trim();
    console.log(`Current Game ID: ${currentGameId}, Received Game ID: ${data.gameId}`);

    // Only update the list if the joining player is in the same game
    if (data.gameId === currentGameId) {
        const playerList = document.getElementById('playerList');

        if (!playerList) {
            console.error('Player list element not found.');
            return;
        }

        // Check if player is already in the list
        const existingPlayers = Array.from(playerList.children).map(li => li.textContent);
        if (!existingPlayers.includes(data.playername)) {
            const li = document.createElement('li');
            li.textContent = data.playername;
            playerList.appendChild(li);
            console.log(`Added player to list: ${data.playername}`);
        } else {
            console.log(`Player ${data.playername} already in list, skipping.`);
        }
    } else {
        console.log(`Ignoring player ${data.playername} from different game ID.`);
    }
});
