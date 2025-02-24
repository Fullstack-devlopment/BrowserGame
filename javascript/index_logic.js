function createGame() {
    fetch('http://130.225.170.52:10241/createGame', {
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


function joinGame() {
    let username = document.getElementById('usernameInput').value.trim();
    if (username !== "") {
        // Send a POST request to the backend to add the player
        fetch('http://130.225.170.52:10241/addPlayer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Player added successfully') {
                const player = data.player; // this should be the player object
                alert('Player added: ID = ' + player.id + ', Name = ' + player.name);
            } else {
                alert('Failed to join game: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while joining the game.');
        });
    } else {
        alert('Du skal indtaste et brugernavn');
    }
}