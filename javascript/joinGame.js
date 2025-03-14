let socket; // Global socket variable

function joinGame() {
    if (socket) socket.disconnect(); // Ensure we don’t create multiple connections

    let playername = document.getElementById('usernameInput').value.trim();
    let gameId = document.getElementById('gamePinInput').value.trim(); 

    if (playername === "" || gameId === "") {
        alert('Du skal indtaste både et brugernavn og spil kode');
        return;
    }

    console.log('Joining game with data:', { playername, gameId });

    socket = io('https://130.225.170.52:10242');  // Create a single socket connection

    // 🔹 Emit joinGame event
    socket.emit('joinGame', { playername, gameId });

    // 🔹 Handle response from server
    socket.on('joinGameResponse', (data) => {
        if (data.success) {
            const player = data.player;
            const hostId = data.hostId;  // Assuming the server sends the hostId along with the response

            localStorage.setItem('playerSession', JSON.stringify({
                playerId: player.id, 
                playerName: player.name,
                gameId: player.gameId,
                hostId: hostId // Save the hostId in localStorage
            }));

            
            document.getElementById('gameIdText').textContent = player.gameId;
            showView('waitingRoomView'); 

            // 🔹 Now listen for real-time updates
            setupSocketListeners(gameId);

            checkIfHostAndUpdateUI(); // Check if the player is the host and update the UI. Used for now until React is introduced
        } else {
            alert('Failed to join game: ' + (data.message || 'Unknown error'));
        }
    });

    // 🔹 Handle errors
    socket.on('joinGameError', (error) => {
        console.error('Error joining game:', error.message);
        alert('An error occurred while joining the game.');
    });
}

// ✅ Extract real-time listeners into a separate function
function setupSocketListeners(gameId) {
    socket.emit('fetchPlayers', { gameId });

    // 🔹 Update player list when fetched
    socket.on('playersFetched', (players) => {
        console.log('Players fetched:', players);
        updatePlayerList(players);
    });

    // 🔹 Automatically refresh player list when someone joins
    socket.on('playerJoined', (data) => {
        console.log('New player joined:', data);
        socket.emit('fetchPlayers', { gameId });  
    });

    // 🔹 Handle fetch errors
    socket.on('fetchPlayersError', (error) => {
        console.error('Error fetching players:', error.message);
        alert('Failed to fetch players.');
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
