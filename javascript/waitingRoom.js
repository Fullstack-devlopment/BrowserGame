// Initialize the socket connection
const socket = io('https://130.225.170.52:10242'); // Use your actual server address and port

socket.on('playerJoined', (data) => {
    console.log('playerJoined event data:', data);
    // Check if the event is for the current game
    const currentGameId = document.getElementById('gameIdDisplay').textContent;
    if (data.gameId === currentGameId) {
        const playerList = document.getElementById('playerList');
        const li = document.createElement('li');
        li.textContent = typeof data.playername === 'object' ? data.playername.name : data.playername;
        playerList.appendChild(li);
    }
});