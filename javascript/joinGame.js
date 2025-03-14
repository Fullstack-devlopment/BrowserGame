function joinGame() {
    let playername = document.getElementById('usernameInput').value.trim();
    let gameId = document.getElementById('gamePinInput').value.trim(); // Get the game code

    if (playername === "" || gameId === "") {
        alert('Du skal indtaste både et brugernavn og spil kode');
        return;
    }
    console.log('Joining game with data:', JSON.stringify({ playername, gameId }));

    fetch('https://130.225.170.52:3000/joinGame', { //other port 10242
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
        } else {
            alert('Failed to join game: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while joining the game.');
    });
}

