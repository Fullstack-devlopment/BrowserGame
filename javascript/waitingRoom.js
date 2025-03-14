// Initialize the socket connection
const socket = io('https://130.225.170.52:10242'); // Use your actual server address and port

socket.on('playerJoined', (data) => {
    console.log('playerJoined event data:', data);
    // Check if the event is for the current game
    const gameIdElement = document.getElementById('gameIdDisplay');
    if (!gameIdElement) {
        console.error('Game ID display element not found!');
        return;
    }

    const currentGameId = gameIdElement.textContent.trim();
    console.log('Current game ID:', currentGameId, 'Received game ID:', data.gameId);


    if (data.gameId === currentGameId) {
        const playerList = document.getElementById('playerList');


         // Avoid duplicate player entries
        if (![...playerList.children].some(li => li.textContent === data.playername)) {
            const li = document.createElement('li');
            li.textContent = data.playername;
            playerList.appendChild(li);
        } else {
            console.log('Player already exists in the list:', data.playername);
        }
    } else {
        console.log('Ignoring player from a different game:', data.playername);
    }
});