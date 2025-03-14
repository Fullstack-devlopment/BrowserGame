function joinGame() {
    let playername = document.getElementById('usernameInput').value.trim();
    let gameId = document.getElementById('gamePinInput').value.trim(); // Get the game code

    if (playername === "" || gameId === "") {
        alert('Du skal indtaste både et brugernavn og spil kode');
        return;
    }
    console.log('Joining game with data:', JSON.stringify({ playername, gameId }));

    fetch('https://130.225.170.52:10242/joinGame', { //other port 10242
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playername, gameId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Player successfully joined the game') {
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

            initializeSocket(player.gameId);
        } else {
            alert('Failed to join game: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while joining the game.');
    });
}


function initializeSocket(gameId) {
    const socket = io('https://130.225.170.52:10242');

    const savedSession = JSON.parse(localStorage.getItem('gameSession'));

    if (savedSession) {
        socket.emit('rejoinGame', savedSession);
        socket.emit('fetchPlayers', { gameId: savedSession.gameId }); // Fetch players after rejoining
    }

    socket.emit('fetchPlayers', { gameId });

    // Listen for the playersFetched event
    socket.on('playersFetched', (players) => {
        console.log('Players fetched:', players);
        const playerList = document.getElementById('playerList');
        playerList.innerHTML = ''; // Clear the list

        const colors = ["one", "two", "three", "four", "five", "six"];
        players.forEach((player, index) => {
            const li = document.createElement('li');
            li.textContent = player.name;
            li.classList.add(colors[index % colors.length]);
            playerList.appendChild(li);
        });
    });

    // Listen for errors
    socket.on('fetchPlayersError', (error) => {
        console.error('Error fetching players:', error.message);
        alert('Failed to fetch players. Please try again.');
    });

    // Handle real-time player joins
    socket.on('playerJoined', (data) => {
        console.log('playerJoined event data:', data);
        const currentGameId = document.getElementById('gameIdDisplay').textContent;
        if (data.gameId === currentGameId) {
            const playerList = document.getElementById('playerList');
            const playerExists = Array.from(playerList.children).some(li => li.textContent === data.playername);
            if (!playerExists) {
                const li = document.createElement('li');
                li.textContent = data.playername;
                playerList.appendChild(li);
            }
        }
    });
}
