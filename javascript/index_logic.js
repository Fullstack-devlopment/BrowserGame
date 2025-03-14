function createGame() {
    fetch('https://130.225.170.52:10242/createGame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Game created successfully') {
            // Access gameId from the response and show it in the alert
            alert('Game created successfully! Game ID: ' + data.gameId);
        } else {
            alert('Failed to create game: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the game.');
    });
}


function checkIfHostAndUpdateUI() {
    const playerSession = JSON.parse(localStorage.getItem('playerSession'));

    if (!playerSession) {
        console.error('No player session found.');
        return;
    }

    const { playerId, hostId } = playerSession;
    const startButton = document.getElementById('startGameButton');

    if (!startButton) {
        console.error('Start game button not found!');
        return;
    }

    if (playerId === hostId) {
        startButton.style.display = 'block'; // Show button for host
    } else {
        startButton.style.display = 'none';  // Hide button for non-hosts
    }
}
