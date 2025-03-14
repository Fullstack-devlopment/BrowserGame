function joinGame() {
    let playername = document.getElementById('usernameInput').value.trim();
    let gameId = document.getElementById('gamePinInput').value.trim(); // Get the game code

    if (playername === "" || gameId === "") {
        alert('Du skal indtaste både et brugernavn og spil kode');
        return;
    }
    console.log('Joining game with data:', JSON.stringify({ playername, gameId }));

    const socket = io('https://130.225.170.52:10242');

    // Emit the joinGame event to the server
    socket.emit('joinGame', { playername, gameId });

    socket.on('joinGameResponse', (data) => {
        console.log('joinGameResponse:', data); // Debugging: Log the response
        if (data.success) {
            const player = data.player; // Extract player details
            alert(`Player added: ID = ${player.id}, Name = ${player.name}, Game = ${player.gameId}`);
    
            const session = { playerId: player.id, gameId: player.gameId };
            localStorage.setItem('gameSession', JSON.stringify(session));
    
            // Update the waiting room view with the game code
            document.getElementById('waitingRoomView').innerHTML = `
                <h1>Venterum</h1>
                <p id="gameIdDisplay" style="display:none;">${player.gameId}</p>
                <p>Du har joinet spil ${player.gameId}. Vent på alle spillere</p>
                <button onclick="startGame('${player.gameId}')">Start Spil</button>
    
                <h2>Spillere:</h2>
                <!-- playerList is here -->
                <ul id="playerList"></ul>
            `;
            showView('waitingRoomView'); // Transition to waiting room view
    
            initializeSocket(player.gameId); // Initialize WebSocket for real-time updates
        } else {
            alert('Failed to join game: ' + (data.message || 'Unknown error'));
        }
    });

    // Listen for errors
    socket.on('joinGameError', (error) => {
        console.error('Error joining game:', error.message);
        alert('An error occurred while joining the game.');
    });
}

function initializeSocket(gameId) {
    const socket = io('https://130.225.170.52:10242');

    const savedSession = JSON.parse(localStorage.getItem('gameSession'));

    /*if (savedSession) {
        console.log("Loading Saved session")
        socket.emit('rejoinGame', savedSession);
        socket.emit('fetchPlayers', { gameId: savedSession.gameId }); // Fetch players after rejoining
    }*/

    // ✅ Every player should listen for the 'fetchPlayers' event and trigger fetching
    socket.on('fetchPlayers', (data) => {
        console.log('Received fetchPlayers event:', data);
        socket.emit('fetchPlayers', { gameId: data.gameId });  // Ensure all players fetch the updated list
    });

    // ✅ Handle playersFetched event correctly
    socket.on('playersFetched', (players) => {
        console.log('Players fetched:', players);
        updatePlayerList(players);
    });

    // ✅ Listen for real-time new player joins
    socket.on('playerJoined', (data) => {
        console.log('playerJoined event data:', data);
        socket.emit('fetchPlayers', { gameId: data.gameId });  // 🔹 Fetch new players when a player joins
    });

    socket.on('fetchPlayersError', (error) => {
        console.error('Error fetching players:', error.message);
        alert('Failed to fetch players. Please try again.');
    });
}

function updatePlayerList(players) {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = ''; // Clear the list

    const colors = ["one", "two", "three", "four", "five", "six"];
    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = player.name;
        li.classList.add(colors[index % colors.length]);
        playerList.appendChild(li);
    });
}
