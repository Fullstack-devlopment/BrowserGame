function joinGame() {
    let username = document.getElementById('usernameInput').value.trim();
    if (username !== "") {
        // Send a POST request to the backend to add the player
        fetch('https://130.225.170.52:10241/addPlayer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Player added successfully') {
                console.log('Player added with ID:', data.playerId);
                showView('waitingRoomView');
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