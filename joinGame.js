function joinGame() {
    let playername = document.getElementById('usernameInput').value.trim();
    let gameId = document.getElementById('gamePinInput').value.trim(); // Get the game code

    if (playername === "" || gameId === "") {
        alert('Du skal indtaste både et brugernavn og spil kode');
        return;
    }

    fetch('https://130.225.170.52:10242/joinGame', {
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
                <p>Du har joinet spil ${player.gameId}. Vent på alle spillere</p>
                <button onclick="startGame('${player.gameId}')">Start Spil</button>
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