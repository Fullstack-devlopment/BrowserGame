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
            console.log('Game created with ID:', data.gameId);
            showView('gameTableView');
            renderGameTable(data.gameId);
        } else {
            alert('Failed to create game: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the game.');
    });
}